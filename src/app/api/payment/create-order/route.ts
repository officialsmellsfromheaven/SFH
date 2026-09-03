import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Razorpay from "razorpay";

import {
  calculateServerOrderSummary,
  sanitizeCustomer,
  validateServerCustomer,
} from "@/lib/order-server";
import { allocateSFHOrderNumber } from "@/lib/order-number";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

const supabase =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey)
    : null;

function createRazorpayClient() {
  if (!razorpayKeyId || !razorpayKeySecret) {
    throw new Error("Razorpay environment variables are missing.");
  }

  return new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret,
  });
}

export async function POST(request: Request) {
  try {
    // ---------------------------------------------------------
    // 1. Environment validation
    // ---------------------------------------------------------
    if (!supabase) {
      console.error("Payment session error: Supabase is not configured.");

      return NextResponse.json(
        {
          success: false,
          error: "Order service is not configured.",
        },
        { status: 500 }
      );
    }

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error(
        "Payment session error: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing."
      );

      return NextResponse.json(
        {
          success: false,
          error: "Payment service is not configured.",
        },
        { status: 500 }
      );
    }

    // ---------------------------------------------------------
    // 2. Read request
    // ---------------------------------------------------------
    const body = await request.json().catch(() => null);

    if (!body) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid checkout request.",
        },
        { status: 400 }
      );
    }

    const customer = sanitizeCustomer(body.customer);
    const items = Array.isArray(body.items) ? body.items : [];
    const checkoutId = typeof body.checkoutId === "string" ? body.checkoutId.trim() : "";
    if (!checkoutId || checkoutId.length > 100) {
      return NextResponse.json({ success: false, error: "Invalid checkout session." }, { status: 400 });
    }

    // ---------------------------------------------------------
    // 3. Validate cart
    // ---------------------------------------------------------
    if (!items.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Your cart is empty.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // 4. Validate customer
    // ---------------------------------------------------------
    const customerValidation = validateServerCustomer(customer);

    if (!customerValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: customerValidation.error,
        },
        { status: 400 }
      );
    }
    const verifiedCustomer = customerValidation.customer;

    // ---------------------------------------------------------
    // 5. Calculate trusted server-side total
    // ---------------------------------------------------------
    let orderSummary;

    try {
      orderSummary = calculateServerOrderSummary(items);
    } catch (error) {
      console.error("Server order calculation failed:", error);

      return NextResponse.json(
        {
          success: false,
          error: "Unable to calculate your order total.",
        },
        { status: 400 }
      );
    }

    const finalAmount = Number(orderSummary.totalAmount.toFixed(2));

    if (!Number.isFinite(finalAmount) || finalAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order total must be greater than zero.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // 6. Check whether this checkout already has an order
    // ---------------------------------------------------------
    const { data: existingOrder, error: existingOrderError } =
      await supabase
        .from("orders")
        .select(
          "id, order_number, total_amount, payment_status, order_status, razorpay_order_id"
        )
        .eq("checkout_id", checkoutId)
        .maybeSingle();

    if (existingOrderError) {
      console.error(
        "Supabase existing-order lookup failed:",
        existingOrderError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to access the order service. Please try again.",
        },
        { status: 500 }
      );
    }
    let orderNumber = existingOrder?.order_number ?? await allocateSFHOrderNumber(supabase);

    // ---------------------------------------------------------
    // 7. Reuse existing Razorpay order
    // ---------------------------------------------------------
    if (existingOrder) {
      if (existingOrder.razorpay_order_id) {
        return NextResponse.json({
          success: true,
          orderNumber: existingOrder.order_number,
          orderId: existingOrder.id,
          amount: Math.round(Number(existingOrder.total_amount) * 100),
          currency: "INR",
          keyId: razorpayKeyId,
          razorpayOrderId: existingOrder.razorpay_order_id,
          alreadyExists: true,
        });
      }

      // Existing DB order without Razorpay order.
      // Continue and create a Razorpay order for it.
    }

    // ---------------------------------------------------------
    // 8. Create Razorpay order
    // ---------------------------------------------------------
    let razorpayOrder;

    try {
      const razorpay = createRazorpayClient();

      razorpayOrder = await razorpay.orders.create({
        amount: Math.round(finalAmount * 100),
        currency: "INR",
        receipt: existingOrder?.order_number ?? "SFH-PENDING",
        notes: {
          checkout_id: checkoutId,
          ...(existingOrder?.order_number ? { order_number: existingOrder.order_number } : {}),
        },
      });
    } catch (error) {
      console.error("Razorpay API order creation failed:", error);

      return NextResponse.json(
        {
          success: false,
          error:
            "Unable to connect to the payment service. Please try again.",
        },
        { status: 502 }
      );
    }

    // ---------------------------------------------------------
    // 9. Create or update Supabase order
    // ---------------------------------------------------------
    let orderId: string;
    let totalAmount: number;

    if (existingOrder) {
      const { data: updatedOrder, error: updateError } =
        await supabase
          .from("orders")
          .update({
            razorpay_order_id: razorpayOrder.id,
            subtotal: orderSummary.subtotal,
            shipping_amount: orderSummary.shippingAmount,
            discount_amount: orderSummary.discountAmount,
            gst_amount: orderSummary.gstAmount,
            total_amount: finalAmount,
            payment_status: "PENDING",
            order_status: "PAYMENT_PENDING",
          })
          .eq("id", existingOrder.id)
          .select("id, order_number, total_amount")
          .single();

      if (updateError) {
        console.error(
          "Supabase existing-order update failed:",
          updateError
        );

        return NextResponse.json(
          {
            success: false,
            error:
              "Payment order was created, but we could not save the order. Please contact support.",
          },
          { status: 500 }
        );
      }

      orderId = updatedOrder.id;
      orderNumber = updatedOrder.order_number;
      totalAmount = Number(updatedOrder.total_amount);
    } else {
      const { data: order, error: orderInsertError } =
        await supabase
          .from("orders")
          .insert({
            order_number: orderNumber,
            checkout_id: checkoutId,
            customer_name: verifiedCustomer.name,
            customer_phone: verifiedCustomer.phone,
            customer_email: verifiedCustomer.email,
            address_line1: verifiedCustomer.address,
            city: verifiedCustomer.city,
            state: verifiedCustomer.state,
            pincode: verifiedCustomer.pincode,
            subtotal: Number(orderSummary.subtotal.toFixed(2)),
            shipping_amount: orderSummary.shippingAmount,
            discount_amount: Number(
              orderSummary.discountAmount.toFixed(2)
            ),
            gst_amount: orderSummary.gstAmount,
            total_amount: finalAmount,
            payment_status: "PENDING",
            order_status: "PAYMENT_PENDING",
            razorpay_order_id: razorpayOrder.id,
          })
          .select("id, order_number, total_amount")
          .single();

      if (orderInsertError) {
        console.error("Supabase order insert failed:", {
          operation: "insert",
          table: "orders",
          code: orderInsertError.code,
          message: orderInsertError.message,
        });

        return NextResponse.json(
          {
            success: false,
            error:
              "Payment order was created, but we could not save your order. Please try again.",
          },
          { status: 500 }
        );
      }

      orderId = order.id;
      orderNumber = order.order_number;
      totalAmount = Number(order.total_amount);

      // -------------------------------------------------------
      // 10. Save order items
      // -------------------------------------------------------
      const orderItems = orderSummary.orderItems.map((item) => ({
        ...item,
        order_id: order.id,
      }));

      const { error: orderItemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (orderItemsError) {
        console.error(
          "Supabase order-items insert failed:",
          orderItemsError
        );

        // Roll back the order record if order items fail.
        await supabase
          .from("orders")
          .delete()
          .eq("id", order.id);

        return NextResponse.json(
          {
            success: false,
            error:
              "Unable to save your order items. Please try again.",
          },
          { status: 500 }
        );
      }
    }

    // ---------------------------------------------------------
    // 11. Return Razorpay checkout information
    // ---------------------------------------------------------
    return NextResponse.json({
      success: true,
      orderNumber,
      orderId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: razorpayKeyId,
      razorpayOrderId: razorpayOrder.id,
      totalAmount,
    });
  } catch (error) {
    console.error("Unexpected payment session error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to create your payment session. Please try again.",
      },
      { status: 500 }
    );
  }
}