import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { ADMIN_UPDATE_STATUSES, canTransitionOrderStatus, fetchAdminOrder, getAdminSupabase } from "@/lib/admin-orders";
import { notifyOrder, type OrderNotificationType } from "@/lib/email/resend";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> | { orderNumber: string } },
) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { orderNumber } = await Promise.resolve(params);
  try {
    const result = await fetchAdminOrder(decodeURIComponent(orderNumber));
    return result ? NextResponse.json(result) : NextResponse.json({ error: "Order not found." }, { status: 404 });
  } catch (error) {
    console.error("Admin order details failed:", error);
    return NextResponse.json({ error: "Unable to load order details." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> | { orderNumber: string } },
) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { orderNumber } = await Promise.resolve(params);
  const body = await request.json().catch(() => null);
  const nextStatus = typeof body?.order_status === "string" ? body.order_status : "";
  if (!ADMIN_UPDATE_STATUSES.includes(nextStatus as (typeof ADMIN_UPDATE_STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid order status." }, { status: 400 });
  }
  const supabase = getAdminSupabase();
  if (!supabase) return NextResponse.json({ error: "Unable to update order." }, { status: 503 });
  try {
    const current = await fetchAdminOrder(decodeURIComponent(orderNumber));
    if (!current) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    if (!canTransitionOrderStatus(current.order.order_status, nextStatus)) {
      return NextResponse.json({ error: `Cannot change ${current.order.order_status} to ${nextStatus}.` }, { status: 409 });
    }
    const { data, error } = await supabase
      .from("orders")
      .update({ order_status: nextStatus })
      .eq("id", current.order.id)
      .eq("order_status", current.order.order_status)
      .select("order_number, order_status, payment_status")
      .single();
    if (error) throw error;
    const notificationType: Partial<Record<string, OrderNotificationType>> = {
      PROCESSING: "ORDER_PROCESSING_CUSTOMER",
      SHIPPED: "ORDER_SHIPPED_CUSTOMER",
      DELIVERED: "ORDER_DELIVERED_CUSTOMER",
      CANCELLED: "ORDER_CANCELLED_CUSTOMER",
    };
    const type = notificationType[nextStatus];
    if (type) {
      try {
        await notifyOrder(current.order.id, [type]);
      } catch (notificationError) {
        console.error("[Email] status notification processing failed:", notificationError instanceof Error ? notificationError.message : "unknown error");
      }
    }
    return NextResponse.json({ order: data });
  } catch (error) {
    console.error("Admin order status update failed:", error);
    return NextResponse.json({ error: "Unable to update order status. Please try again." }, { status: 500 });
  }
}
