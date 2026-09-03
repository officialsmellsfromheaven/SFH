import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  calculateServerOrderSummary,
  sanitizeCustomer,
  validateServerCustomer,
} from "@/lib/order-server";
import { allocateSFHOrderNumber, isValidOrderNumber } from "@/lib/order-number";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey)
    : null;

export async function GET(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Order service is not configured." }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("order")?.trim() ?? "";

    if (!isValidOrderNumber(orderNumber)) {
      return NextResponse.json({ success: false, error: "Order number is required." }, { status: 400 });
    }

    const { data: order, error } = await supabase
      .from("orders")
      .select("id, order_number, customer_name, customer_email, customer_phone, city, state, pincode, total_amount, payment_status, order_status, created_at, paid_at, razorpay_order_id, razorpay_payment_id")
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Order fetch failed:", error);
    return NextResponse.json({ success: false, error: "Unable to fetch order." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!supabase) {
      return NextResponse.json({ success: false, error: "Order service is not configured." }, { status: 500 });
    }

    const body = await request.json().catch(() => null);
    const customer = sanitizeCustomer(body?.customer);
    const items = Array.isArray(body?.items) ? body.items : [];
    const paymentStatus = "PENDING";
    const orderStatus = "PAYMENT_PENDING";

    if (!customer || !items.length) {
      return NextResponse.json({ success: false, error: "Customer details and at least one order item are required." }, { status: 400 });
    }

    const customerValidation = validateServerCustomer(customer);

    if (!customerValidation.valid) {
      return NextResponse.json({ success: false, error: customerValidation.error }, { status: 400 });
    }

    const summary = calculateServerOrderSummary(items);
    const finalAmount = Number(summary.totalAmount.toFixed(2));
    const orderNumber = await allocateSFHOrderNumber(supabase);

    const { data: order, error: orderInsertError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: customerValidation.customer.name,
        customer_phone: customerValidation.customer.phone,
        customer_email: customerValidation.customer.email,
        address_line1: customerValidation.customer.address,
        city: customerValidation.customer.city,
        state: customerValidation.customer.state,
        pincode: customerValidation.customer.pincode,
        subtotal: Number(summary.subtotal.toFixed(2)),
        shipping_amount: summary.shippingAmount,
        discount_amount: Number(summary.discountAmount.toFixed(2)),
        gst_amount: summary.gstAmount,
        total_amount: finalAmount,
        payment_status: paymentStatus,
        order_status: orderStatus,
      })
      .select("id, order_number, total_amount")
      .single();

    if (orderInsertError) {
      throw orderInsertError;
    }

    const orderItems = summary.orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (orderItemsError) {
      await supabase.from("orders").delete().eq("id", order.id);
      throw orderItemsError;
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        totalAmount: order.total_amount,
      },
    });
  } catch (error) {
    console.error("Order API error:", error);
    return NextResponse.json({ error: "Unable to create the order. Please try again." }, { status: 500 });
  }
}
