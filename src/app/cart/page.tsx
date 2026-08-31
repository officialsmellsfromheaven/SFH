"use client";

import Link from "next/link";
import { MessageCircle, Trash2 } from "lucide-react";
import { orderConfig } from "@/lib/orderConfig";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem } = useCartStore();

  const message = encodeURIComponent(
    [
      "Hello! I would like to place my order on WhatsApp.",
      ...items.map((item) => {
        if (item.type === "combo") {
          return [
            `Combo: ${item.comboName ?? "Custom Combo"}`,
            `Bottle Size: ${item.bottleSize ?? "-"}ml`,
            `Quantity: ${item.quantity ?? item.selectedProductIds?.length ?? 0}`,
            `Selected Perfumes: ${(item.selectedProductNames ?? []).join(", ") || "None"}`,
            `Combo Price: ${formatPrice(item.comboPrice ?? 0)}`,
            `You Save: ${formatPrice(item.savings ?? 0)}`,
          ].join("\n");
        }

        return [
          `Product: ${item.productName ?? "Perfume"}`,
          `Price: ${formatPrice(item.referencePrice ?? 0)}`,
        ].join("\n");
      }),
    ].join("\n\n")
  );

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#bf4800]">Cart</p>
          <h1 className="mt-2 text-4xl font-semibold text-stone-900">Your order</h1>
        </div>

        {items.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-[28px] border border-stone-200 bg-white p-8 text-center shadow-sm">
            <MessageCircle size={56} className="mx-auto mb-5 text-amber-600" />
            <h2 className="mb-2 text-2xl font-bold text-stone-800">Your cart is empty</h2>
            <p className="mb-6 text-stone-500">
              Pick a perfume or build a combo to continue your order on WhatsApp.
            </p>
            <Link
              href="/shop"
              className="inline-flex rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
            >
              Shop fragrances
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#bf4800]">{item.type === "combo" ? "Combo" : "Perfume"}</p>
                      <h2 className="mt-2 text-2xl font-semibold text-stone-900">
                        {item.type === "combo" ? item.comboName : item.productName}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-600 transition-colors hover:border-red-300 hover:text-red-600"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {item.type === "combo" ? (
                    <div className="mt-4 space-y-3 text-sm text-stone-600">
                      <p><span className="font-semibold text-stone-800">Build Your {item.bottleSize ?? "-"}ml Combo</span> — {item.quantity ?? 0} × {item.bottleSize ?? 0}ml</p>
                      <p><span className="font-semibold text-stone-800">Selected perfumes:</span> {(item.selectedProductNames ?? []).join(", ") || "No selections"}</p>
                      <div className="flex items-center justify-between gap-3">
                        <span>Combo price</span>
                        <span className="font-semibold text-stone-900">{formatPrice(item.comboPrice ?? 0)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <span>You save</span>
                        <span className="font-semibold text-[#0a7a40]">{formatPrice(item.savings ?? 0)}</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <aside className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm">
              <h3 className="text-xl font-semibold text-stone-900">Ready to order</h3>
              <div className="mt-5 space-y-3 text-sm text-stone-600">
                <div className="flex items-center justify-between">
                  <span>Items</span>
                  <span className="font-semibold text-stone-900">{items.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span className="font-semibold text-stone-900">
                    {formatPrice(items.reduce((sum, item) => sum + (item.type === "combo" ? (item.comboPrice ?? 0) : (item.referencePrice ?? 0)), 0))}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/checkout"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0071e3] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0067d3]"
                >
                  <MessageCircle size={16} />
                  Proceed to Checkout
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-700 transition-colors hover:border-stone-300"
                >
                  Continue shopping
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
