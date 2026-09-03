import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { fetchSecureOrder, type HistoricalOrderItem } from "@/lib/order-server";
import InvoiceDownloadButton from "@/components/InvoiceDownloadButton";
import { orderConfig } from "@/lib/orderConfig";

type PageProps = {
  params: Promise<{ orderNumber: string }> | { orderNumber: string };
  searchParams?: Promise<{ token?: string }> | { token?: string };
};

export default async function OrderDetailsPage({ params, searchParams }: PageProps) {
  const { orderNumber: rawOrderNumber } = await Promise.resolve(params);
  const resolvedSearchParams = searchParams ? await Promise.resolve(searchParams) : {};
  let orderNumber = "";
  try {
    orderNumber = decodeURIComponent(rawOrderNumber).trim();
  } catch {
    orderNumber = rawOrderNumber.trim();
  }
  const accessToken = String(resolvedSearchParams.token ?? "");
  const result = await fetchSecureOrder(orderNumber, accessToken);

  if (!result) {
    return (
      <main className="min-h-screen bg-stone-50 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-[28px] border border-stone-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-stone-900">Order not found</h1>
          <p className="mt-3 text-stone-500">This order link is invalid or has expired.</p>
          <Link href="/shop" className="mt-6 inline-flex rounded-full bg-[#bf4800] px-6 py-3 text-sm font-semibold text-white">Back to Shop</Link>
        </div>
      </main>
    );
  }

  const { order, items } = result;
  const invoiceUrl = `/api/orders/${encodeURIComponent(order.order_number)}/invoice?token=${encodeURIComponent(accessToken)}`;
  const personalizationTotal = items.reduce((total, item) => {
    const rule = getPricingRule(item);
    return total + toNumber(rule.personalization_charge);
  }, 0);

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-[32px] border border-stone-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#bf4800]">Order confirmed</p>
          <h1 className="mt-2 text-3xl font-bold text-stone-900">Order details</h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Info label="Order Number" value={order.order_number} />
            <Info label="Payment" value={order.payment_status} />
            <Info label="Order Status" value={order.order_status} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <InvoiceDownloadButton invoiceUrl={invoiceUrl} filename={`SFH-Invoice-${order.order_number}.pdf`} />
            <span className="self-center text-xs text-stone-500">Secure link valid for 7 days</span>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-stone-900">Order items</h2>
            <div className="mt-5 space-y-5">
              {items.map((item, index) => {
                const rule = getPricingRule(item);
                const personalizationText = String(rule.personalization_text ?? "").trim();
                const personalizationType = String(rule.personalization_type ?? "").trim();
                const image = Array.isArray(item.selected_product_images) ? item.selected_product_images[0] : null;
                const quantity = toNumber(item.quantity, 1);
                const unitPrice = toNumber(item.unit_price);
                const referencePrice = toNumber(item.reference_price);
                const savings = toNumber(item.savings);
                return (
                  <div key={`${item.product_id ?? item.combo_name ?? "item"}-${index}`} className="border-b border-stone-100 pb-5 last:border-0 last:pb-0">
                    <div className="flex gap-4">
                      {image ? <img src={String(image)} alt="" className="h-16 w-16 rounded-xl object-cover" /> : null}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-stone-900">{item.product_name ?? item.combo_name ?? "Order item"}</p>
                        <p className="mt-1 text-sm text-stone-500">{item.bottle_size ? `${item.bottle_size}ml · ` : ""}Qty: {quantity}</p>
                        <div className="mt-3 space-y-1 text-sm text-stone-600">
                          <p>
                            Price at time of order: {formatPrice(unitPrice)}{" "}
                            {item.item_type === "combo" ? "for this combo" : "each"}
                          </p>
                          {referencePrice > 0 && referencePrice !== unitPrice * quantity ? (
                            <p>Reference price: {formatPrice(referencePrice)}</p>
                          ) : null}
                          {savings > 0 ? <p className="font-semibold text-[#0a7a40]">Saved: {formatPrice(savings)}</p> : null}
                        </div>
                        {personalizationText || personalizationType ? (
                          <p className="mt-2 text-sm text-stone-600">
                            Personalization: {personalizationType || "Name"}
                            {personalizationText ? ` - "${personalizationText}"` : ""}
                          </p>
                        ) : null}
                      </div>
                      <span className="font-semibold text-stone-900">{formatPrice(toNumber(item.total_price))}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-stone-900">Customer details</h2>
              <div className="mt-4 space-y-2 text-sm text-stone-600">
                <p>{order.customer_name}</p><p>{order.customer_email}</p><p>{order.customer_phone}</p>
                <p>{order.address_line1}, {order.city}, {order.state} - {order.pincode}</p>
              </div>
            </section>
            <section className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-stone-900">Pricing</h2>
              <div className="mt-4 space-y-3 text-sm">
                <Row label="Subtotal" value={order.subtotal} />
                {personalizationTotal > 0 ? <Row label="Personalization" value={personalizationTotal} /> : null}
                {Number(order.discount_amount) > 0 ? <Row label="Discount" value={-Number(order.discount_amount)} /> : null}
                <Row label="Shipping" value={Number(order.shipping_amount) ? Number(order.shipping_amount) : "FREE"} />
                <Row label={`GST (${orderConfig.gstPercentage}%)`} value={order.gst_amount} />
                <Row label="Grand Total" value={order.total_amount} strong />
              </div>
            </section>
          </div>
        </section>
        <Link href="/shop" className="inline-flex rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700">Continue Shopping</Link>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-stone-50 p-4"><p className="text-xs text-stone-500">{label}</p><p className="mt-1 font-semibold text-stone-900">{value}</p></div>;
}

function getPricingRule(item: HistoricalOrderItem) {
  return item.pricing_rule && typeof item.pricing_rule === "object" ? item.pricing_rule : {};
}

function toNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function Row({ label, value, strong = false }: { label: string; value: number | string; strong?: boolean }) {
  const display = typeof value === "number" ? formatPrice(value) : value;
  return <div className={`flex justify-between gap-4 ${strong ? "border-t border-stone-200 pt-3 text-base font-bold text-stone-900" : "text-stone-600"}`}><span>{label}</span><span>{display}</span></div>;
}
