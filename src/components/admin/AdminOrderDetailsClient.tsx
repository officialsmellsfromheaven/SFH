"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AdminOrder, AdminOrderItem } from "@/lib/admin-orders";
import { formatPrice } from "@/lib/utils";

type Details = { order: AdminOrder; items: AdminOrderItem[] };
const updateStatuses = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function AdminOrderDetailsClient({ orderNumber }: { orderNumber: string }) {
  const [details, setDetails] = useState<Details | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/orders/${encodeURIComponent(orderNumber)}`)
      .then(async (response) => {
        const payload = (await response.json()) as Details & { error?: string };
        if (!response.ok) throw new Error(payload.error ?? "Unable to load order.");
        setDetails(payload);
        setStatus(payload.order.order_status);
      })
      .catch((fetchError: unknown) => setError(fetchError instanceof Error ? fetchError.message : "Unable to load order."))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  async function updateStatus(nextStatus: string) {
    if (!details || nextStatus === details.order.order_status) return;
    if (nextStatus === "CANCELLED" && !window.confirm("Are you sure you want to cancel this order?")) {
      setStatus(details.order.order_status);
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/orders/${encodeURIComponent(orderNumber)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order_status: nextStatus }) });
      const payload = (await response.json()) as { order?: Pick<AdminOrder, "order_status" | "payment_status">; error?: string };
      if (!response.ok || !payload.order) throw new Error(payload.error ?? "Unable to update order status.");
      setDetails((current) => current ? { ...current, order: { ...current.order, order_status: payload.order?.order_status ?? current.order.order_status, payment_status: payload.order?.payment_status ?? current.order.payment_status } } : current);
      setStatus(payload.order.order_status);
      setMessage("Order status updated successfully.");
    } catch (updateError) {
      setStatus(details.order.order_status);
      setError(updateError instanceof Error ? updateError.message : "Unable to update order status. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main className="min-h-screen bg-stone-50 p-10 text-center text-stone-500">Loading order details...</main>;
  if (error || !details) return <main className="min-h-screen bg-stone-50 px-4 py-16"><div className="mx-auto max-w-xl rounded-[28px] bg-white p-8 text-center"><p className="text-red-600">{error || "Order not found."}</p><Link href="/admin/orders" className="mt-5 inline-block text-[#bf4800] underline">Back to orders</Link></div></main>;

  const { order, items } = details;
  const personalizationTotal = items.reduce((sum, item) => sum + numberValue(getRule(item).personalization_charge), 0);

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link href="/admin/orders" className="text-sm font-semibold text-[#bf4800]">&lt;- Back to orders</Link>
        <section className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#bf4800]">Order</p><h1 className="mt-2 text-3xl font-bold text-stone-900">{order.order_number}</h1><p className="mt-2 text-sm text-stone-500">{new Date(order.created_at).toLocaleString("en-IN")}</p></div><div className="flex flex-wrap items-center gap-3"><span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800">{order.payment_status}</span><select value={status} disabled={saving || !updateStatuses.includes(order.order_status)} onChange={(event) => updateStatus(event.target.value)} className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm"><option value={order.order_status}>{order.order_status}</option>{updateStatuses.filter((value) => value !== order.order_status).map((value) => <option key={value} value={value}>{value}</option>)}</select></div></div>
          {message ? <p className="mt-4 text-sm font-semibold text-emerald-700">{message}</p> : null}
          <div className="mt-6 grid gap-3 sm:grid-cols-3"><Info label="Payment status" value={order.payment_status} /><Info label="Order status" value={order.order_status} /><Info label="Payment date" value={order.paid_at ? new Date(order.paid_at).toLocaleString("en-IN") : "—"} /></div>
          {order.razorpay_order_id || order.razorpay_payment_id ? <div className="mt-5 rounded-2xl bg-stone-50 p-4 text-sm text-stone-600"><p>Razorpay order ID: {order.razorpay_order_id || "—"}</p><p className="mt-1">Razorpay payment ID: {order.razorpay_payment_id || "—"}</p></div> : null}
          <a href={`/api/admin/orders/${encodeURIComponent(order.order_number)}/invoice`} className="mt-5 inline-flex rounded-full bg-[#bf4800] px-5 py-3 text-sm font-semibold text-white">Download Invoice</a>
        </section>
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-stone-900">Order items</h2><div className="mt-5 space-y-5">{items.map((item, index) => <Item key={`${item.product_id ?? item.combo_name ?? "item"}-${index}`} item={item} />)}</div></section>
          <div className="space-y-6"><section className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-stone-900">Customer details</h2><div className="mt-4 space-y-2 text-sm text-stone-600"><p className="font-semibold text-stone-900">{order.customer_name}</p><p>{order.customer_email}</p><p>{order.customer_phone}</p><p>{order.address_line1}</p><p>{order.city}, {order.state} - {order.pincode}</p></div></section><section className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-stone-900">Pricing</h2><div className="mt-4 space-y-3 text-sm"><Row label="Subtotal" value={order.subtotal} />{personalizationTotal > 0 ? <Row label="Personalization" value={personalizationTotal} /> : null}{numberValue(order.discount_amount) > 0 ? <Row label="Discount" value={-numberValue(order.discount_amount)} /> : null}<Row label="Shipping" value={numberValue(order.shipping_amount) || "FREE"} /><Row label="GST" value={order.gst_amount} /><Row label="Grand Total" value={order.total_amount} strong /></div></section></div>
        </div>
      </div>
    </main>
  );
}

function Item({ item }: { item: AdminOrderItem }) {
  const rule = getRule(item);
  const personalizationType = String(rule.personalization_type ?? "").trim();
  const personalizationText = String(rule.personalization_text ?? "").trim();
  const personalizationCharge = numberValue(rule.personalization_charge);
  const name = item.item_type === "combo" ? item.combo_name || "Combo" : item.product_name || "Product";
  return <div className="border-b border-stone-100 pb-5 last:border-0 last:pb-0"><div className="flex justify-between gap-4"><div><p className="font-semibold text-stone-900">{name}</p><p className="mt-1 text-sm text-stone-500">{item.bottle_size ? `${item.bottle_size}ml · ` : ""}Qty: {numberValue(item.quantity, 1)}</p>{item.item_type === "combo" && item.selected_product_names?.length ? <p className="mt-2 text-sm text-stone-600">Selected: {item.selected_product_names.join(", ")}</p> : null}{personalizationType || personalizationText ? <div className="mt-3 rounded-xl bg-stone-50 p-3 text-sm text-stone-600"><p className="font-semibold text-stone-800">Personalization: {personalizationType || "Name"}</p>{personalizationText ? <p>Text: &quot;{personalizationText}&quot;</p> : null}<p>Personalization charge: {formatPrice(personalizationCharge)}</p></div> : null}</div><div className="text-right text-sm"><p className="font-semibold text-stone-900">{formatPrice(numberValue(item.total_price))}</p><p className="mt-1 text-stone-500">{formatPrice(numberValue(item.unit_price))} each</p></div></div></div>;
}

function getRule(item: AdminOrderItem) { return item.pricing_rule && typeof item.pricing_rule === "object" ? item.pricing_rule : {}; }
function numberValue(value: unknown, fallback = 0) { const number = Number(value); return Number.isFinite(number) ? number : fallback; }
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-stone-50 p-4"><p className="text-xs text-stone-500">{label}</p><p className="mt-1 text-sm font-semibold text-stone-900">{value}</p></div>; }
function Row({ label, value, strong = false }: { label: string; value: number | string; strong?: boolean }) { return <div className={`flex justify-between gap-4 ${strong ? "border-t border-stone-200 pt-3 text-base font-bold text-stone-900" : "text-stone-600"}`}><span>{label}</span><span>{typeof value === "number" ? formatPrice(value) : value}</span></div>; }
