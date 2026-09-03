import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getAdminSupabase, getOrderSelect, normalizeDateFilter, type AdminOrder } from "@/lib/admin-orders";

export async function GET(request: Request) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const supabase = getAdminSupabase();
  if (!supabase) return NextResponse.json({ error: "Unable to load orders." }, { status: 503 });
  const params = new URL(request.url).searchParams;
  const page = Math.max(1, Number.parseInt(params.get("page") ?? "1", 10) || 1);
  const pageSize = 20;
  const search = (params.get("search")?.trim() ?? "").replace(/[(),]/g, " ").slice(0, 120);
  const paymentStatus = params.get("paymentStatus") ?? "all";
  const orderStatus = params.get("orderStatus") ?? "all";
  const sort = params.get("sort") ?? "newest";
  const dateFrom = normalizeDateFilter(params.get("date"));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    let query = supabase.from("orders").select(getOrderSelect(), { count: "exact" });
    if (search) query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,customer_phone.ilike.%${search}%`);
    if (paymentStatus !== "all") query = query.eq("payment_status", paymentStatus);
    if (orderStatus !== "all") query = query.eq("order_status", orderStatus);
    if (dateFrom) query = query.gte("created_at", dateFrom);
    if (sort === "highest") query = query.order("total_amount", { ascending: false });
    else if (sort === "lowest") query = query.order("total_amount", { ascending: true });
    else query = query.order("created_at", { ascending: sort === "oldest" });
    const { data, error, count } = await query.range(from, to);
    if (error) throw error;

    const orders = (data ?? []) as AdminOrder[];
    const ids = orders.map((order) => order.id);
    const itemCounts = new Map<string, number>();
    if (ids.length) {
      const { data: itemRows, error: itemError } = await supabase.from("order_items").select("order_id").in("order_id", ids);
      if (itemError) throw itemError;
      for (const row of itemRows ?? []) itemCounts.set(String(row.order_id), (itemCounts.get(String(row.order_id)) ?? 0) + 1);
    }
    const enriched = orders.map((order) => ({ ...order, item_count: itemCounts.get(order.id) ?? 0 }));
    const total = count ?? 0;
    return NextResponse.json({ orders: enriched, page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) });
  } catch (error) {
    console.error("Admin order list failed:", error);
    return NextResponse.json({ error: "Unable to load orders. Please try again." }, { status: 500 });
  }
}
