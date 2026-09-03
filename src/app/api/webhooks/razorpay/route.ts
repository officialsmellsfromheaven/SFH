import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey)
    : null;

export async function POST(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Webhook service is not configured." }, { status: 500 });
    }

    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? process.env.WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json({ success: false, error: "Webhook secret is not configured." }, { status: 500 });
    }

    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") ?? "";
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const isValid =
      signature.length === expectedSignature.length &&
      crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSignature, "hex"));

    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid Razorpay webhook signature." }, { status: 400 });
    }

    const event = JSON.parse(rawBody) as {
      event?: string;
      payload?: {
        payment?: {
          entity?: {
            id?: string;
            order_id?: string;
            amount?: number;
            currency?: string;
            status?: string;
          };
        };
      };
    };

    const paymentEntity = event?.payload?.payment?.entity;

    if (!paymentEntity?.order_id || !paymentEntity?.id) {
      return NextResponse.json({ success: true, received: true });
    }

    const { data: order, error: orderLookupError } = await supabase
      .from("orders")
      .select("id, order_number, total_amount, payment_status, razorpay_order_id, razorpay_payment_id")
      .eq("razorpay_order_id", paymentEntity.order_id)
      .maybeSingle();

    if (orderLookupError) {
      throw orderLookupError;
    }

    if (!order) {
      return NextResponse.json({ success: true, received: true, ignored: true });
    }

    if (order.payment_status === "PAID" && order.razorpay_payment_id === paymentEntity.id) {
      return NextResponse.json({ success: true, received: true, existing: true });
    }

    const shouldMarkPaid =
      event.event === "payment.captured" ||
      event.event === "payment.authorized" ||
      event.event === "order.paid";

    if (!shouldMarkPaid) {
      return NextResponse.json({ success: true, received: true, ignored: true });
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        payment_status: "PAID",
        order_status: "CONFIRMED",
        razorpay_payment_id: paymentEntity.id,
        paid_at: new Date().toISOString(),
      })
      .eq("id", order.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true, received: true, orderNumber: order.order_number });
  } catch (error) {
    console.error("Razorpay webhook processing failed:", error);
    return NextResponse.json({ success: false, error: "Webhook processing failed." }, { status: 500 });
  }
}
