"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AdminOrder, OrderListResponse } from "@/lib/admin-orders";
import { formatPrice } from "@/lib/utils";

const statuses = ["all", "PAYMENT_PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
const payments = ["all", "PENDING", "PAID", "FAILED", "REFUNDED"];

export default function AdminOrdersClient() {
  const [data, setData] = useState<OrderListResponse | null>(null);
  const [search, setSearch] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [orderStatus, setOrderStatus] = useState("all");
  const [date, setDate] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const query = new URLSearchParams({ page: String(page), search, paymentStatus, orderStatus, date, sort });
    const timeout = window.setTimeout(() => {
      fetch(`/api/admin/orders?${query}`, { signal: controller.signal })
        .then(async (response) => {
          const payload = (await response.json()) as OrderListResponse & { error?: string };
          if (!response.ok) throw new Error(payload.error ?? "Unable to load orders.");
          setData(payload);
          setError("");
        })
        .catch((fetchError: unknown) => {
          if (fetchError instanceof Error && fetchError.name !== "AbortError") setError(fetchError.message);
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [page, search, paymentStatus, orderStatus, date, sort]);

  function clearFilters() {
    setLoading(true);
    setSearch("");
    setPaymentStatus("all");
    setOrderStatus("all");
    setDate("all");
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#bf4800]">Admin</p><h1 className="mt-2 text-4xl font-bold text-stone-900">Order Management</h1></div>
          <button onClick={() => fetch("/api/admin/auth", { method: "DELETE" }).then(() => { window.location.href = "/admin/login"; })} className="self-start rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold text-stone-700">Sign out</button>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input value={search} onChange={(event) => { setLoading(true); setSearch(event.target.value); setPage(1); }} placeholder="Search order, name, email, phone..." className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm lg:col-span-2" />
          <select value={paymentStatus} onChange={(event) => { setLoading(true); setPaymentStatus(event.target.value); setPage(1); }} className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm">{payments.map((value) => <option key={value} value={value}>{value === "all" ? "All payments" : value}</option>)}</select>
          <select value={orderStatus} onChange={(event) => { setLoading(true); setOrderStatus(event.target.value); setPage(1); }} className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm">{statuses.map((value) => <option key={value} value={value}>{value === "all" ? "All statuses" : value}</option>)}</select>
          <select value={sort} onChange={(event) => { setLoading(true); setSort(event.target.value); setPage(1); }} className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="highest">Highest amount</option><option value="lowest">Lowest amount</option></select>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm"><span className="font-semibold text-stone-600">Date:</span>{["all", "today", "7", "30"].map((value) => <button key={value} onClick={() => { setLoading(true); setDate(value); setPage(1); }} className={`rounded-full px-3 py-1.5 ${date === value ? "bg-[#bf4800] text-white" : "bg-white text-stone-600 ring-1 ring-stone-200"}`}>{value === "all" ? "All" : value === "today" ? "Today" : `Last ${value} days`}</button>)}<button onClick={clearFilters} className="ml-2 text-[#bf4800] underline">Clear</button></div>
        {error ? <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
        <div className="mt-6 overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-sm">
          {loading ? <div className="p-10 text-center text-stone-500">Loading orders...</div> : data?.orders.length ? <OrderTable orders={data.orders} /> : <div className="p-12 text-center"><p className="font-semibold text-stone-800">{search || paymentStatus !== "all" || orderStatus !== "all" ? "No matching orders found." : "No orders found."}</p><button onClick={clearFilters} className="mt-3 text-sm text-[#bf4800] underline">Clear filters</button></div>}
        </div>
        {data && data.totalPages > 1 ? <div className="mt-5 flex items-center justify-between text-sm text-stone-600"><span>Showing {(data.page - 1) * data.pageSize + 1}–{Math.min(data.page * data.pageSize, data.total)} of {data.total}</span><div className="flex gap-2"><button disabled={page <= 1} onClick={() => { setLoading(true); setPage((value) => value - 1); }} className="rounded-full border border-stone-200 bg-white px-4 py-2 disabled:opacity-40">Previous</button><span className="rounded-full bg-stone-900 px-4 py-2 text-white">{data.page} / {data.totalPages}</span><button disabled={page >= data.totalPages} onClick={() => { setLoading(true); setPage((value) => value + 1); }} className="rounded-full border border-stone-200 bg-white px-4 py-2 disabled:opacity-40">Next</button></div></div> : null}
      </div>
    </main>
  );
}

function OrderTable({ orders }: { orders: AdminOrder[] }) {
  return <div className="divide-y divide-stone-100">{orders.map((order) => <div key={order.id} className="grid gap-3 p-5 sm:grid-cols-[1.3fr_1.5fr_1fr_0.8fr_0.9fr_0.9fr_auto] sm:items-center"><div><p className="font-semibold text-stone-900">{order.order_number}</p><p className="text-xs text-stone-500">{new Date(order.created_at).toLocaleDateString("en-IN")}</p></div><div><p className="font-medium text-stone-800">{order.customer_name}</p><p className="truncate text-xs text-stone-500">{order.customer_email}</p></div><div className="text-sm text-stone-600">{order.item_count} {order.item_count === 1 ? "item" : "items"}</div><div className="font-semibold text-stone-900">{formatPrice(Number(order.total_amount))}</div><StatusBadge value={order.payment_status} /><StatusBadge value={order.order_status} /><Link href={`/admin/orders/${encodeURIComponent(order.order_number)}`} className="rounded-full bg-[#bf4800] px-4 py-2 text-center text-sm font-semibold text-white">View</Link></div>)}</div>;
}

function StatusBadge({ value }: { value: string }) {
  const tone = value === "PAID" || value === "DELIVERED" ? "bg-emerald-100 text-emerald-800" : value === "FAILED" || value === "CANCELLED" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800";
  return <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>{value}</span>;
}
