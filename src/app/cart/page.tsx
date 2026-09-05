"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageCircle, Trash2, ArrowRight, ShoppingBag, Sparkles, Package, Tag } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { calculateCartPricing } from "@/lib/orderTotals";

export default function CartPage() {
  const { items, removeItem } = useCartStore();
  const totals = calculateCartPricing(items);

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f0e4] text-[#1c2540]">
      {/* Scrapbook Heaven atmosphere */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-[#d9cdec]/45 blur-3xl" />
        <div className="absolute right-[-100px] top-12 h-96 w-96 rounded-full bg-[#f3c7d3]/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#bfe1ec]/40 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage: "radial-gradient(#1c2540 0.7px, transparent 0.7px)",
            backgroundSize: "9px 9px",
          }}
        />
      </div>

      <main className="relative z-10">
        {/* Header */}
        <section className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:pt-14">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#1c2540]/10 bg-[#fffdf7] px-6 py-10 shadow-[8px_10px_0_rgba(28,37,64,0.08)] sm:px-10 lg:px-14">
            <div className="absolute -right-12 -top-14 h-44 w-44 rounded-full bg-[#fff6c9] blur-2xl" />
            <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-[#bfe1ec]/40 blur-3xl" />

            <div className="relative flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="caveat mb-2 text-2xl text-[#8d5f2a] sm:text-3xl"
                >
                  almost time to make a memory ✦
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="text-4xl font-black tracking-[-0.045em] sm:text-5xl lg:text-6xl"
                >
                  Your Cart
                  <span className="ml-2 inline-block -rotate-6 text-[#d58a9f]">♡</span>
                </motion.h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#1c2540]/60 sm:text-base">
                  Your chosen scents, gathered in one little place before they
                  begin their next chapter.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, rotate: 4, y: 10 }}
                animate={{ opacity: 1, rotate: 2, y: 0 }}
                transition={{ delay: 0.15 }}
                className="relative w-fit border border-[#1c2540]/10 bg-[#fff6c9] px-5 py-4 shadow-[4px_5px_0_rgba(28,37,64,0.12)]"
              >
                <div className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 rotate-[-2deg] bg-[#f3c7d3]/75" />
                <ShoppingBag className="mb-1 h-5 w-5" />
                <p className="caveat text-xl">packed with good vibes</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] opacity-50">
                  SFH / cart
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mx-auto mt-5 max-w-2xl overflow-hidden rounded-[2rem] border border-[#1c2540]/10 bg-[#fffdf7] px-6 py-16 text-center shadow-[7px_8px_0_rgba(28,37,64,0.08)] sm:px-10"
            >
              <div className="absolute left-6 top-6 -rotate-12 border border-[#1c2540]/10 bg-[#d9cdec] px-3 py-2 shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="absolute right-7 top-7 rotate-12">
                <span className="caveat text-2xl text-[#d58a9f]">nothing here yet ♡</span>
              </div>

              <div className="mx-auto mb-6 flex h-20 w-20 rotate-[-4deg] items-center justify-center border border-[#1c2540]/10 bg-[#bfe1ec] shadow-[4px_5px_0_rgba(28,37,64,0.1)]">
                <ShoppingBag size={38} strokeWidth={1.7} />
              </div>

              <p className="caveat text-2xl text-[#8d5f2a]">
                your little cart is waiting...
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Your cart is empty.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#1c2540]/55">
                Pick a perfume or build a combo to continue your order on WhatsApp.
              </p>

              <Link
                href="/shop"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1c2540] px-7 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                Shop Fragrances
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ) : (
            <div className="grid items-start gap-6 lg:grid-cols-[1.35fr_0.65fr]">
              {/* Cart items */}
              <div className="space-y-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="caveat text-2xl text-[#8d5f2a]">your selected chapter ✦</p>
                    <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                      Ready when you are.
                    </h2>
                  </div>
                  <div className="rotate-[-2deg] border border-[#1c2540]/10 bg-[#fffdf7] px-4 py-2 shadow-[3px_4px_0_rgba(28,37,64,0.08)]">
                    <span className="text-xs font-black uppercase tracking-[0.12em] text-[#1c2540]/50">
                      {items.length} item{items.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.07, 0.35) }}
                    className="relative"
                  >
                    <div
                      className={[
                        "absolute -top-3 left-1/2 z-20 h-7 w-20 -translate-x-1/2 opacity-80",
                        index % 4 === 0
                          ? "rotate-[-3deg] bg-[#f3c7d3]"
                          : index % 4 === 1
                            ? "rotate-[2deg] bg-[#bfe1ec]"
                            : index % 4 === 2
                              ? "rotate-[-2deg] bg-[#d9cdec]"
                              : "rotate-[3deg] bg-[#fff6c9]",
                      ].join(" ")}
                    />

                    <div className="rounded-[1.75rem] border border-[#1c2540]/10 bg-[#fffdf7] p-5 shadow-[6px_7px_0_rgba(28,37,64,0.07)] sm:p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#d9cdec] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em]">
                              {item.type === "combo" ? (
                                <>
                                  <Package className="h-3 w-3" />
                                  Combo
                                </>
                              ) : (
                                <>
                                  <Sparkles className="h-3 w-3" />
                                  Perfume
                                </>
                              )}
                            </span>
                          </div>
                          <h2 className="mt-3 text-xl font-black tracking-tight text-[#1c2540] sm:text-2xl">
                            {item.type === "combo" ? item.comboName : item.productName}
                          </h2>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#1c2540]/10 bg-[#f7f0e4] text-[#1c2540]/60 transition-all hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {item.type === "combo" ? (
                        <div className="mt-5 rounded-2xl border border-[#1c2540]/8 bg-[#f7f0e4]/70 p-4 text-sm text-[#1c2540]/65">
                          <p>
                            <span className="font-bold text-[#1c2540]">
                              Build Your {item.bottleSize ?? "-"}ml Combo
                            </span>{" "}
                            — {item.quantity ?? 0} × {item.bottleSize ?? 0}ml
                          </p>
                          <p className="mt-2">
                            <span className="font-bold text-[#1c2540]">
                              Selected perfumes:
                            </span>{" "}
                            {(item.selectedProductNames ?? []).join(", ") || "No selections"}
                          </p>
                          <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#1c2540]/10 pt-3">
                            <span className="font-medium">Combo price</span>
                            <span className="font-black text-[#1c2540]">
                              {formatPrice(item.comboPrice ?? 0)}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-3">
                            <span className="font-medium">You save</span>
                            <span className="font-black text-[#16804a]">
                              {formatPrice(item.savings ?? 0)}
                            </span>
                          </div>
                        </div>
                      ) : (
                        (() => {
                          const line = totals.items.find((entry) => entry.item.id === item.id);
                          return (
                            <div className="mt-5 rounded-2xl border border-[#1c2540]/8 bg-[#f7f0e4]/70 p-4 text-sm text-[#1c2540]/65">
                              <div className="flex items-center justify-between gap-3">
                                <span className="inline-flex items-center gap-2">
                                  <Tag className="h-3.5 w-3.5" />
                                  {item.bottleSize ?? "-"}ml ×{" "}
                                  {line?.quantity ?? item.quantity ?? 1}
                                </span>
                                <span className="font-black text-[#1c2540]">
                                  {formatPrice(line?.lineTotal ?? 0)}
                                </span>
                              </div>

                              {line?.personalizationText ? (
                                <p className="mt-3 border-t border-[#1c2540]/10 pt-3">
                                  <span className="font-bold text-[#1c2540]">
                                    Personalization:
                                  </span>{" "}
                                  {line.personalizationType} - &quot;
                                  {line.personalizationText}&quot; (
                                  {formatPrice(line.personalizationCharge)})
                                </p>
                              ) : null}
                            </div>
                          );
                        })()
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <aside className="lg:sticky lg:top-24">
                <div className="relative overflow-hidden rounded-[1.75rem] border border-[#1c2540]/10 bg-[#fffdf7] p-6 shadow-[7px_8px_0_rgba(28,37,64,0.08)]">
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#f3c7d3]/45 blur-2xl" />
                  <div className="absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-[#bfe1ec]/45 blur-2xl" />

                  <div className="relative">
                    <p className="caveat text-2xl text-[#8d5f2a]">the final little note ✦</p>
                    <h3 className="mt-1 text-2xl font-black tracking-tight">
                      Ready to order?
                    </h3>

                    <div className="mt-6 space-y-3 text-sm text-[#1c2540]/60">
                      <div className="flex items-center justify-between">
                        <span>Items</span>
                        <span className="font-bold text-[#1c2540]">{items.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Subtotal</span>
                        <span className="font-bold text-[#1c2540]">
                          {formatPrice(totals.subtotal)}
                        </span>
                      </div>
                      {totals.discount > 0 && (
                        <div className="flex items-center justify-between">
                          <span>Discount</span>
                          <span className="font-bold text-[#16804a]">
                            -{formatPrice(totals.discount)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span>Shipping</span>
                        <span className="font-bold text-[#1c2540]">
                          {totals.shipping ? formatPrice(totals.shipping) : "FREE"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>GST ({totals.gstRate}%)</span>
                        <span className="font-bold text-[#1c2540]">
                          {formatPrice(totals.gst)}
                        </span>
                      </div>

                      <div className="mt-4 border-t border-dashed border-[#1c2540]/15 pt-4">
                        <div className="flex items-end justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#1c2540]/40">
                              Grand Total
                            </p>
                            <p className="mt-1 text-2xl font-black text-[#1c2540]">
                              {formatPrice(totals.grandTotal)}
                            </p>
                          </div>
                          <span className="caveat text-lg text-[#d58a9f]">
                            worth the memory ♡
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3">
                      <Link
                        href="/checkout"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1c2540] px-5 py-3.5 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(28,37,64,0.15)]"
                      >
                        <MessageCircle size={16} />
                        Proceed to Checkout
                        <ArrowRight className="h-4 w-4" />
                      </Link>

                      <Link
                        href="/shop"
                        className="inline-flex items-center justify-center rounded-full border border-[#1c2540]/15 bg-[#f7f0e4] px-5 py-3.5 text-sm font-bold text-[#1c2540] transition-all hover:bg-white"
                      >
                        Continue Shopping
                      </Link>
                    </div>

                    <p className="mt-5 text-center text-[11px] leading-5 text-[#1c2540]/45">
                      Your order continues securely through the existing checkout flow.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
