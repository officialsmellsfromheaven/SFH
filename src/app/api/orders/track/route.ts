import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function cleanOrderNumber(value: unknown) {
  return String(value ?? "").trim().slice(0, 100);
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const orderNumber = cleanOrderNumber(body?.orderNumber);

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: "Order ID is required." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Order tracking: Supabase server credentials are missing.");
      return NextResponse.json(
        {
          success: false,
          error: "Order tracking is temporarily unavailable. Please contact support.",
        },
        { status: 503 }
      );
    }

    // Service-role access stays server-side. The browser receives only
    // non-sensitive tracking fields below.
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabase
      .from("orders")
      .select("order_number, payment_status, order_status, created_at")
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (error) {
      console.error("Order tracking lookup failed:", error);
      return NextResponse.json(
        {
          success: false,
          error: "We couldn't check that order right now. Please try again.",
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error:
            "We couldn't find an order with that ID. Please check the order ID and try again.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: String(data.order_number),
        paymentStatus: String(data.payment_status ?? "pending"),
        orderStatus: String(data.order_status ?? "pending"),
        createdAt: data.created_at ?? null,
      },
    });
  } catch (error) {
    console.error("Order tracking request failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to track your order right now. Please try again.",
      },
      { status: 500 }
    );
  }
}
