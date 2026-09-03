import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { razorpay } from "@/lib/razorpay";
import { createOrderAccessToken } from "@/lib/order-access";
import { notifyOrder } from "@/lib/email/resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey)
    : null;

export async function POST(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Order service is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => null);
    const razorpayOrderId = String(body?.razorpayOrderId ?? "").trim();
    const razorpayPaymentId = String(body?.razorpayPaymentId ?? "").trim();
    const razorpaySignature = String(body?.razorpaySignature ?? "").trim();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { success: false, error: "Missing Razorpay payment details." },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      throw new Error("Missing RAZORPAY_KEY_SECRET");
    }

    const { data: existingOrder, error: existingOrderError } = await supabase
      .from("orders")
      .select("id, order_number, total_amount, payment_status, razorpay_order_id, razorpay_payment_id, razorpay_signature")
      .eq("razorpay_order_id", razorpayOrderId)
      .maybeSingle();

    if (existingOrderError) {
      throw existingOrderError;
    }

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: "No matching server-created order was found for this payment." },
        { status: 400 }
      );
    }

    if (existingOrder.payment_status === "PAID" && existingOrder.razorpay_payment_id === razorpayPaymentId) {
      try {
        await notifyOrder(existingOrder.id, ["ORDER_CONFIRMED_CUSTOMER", "ORDER_CONFIRMED_ADMIN"], `${new URL(request.url).origin}/order/${encodeURIComponent(existingOrder.order_number)}?token=${encodeURIComponent(createOrderAccessToken(existingOrder.order_number))}`);
      } catch (notificationError) {
        console.error("[Email] confirmation notification processing failed:", notificationError instanceof Error ? notificationError.message : "unknown error");
      }
      return NextResponse.json({
        success: true,
        orderNumber: existingOrder.order_number,
        accessToken: createOrderAccessToken(existingOrder.order_number),
        paymentId: razorpayPaymentId,
        orderId: razorpayOrderId,
        alreadyProcessed: true,
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const expectedSignatureBuffer = Buffer.from(expectedSignature, "hex");
    const providedSignatureBuffer = Buffer.from(razorpaySignature, "hex");
    const signaturesMatch =
      expectedSignatureBuffer.length === providedSignatureBuffer.length &&
      crypto.timingSafeEqual(expectedSignatureBuffer, providedSignatureBuffer);

    if (!signaturesMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature." },
        { status: 400 }
      );
    }

    const payment = await razorpay.payments.fetch(razorpayPaymentId);

    if (payment.order_id !== razorpayOrderId) {
      return NextResponse.json(
        { success: false, error: "Payment does not belong to the expected order." },
        { status: 400 }
      );
    }

    if (payment.currency !== "INR") {
      return NextResponse.json(
        { success: false, error: "Payment currency is invalid." },
        { status: 400 }
      );
    }

    const expectedAmountInPaise = Math.round(Number(existingOrder.total_amount) * 100);

    if (Number(payment.amount) !== expectedAmountInPaise || !["captured", "paid"].includes(String(payment.status ?? ""))) {
      return NextResponse.json(
        { success: false, error: "Payment has not been captured or the amount does not match the order." },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "PAID",
        order_status: "CONFIRMED",
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
        paid_at: new Date().toISOString(),
      })
      .eq("id", existingOrder.id);

    if (updateError) {
      throw updateError;
    }
    try {
      await notifyOrder(existingOrder.id, ["ORDER_CONFIRMED_CUSTOMER", "ORDER_CONFIRMED_ADMIN"], `${new URL(request.url).origin}/order/${encodeURIComponent(existingOrder.order_number)}?token=${encodeURIComponent(createOrderAccessToken(existingOrder.order_number))}`);
    } catch (notificationError) {
      console.error("[Email] confirmation notification processing failed:", notificationError instanceof Error ? notificationError.message : "unknown error");
    }

    return NextResponse.json({
      success: true,
      paymentId: razorpayPaymentId,
      orderId: razorpayOrderId,
      orderNumber: existingOrder.order_number,
      accessToken: createOrderAccessToken(existingOrder.order_number),
    });
  } catch (error) {
    console.error("Razorpay payment verification failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to verify payment.",
      },
      { status: 500 }
    );
  }
}
