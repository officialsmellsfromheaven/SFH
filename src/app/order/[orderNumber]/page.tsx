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
    <main className="relative min-h-screen overflow-hidden bg-[#f7f0e4] px-4 py-10 sm:px-6 sm:py-14">
      {/* Heaven scrapbook atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#f3c7d3]/45 blur-3xl" />
        <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-[#bfe1ec]/55 blur-3xl" />
        <div className="absolute left-1/2 top-[48%] h-96 w-96 -translate-x-1/2 rounded-full bg-[#d9cdec]/30 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #1c2540 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <section className="relative overflow-hidden rounded-[34px] border border-[#1c2540]/10 bg-[#fffdf7] p-6 shadow-[0_24px_70px_rgba(28,37,64,0.11)] sm:p-10">
          <div className="absolute left-8 top-0 h-10 w-32 -translate-y-1/2 rotate-[-3deg] bg-[#bfe1ec]/80 shadow-sm" />
          <div className="absolute right-8 top-7 hidden rotate-[5deg] rounded-md bg-[#fff6c9] px-4 py-2 shadow-sm sm:block">
            <span className="caveat text-lg font-semibold text-[#1c2540]">
              keep this memory ♡
            </span>
          </div>

          <div className="max-w-3xl">
            <p className="caveat text-2xl font-semibold text-[#b88932]">
              a memory worth keeping ✦
            </p>
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.28em] text-[#1c2540]/45">
              Order confirmed
            </p>
            <h1 className="mt-2 font-serif text-3xl font-bold tracking-[-0.03em] text-[#1c2540] sm:text-5xl">
              Order details
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#1c2540]/65 sm:text-base">
              Everything about your fragrance order, safely saved in one
              little place.
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <Info label="Order Number" value={order.order_number} />
            <Info label="Payment" value={order.payment_status} />
            <Info label="Order Status" value={order.order_status} />
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <InvoiceDownloadButton
              invoiceUrl={invoiceUrl}
              filename={`SFH-Invoice-${order.order_number}.pdf`}
            />
            <span className="caveat text-lg text-[#1c2540]/55">
              secure link valid for 7 days ✦
            </span>
          </div>
        </section>

        {/* Order + customer */}
        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="relative rounded-[30px] border border-[#1c2540]/10 bg-[#fffdf7] p-6 shadow-[7px_9px_0_rgba(28,37,64,0.055)] sm:p-7">
            <div className="absolute -right-2 -top-3 rotate-[5deg] rounded-md bg-[#f3c7d3] px-3 py-2 shadow-sm">
              <span className="caveat text-lg font-semibold text-[#1c2540]">
                your scent shelf
              </span>
            </div>

            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1c2540]/40">
                what you ordered
              </p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-[#1c2540] sm:text-3xl">
                Order items
              </h2>
            </div>

            <div className="space-y-5">
              {items.map((item, index) => {
                const rule = getPricingRule(item);
                const personalizationText = String(
                  rule.personalization_text ?? ""
                ).trim();
                const personalizationType = String(
                  rule.personalization_type ?? ""
                ).trim();
                const image = Array.isArray(item.selected_product_images)
                  ? item.selected_product_images[0]
                  : null;
                const quantity = toNumber(item.quantity, 1);
                const unitPrice = toNumber(item.unit_price);
                const referencePrice = toNumber(item.reference_price);
                const savings = toNumber(item.savings);

                return (
                  <div
                    key={`${item.product_id ?? item.combo_name ?? "item"}-${index}`}
                    className="relative rounded-[24px] border border-[#1c2540]/8 bg-[#f7f0e4]/70 p-4 sm:p-5"
                  >
                    <div className="absolute -left-2 top-5 h-9 w-16 rotate-[-5deg] bg-[#fff6c9]/90 shadow-sm" />

                    <div className="relative flex gap-4">
                      {image ? (
                        <img
                          src={String(image)}
                          alt=""
                          className="h-20 w-20 shrink-0 rounded-2xl border-2 border-white object-cover shadow-[3px_4px_0_rgba(28,37,64,0.08)] sm:h-24 sm:w-24"
                        />
                      ) : null}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="font-serif text-lg font-bold text-[#1c2540]">
                              {item.product_name ??
                                item.combo_name ??
                                "Order item"}
                            </p>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#1c2540]/45">
                              {item.bottle_size
                                ? `${item.bottle_size}ml · `
                                : ""}
                              Qty: {quantity}
                            </p>
                          </div>

                          <span className="shrink-0 font-bold text-[#1c2540]">
                            {formatPrice(toNumber(item.total_price))}
                          </span>
                        </div>

                        <div className="mt-3 space-y-1 text-xs leading-5 text-[#1c2540]/60 sm:text-sm">
                          <p>
                            Price at time of order: {formatPrice(unitPrice)}{" "}
                            {item.item_type === "combo"
                              ? "for this combo"
                              : "each"}
                          </p>

                          {referencePrice > 0 &&
                          referencePrice !== unitPrice * quantity ? (
                            <p>Reference price: {formatPrice(referencePrice)}</p>
                          ) : null}

                          {savings > 0 ? (
                            <p className="font-semibold text-[#47734d]">
                              Saved: {formatPrice(savings)} ✦
                            </p>
                          ) : null}
                        </div>

                        {personalizationText || personalizationType ? (
                          <div className="mt-3 rounded-xl bg-[#fff6c9]/75 px-3 py-2">
                            <p className="caveat text-base font-semibold text-[#1c2540]">
                              Personal touch ♡
                            </p>
                            <p className="mt-0.5 text-xs text-[#1c2540]/65 sm:text-sm">
                              {personalizationType || "Name"}
                              {personalizationText
                                ? ` — "${personalizationText}"`
                                : ""}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            {/* Customer */}
            <section className="relative rotate-[0.5deg] rounded-[28px] border border-[#1c2540]/10 bg-[#d9cdec]/55 p-6 shadow-[6px_7px_0_rgba(28,37,64,0.06)]">
              <div className="absolute -right-2 -top-3 rotate-[6deg] bg-[#fffdf7] px-3 py-1.5 shadow-sm">
                <span className="caveat text-base font-semibold text-[#1c2540]">
                  delivery note
                </span>
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1c2540]/40">
                where heaven is sending it
              </p>
              <h2 className="mt-1 font-serif text-xl font-bold text-[#1c2540]">
                Customer details
              </h2>

              <div className="mt-4 space-y-2 text-sm leading-6 text-[#1c2540]/70">
                <p className="font-semibold text-[#1c2540]">
                  {order.customer_name}
                </p>
                <p>{order.customer_email}</p>
                <p>{order.customer_phone}</p>
                <p>
                  {order.address_line1}, {order.city}, {order.state} -{" "}
                  {order.pincode}
                </p>
              </div>
            </section>

            {/* Pricing */}
            <section className="relative -rotate-[0.5deg] rounded-[28px] border border-[#1c2540]/10 bg-[#fffdf7] p-6 shadow-[6px_7px_0_rgba(28,37,64,0.06)]">
              <div className="absolute -left-2 -top-3 rotate-[-4deg] bg-[#cfe6cf] px-3 py-1.5 shadow-sm">
                <span className="caveat text-base font-semibold text-[#1c2540]">
                  little numbers ✦
                </span>
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#1c2540]/40">
                your order total
              </p>
              <h2 className="mt-1 font-serif text-xl font-bold text-[#1c2540]">
                Pricing
              </h2>

              <div className="mt-5 space-y-3 text-sm">
                <Row label="Subtotal" value={order.subtotal} />
                {personalizationTotal > 0 ? (
                  <Row
                    label="Personalization"
                    value={personalizationTotal}
                  />
                ) : null}
                {Number(order.discount_amount) > 0 ? (
                  <Row
                    label="Discount"
                    value={-Number(order.discount_amount)}
                  />
                ) : null}
                <Row
                  label="Shipping"
                  value={
                    Number(order.shipping_amount)
                      ? Number(order.shipping_amount)
                      : "FREE"
                  }
                />
                <Row
                  label={`GST (${orderConfig.gstPercentage}%)`}
                  value={order.gst_amount}
                />
                <Row label="Grand Total" value={order.total_amount} strong />
              </div>
            </section>
          </div>
        </section>

        <div className="flex flex-col items-center justify-between gap-4 rounded-[26px] border border-dashed border-[#1c2540]/15 bg-[#fffdf7]/70 p-5 sm:flex-row sm:px-7">
          <p className="caveat text-xl font-semibold text-[#1c2540]/75">
            crafted in heaven. now on its way to you. ♡
          </p>
          <Link
            href="/shop"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border-2 border-[#1c2540]/10 bg-white px-6 py-3 text-sm font-bold text-[#1c2540] shadow-[4px_5px_0_rgba(28,37,64,0.06)] transition-all duration-300 hover:-translate-y-1"
          >
            Continue shopping ✦
          </Link>
        </div>
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
