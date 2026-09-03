import { createClient } from "@supabase/supabase-js";
import type { HistoricalOrder, HistoricalOrderItem } from "@/lib/order-server";

export type OrderStatus = HistoricalOrder["order_status"];
export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type AdminOrder = HistoricalOrder & {
  paid_at: string | null;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  item_count: number;
};

export type AdminOrderItem = HistoricalOrderItem;

export type OrderListResponse = {
  orders: AdminOrder[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function getAdminSupabase() {
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
}

export const ORDER_STATUSES: OrderStatus[] = [
  "PAYMENT_PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export const ADMIN_UPDATE_STATUSES: OrderStatus[] = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PAYMENT_PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export function canTransitionOrderStatus(current: string, next: string): next is OrderStatus {
  return ORDER_STATUSES.includes(current as OrderStatus) && ALLOWED_TRANSITIONS[current as OrderStatus].includes(next as OrderStatus);
}

export function getOrderSelect() {
  return "id, order_number, customer_name, customer_email, customer_phone, address_line1, city, state, pincode, subtotal, discount_amount, shipping_amount, gst_amount, total_amount, payment_status, order_status, created_at, paid_at, razorpay_order_id, razorpay_payment_id";
}

export async function fetchAdminOrder(orderNumber: string) {
  const supabase = getAdminSupabase();
  if (!supabase) throw new Error("Admin order service is not configured.");
  const { data: order, error } = await supabase.from("orders").select(getOrderSelect()).eq("order_number", orderNumber).maybeSingle();
  if (error) throw error;
  if (!order) return null;
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("item_type, product_id, product_name, combo_name, bottle_size, quantity, unit_price, total_price, reference_price, discount_amount, savings, pricing_rule, selected_product_names, selected_product_images")
    .eq("order_id", order.id)
    .order("id", { ascending: true });
  if (itemsError) throw itemsError;
  return { order: order as AdminOrder, items: (items ?? []) as AdminOrderItem[] };
}

export function normalizeDateFilter(value: string | null) {
  if (!value || value === "all") return null;
  const days = value === "today" ? 1 : value === "7" ? 7 : value === "30" ? 30 : 0;
  if (!days) return null;
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  if (value !== "today") date.setDate(date.getDate() - (days - 1));
  return date.toISOString();
}
