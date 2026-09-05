"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  PackageSearch,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";

type TrackingOrder = {
  orderNumber: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string | null;
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanOrderNumber = orderNumber.trim();

    if (!cleanOrderNumber) {
      setError("Please enter your order ID.");
      setOrder(null);
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNumber: cleanOrderNumber,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success || !result?.order) {
        throw new Error(
          result?.error ||
            "We couldn't find an order with that ID. Please check it and try again."
        );
      }

      setOrder(result.order);
    } catch (lookupError) {
      setError(
        lookupError instanceof Error
          ? lookupError.message
          : "Unable to track your order right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f0e4] px-4 py-10 text-[#1c2540] sm:px-6 sm:py-14">
      {/* Heaven scrapbook atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-[#f3c7d3]/45 blur-3xl" />
        <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-[#bfe1ec]/55 blur-3xl" />
        <div className="absolute left-1/2 top-[55%] h-96 w-96 -translate-x-1/2 rounded-full bg-[#d9cdec]/30 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #1c2540 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <Link
          href="/shop"
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1c2540]/55 transition-colors hover:text-[#b88932]"
        >
          ← Back to shop
        </Link>

        <motion.section
          initial={{ opacity: 0, y: 24, rotate: -0.5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative overflow-hidden rounded-[34px] border border-[#1c2540]/10 bg-[#fffdf7] shadow-[0_24px_70px_rgba(28,37,64,0.11)]"
        >
          {/* Washi tape */}
          <div className="absolute left-8 top-0 h-10 w-32 -translate-y-1/2 rotate-[-3deg] bg-[#f3c7d3]/80 shadow-sm" />
          <div className="absolute right-10 top-0 hidden h-9 w-24 -translate-y-1/2 rotate-[4deg] bg-[#bfe1ec]/75 shadow-sm sm:block" />

          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            {/* Left scrapbook note */}
            <div className="relative overflow-hidden bg-[#f0ebf8]/65 p-7 sm:p-10 lg:p-12">
              <div className="absolute -bottom-16 -left-12 h-44 w-44 rounded-full bg-[#f3c7d3]/35 blur-3xl" />

              <div className="relative">
                <div className="inline-flex rotate-[-2deg] items-center gap-2 border border-[#e5d7a9] bg-[#fff6c9] px-3 py-2 shadow-[4px_5px_0_rgba(28,37,64,0.06)]">
                  <Sparkles
                    size={14}
                    className="text-[#b88932]"
                  />

                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7b6833]">
                    order diary
                  </span>
                </div>

                <p className="caveat mt-8 text-2xl font-semibold text-[#b88932]">
                  your little memory is travelling ✦
                </p>

                <h1 className="mt-3 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.95] tracking-[-0.055em] text-[#1c2540] sm:text-6xl">
                  Track your
                  <span className="block text-[#b88932]">
                    order.
                  </span>
                </h1>

                <p className="mt-6 max-w-md text-sm leading-7 text-[#1c2540]/65 sm:text-base">
                  Enter your order ID below and we&apos;ll show you
                  the latest status of your fragrance journey.
                </p>

                <div className="mt-9 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#cfe6cf] text-[#47734d]">
                      <PackageSearch size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#1c2540]">
                        Order status
                      </p>

                      <p className="text-xs leading-5 text-[#1c2540]/55">
                        See the latest status saved for your order.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#bfe1ec] text-[#456875]">
                      <ShieldCheck size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#1c2540]">
                        Simple tracking
                      </p>

                      <p className="text-xs leading-5 text-[#1c2540]/55">
                        Enter your order ID to check its current status.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="caveat mt-9 text-xl text-[#1c2540]/55">
                  fragrance takes a journey too ♡
                </p>
              </div>
            </div>

            {/* Form / Result */}
            <div className="relative p-7 sm:p-10 lg:p-12">
              <div className="absolute right-7 top-7 rotate-[4deg] bg-[#fff6c9] px-3 py-1.5 shadow-sm">
                <span className="caveat text-base font-semibold text-[#1c2540]">
                  find it here ✦
                </span>
              </div>

              <div className="pt-10">
                <div className="flex h-12 w-12 rotate-[-4deg] items-center justify-center rounded-2xl bg-[#f3c7d3]/65 text-[#7a5361] shadow-[4px_5px_0_rgba(28,37,64,0.05)]">
                  <Search size={21} />
                </div>

                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.22em] text-[#b88932]">
                  order lookup
                </p>

                <h2 className="mt-2 font-[var(--font-playfair)] text-2xl font-semibold tracking-[-0.04em] text-[#1c2540] sm:text-3xl">
                  Where is your fragrance?
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="mt-7 space-y-5"
                >
                  <div>
                    <label
                      htmlFor="order-number"
                      className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#1c2540]/55"
                    >
                      Order number
                    </label>

                    <input
                      id="order-number"
                      name="orderNumber"
                      value={orderNumber}
                      onChange={(event) =>
                        setOrderNumber(event.target.value)
                      }
                      placeholder="e.g. SFH-123456"
                      autoComplete="off"
                      className="h-14 w-full rounded-2xl border border-[#1c2540]/10 bg-[#fffdf7] px-4 text-sm font-medium text-[#1c2540] outline-none transition-all placeholder:text-[#1c2540]/30 focus:border-[#b88932]/60 focus:ring-4 focus:ring-[#b88932]/10"
                    />
                  </div>

                  {error ? (
                    <div
                      role="alert"
                      className="rounded-2xl border border-[#e7c1c8] bg-[#fae9ef] px-4 py-3 text-sm leading-6 text-[#7a5361]"
                    >
                      {error}
                    </div>
                  ) : null}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{
                      y: loading ? 0 : -2,
                    }}
                    whileTap={{
                      scale: loading ? 1 : 0.98,
                    }}
                    className="group inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#1c2540] px-6 py-4 text-sm font-bold text-white shadow-[5px_6px_0_rgba(28,37,64,0.14)] transition-all hover:shadow-[7px_9px_0_rgba(28,37,64,0.16)] disabled:cursor-wait disabled:opacity-60"
                  >
                    {loading
                      ? "Finding your order…"
                      : "Track my order"}

                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </motion.button>
                </form>

                {/* Order result */}
                {order ? (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                    className="mt-7 rounded-[24px] border border-[#cfe6cf] bg-[#f1f8f1] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#47734d]">
                          order found ✦
                        </p>

                        <h3 className="mt-1 text-lg font-semibold text-[#1c2540]">
                          {order.orderNumber}
                        </h3>
                      </div>

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#cfe6cf] text-[#47734d]">
                        <PackageSearch size={18} />
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white/75 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1c2540]/45">
                          Payment
                        </p>

                        <p className="mt-1 text-sm font-semibold capitalize text-[#1c2540]">
                          {order.paymentStatus}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white/75 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#1c2540]/45">
                          Order status
                        </p>

                        <p className="mt-1 text-sm font-semibold capitalize text-[#1c2540]">
                          {order.orderStatus}
                        </p>
                      </div>
                    </div>

                    {order.createdAt ? (
                      <p className="mt-4 text-xs text-[#1c2540]/50">
                        Order placed{" "}
                        {new Date(order.createdAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    ) : null}
                  </motion.div>
                ) : (
                  <div className="mt-7 rounded-2xl border border-dashed border-[#1c2540]/12 bg-[#f7f0e4]/65 p-4">
                    <p className="text-xs font-semibold text-[#1c2540]/65">
                      Where do I find my order number?
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#1c2540]/50">
                      You can find your order number in your order
                      confirmation after placing your order.
                    </p>
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Link
                    href="/faq"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#1c2540]/55 transition-colors hover:text-[#b88932]"
                  >
                    Need help?
                    <ArrowRight size={14} />
                  </Link>

                  <a
                    href="https://wa.me/918087568338"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#1c2540]/10 bg-white px-4 py-2.5 text-xs font-semibold text-[#1c2540]/70 transition-all hover:-translate-y-0.5 hover:border-[#1c2540]/20"
                  >
                    <MessageCircle size={15} />
                    WhatsApp support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}