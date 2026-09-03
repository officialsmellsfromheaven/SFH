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
    <div className="min-h-screen bg-stone-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-stone-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <span className="text-3xl">✓</span>
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#bf4800]">Payment Successful</p>
          <h1 className="mt-3 text-3xl font-bold text-stone-900 sm:text-4xl">Thank you for your order!</h1>
          <p className="mt-3 text-stone-600">Your order has been confirmed.</p>
        </div>

        {order ? (
          <div className="space-y-4 rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-stone-500">Order Number</span>
              <span className="text-lg font-bold text-stone-900">{order.order_number}</span>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-stone-500">Payment Status</span>
              <span className="font-semibold text-emerald-600">{order.payment_status}</span>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-stone-500">Order Status</span>
              <span className="font-semibold text-stone-800">{order.order_status}</span>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            We could not retrieve your order details right now. Please contact support with your order reference.
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {order ? (
            <Link
              href={`/order/${encodeURIComponent(order.order_number)}?token=${encodeURIComponent(token)}`}
              className="inline-flex items-center justify-center rounded-full bg-[#bf4800] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#9d3b00]"
            >
              View Order
            </Link>
          ) : null}
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
