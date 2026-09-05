import Link from "next/link";
import { fetchSecureOrder } from "@/lib/order-server";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams?: Promise<{ order?: string; token?: string }> | { order?: string; token?: string };
}) {
  const resolvedParams = searchParams ? await Promise.resolve(searchParams) : {};
  const orderNumber = typeof resolvedParams.order === "string" ? resolvedParams.order.trim() : "";
  const token = typeof resolvedParams.token === "string" ? resolvedParams.token : "";
  const result = orderNumber && token ? await fetchSecureOrder(orderNumber, token) : null;
  const order = result?.order ?? null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f0e4] px-4 py-10 sm:px-6 sm:py-14">
      {/* Scrapbook Heaven atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-16 h-64 w-64 rounded-full bg-[#f3c7d3]/45 blur-3xl" />
        <div className="absolute -right-20 top-24 h-72 w-72 rounded-full bg-[#bfe1ec]/55 blur-3xl" />
        <div className="absolute left-1/2 top-[42%] h-80 w-80 -translate-x-1/2 rounded-full bg-[#d9cdec]/35 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #1c2540 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <div className="relative rounded-[34px] border border-[#1c2540]/10 bg-[#fffdf7] px-5 py-8 shadow-[0_24px_70px_rgba(28,37,64,0.12)] sm:px-10 sm:py-12">
          {/* top tape */}
          <div className="absolute left-1/2 top-0 h-10 w-32 -translate-x-1/2 -translate-y-1/2 rotate-[-2deg] bg-[#f3c7d3]/80 shadow-sm" />

          <div className="text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 rotate-[-4deg] items-center justify-center rounded-full border-2 border-[#1c2540]/10 bg-[#cfe6cf] shadow-[4px_6px_0_rgba(28,37,64,0.10)]">
              <span className="text-4xl text-[#1c2540]">✓</span>
            </div>

            <p className="caveat text-2xl font-semibold text-[#b88932]">
              a little memory, officially yours ✦
            </p>

            <p className="mt-3 text-xs font-bold uppercase tracking-[0.28em] text-[#1c2540]/55">
              Payment successful
            </p>

            <h1 className="mt-3 font-serif text-3xl font-bold tracking-[-0.03em] text-[#1c2540] sm:text-5xl">
              Your scent is on its way to heaven.
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#1c2540]/65 sm:text-base">
              Thank you for your order. Your fragrance journey has officially
              begun — one beautiful memory at a time.
            </p>
          </div>

          {order ? (
            <div className="relative mt-9 rotate-[0.5deg] rounded-[24px] border border-[#1c2540]/10 bg-[#f7f0e4] p-5 shadow-[7px_8px_0_rgba(28,37,64,0.06)] sm:p-7">
              <div className="absolute -right-3 -top-3 rounded-md bg-[#fff6c9] px-3 py-2 shadow-sm rotate-[4deg]">
                <span className="caveat text-lg font-semibold text-[#1c2540]">
                  keep this note ♡
                </span>
              </div>

              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="caveat text-2xl font-semibold text-[#1c2540]">
                    order memory
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#1c2540]/45">
                    safely confirmed
                  </p>
                </div>
                <span className="rounded-full border border-[#1c2540]/10 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1c2540]/60">
                  ✦ SFH
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col gap-2 rounded-2xl bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1c2540]/45">
                    Order number
                  </span>
                  <span className="break-all font-semibold text-[#1c2540]">
                    {order.order_number}
                  </span>
                </div>

                <div className="flex flex-col gap-2 rounded-2xl bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1c2540]/45">
                    Payment status
                  </span>
                  <span className="font-semibold capitalize text-[#47734d]">
                    {order.payment_status}
                  </span>
                </div>

                <div className="flex flex-col gap-2 rounded-2xl bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#1c2540]/45">
                    Order status
                  </span>
                  <span className="font-semibold capitalize text-[#1c2540]">
                    {order.order_status}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative mt-9 rotate-[-0.5deg] rounded-[24px] border border-[#e7c97b] bg-[#fff6c9] p-5 shadow-[6px_7px_0_rgba(28,37,64,0.06)] sm:p-7">
              <p className="caveat text-2xl font-semibold text-[#1c2540]">
                one tiny hiccup...
              </p>
              <p className="mt-2 text-sm leading-6 text-[#1c2540]/70">
                We could not retrieve your order details right now. Please
                contact support with your order reference.
              </p>
            </div>
          )}

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {order ? (
              <Link
                href={`/order/${encodeURIComponent(order.order_number)}?token=${encodeURIComponent(token)}`}
                className="group relative inline-flex min-h-14 items-center justify-center overflow-hidden rounded-2xl bg-[#1c2540] px-6 py-4 text-sm font-bold text-white shadow-[5px_6px_0_rgba(28,37,64,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[7px_9px_0_rgba(28,37,64,0.18)]"
              >
                <span className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-[#f3c7d3]/25 transition-transform duration-500 group-hover:scale-150" />
                <span className="relative">View your order ↗</span>
              </Link>
            ) : (
              <div />
            )}

            <Link
              href="/shop"
              className="inline-flex min-h-14 items-center justify-center rounded-2xl border-2 border-[#1c2540]/10 bg-white px-6 py-4 text-sm font-bold text-[#1c2540] shadow-[4px_5px_0_rgba(28,37,64,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-[#1c2540]/20"
            >
              Continue shopping ✦
            </Link>
          </div>

          <div className="mt-9 border-t border-dashed border-[#1c2540]/15 pt-6 text-center">
            <p className="caveat text-xl font-semibold text-[#1c2540]/75">
              crafted in heaven. worn by legends. remembered forever. ♡
            </p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[#1c2540]/35">
              Smells From Heaven
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
