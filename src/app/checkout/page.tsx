"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import type { WhatsAppCustomer } from "@/lib/orderMessaging";
import { calculateCartPricing } from "@/lib/orderTotals";
import CustomerDetailsForm, {
  validateCustomerDetails,
} from "@/components/CustomerDetailsForm";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void | Promise<void>;
  modal?: {
    ondismiss?: () => void;
  };
};

type RazorpayInstance = {
  open: () => void;
};


const initialCustomer: WhatsAppCustomer = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();

  const [customer, setCustomer] =
    useState<WhatsAppCustomer>(initialCustomer);

  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [checkoutId, setCheckoutId] = useState("");

  const totals = calculateCartPricing(items);

  function validate() {
    const validationError = validateCustomerDetails(customer);

    if (validationError) {
      setError(validationError);
      return false;
    }

    setError("");
    return true;
  }

  async function loadRazorpayScript() {
    if (window.Razorpay) return true;

    return await new Promise<boolean>((resolve) => {
      const existing = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existing) {
        existing.addEventListener("load", () => resolve(true), { once: true });
        existing.addEventListener("error", () => resolve(false), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function handlePayment() {
    if (isGenerating) return;

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (!validate()) return;

    setIsGenerating(true);
    setError("");

    try {
      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded || !window.Razorpay) {
        throw new Error(
          "Unable to load Razorpay Checkout. Please check your internet connection and try again."
        );
      }

      const requestCheckoutId = checkoutId || crypto.randomUUID();
      if (!checkoutId) setCheckoutId(requestCheckoutId);

      const createOrderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer,
          items,
          checkoutId: requestCheckoutId,
        }),
      });

      const createOrderResult = await createOrderResponse
        .json()
        .catch(() => null);

      if (
        !createOrderResponse.ok ||
        !createOrderResult?.success ||
        !createOrderResult?.razorpayOrderId
      ) {
        throw new Error(
          createOrderResult?.error ||
            "Unable to start payment. Please try again."
        );
      }

      const razorpay = new window.Razorpay({
        key: createOrderResult.keyId,
        amount: createOrderResult.amount,
        currency: createOrderResult.currency,
        name: "Smells From Heaven",
        description: `Order ${createOrderResult.orderNumber}`,
        order_id: createOrderResult.razorpayOrderId,
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        notes: {
          order_number: createOrderResult.orderNumber,
        },
        theme: {
          color: "#bf4800",
        },
        handler: async (response) => {
          try {
            setError("");

            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            const verifyResult = await verifyResponse
              .json()
              .catch(() => null);

            if (!verifyResponse.ok || !verifyResult?.success) {
              throw new Error(
                verifyResult?.error ||
                  "Payment verification failed. Please contact support."
              );
            }

            clearCart();
            setIsGenerating(false);
            window.location.href = `/order-success?order=${encodeURIComponent(
              verifyResult.orderNumber || createOrderResult.orderNumber
            )}&token=${encodeURIComponent(verifyResult.accessToken || "")}`;
          } catch (paymentError) {
            console.error("Payment verification failed:", paymentError);
            setError(
              paymentError instanceof Error
                ? paymentError.message
                : "Payment succeeded, but payment confirmation failed. Please contact support."
            );
            setIsGenerating(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsGenerating(false);
          },
        },
      });

      razorpay.open();
    } catch (paymentError) {
      console.error("Unable to start Razorpay payment:", paymentError);
      setError(
        paymentError instanceof Error
          ? paymentError.message
          : "Something went wrong while starting payment."
      );
      setIsGenerating(false);
    }
  }

  const totalItems = items.reduce(
    (sum, item) => sum + (item.quantity ?? 1),
    0,
  );

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f0e4] text-[#1c2540]">
      {/* Scrapbook Heaven atmosphere */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-[#d9cdec]/45 blur-3xl" />
        <div className="absolute right-[-100px] top-10 h-96 w-96 rounded-full bg-[#f3c7d3]/40 blur-3xl" />
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
        <section className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:pt-12">
          <Link
            href="/cart"
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#1c2540]/55 transition-colors hover:text-[#1c2540]"
          >
            <ArrowLeft size={16} />
            Back to cart
          </Link>

          <div className="relative overflow-hidden rounded-[2rem] border border-[#1c2540]/10 bg-[#fffdf7] px-6 py-10 shadow-[8px_10px_0_rgba(28,37,64,0.08)] sm:px-10 lg:px-14">
            <div className="absolute -right-12 -top-14 h-44 w-44 rounded-full bg-[#fff6c9] blur-2xl" />
            <div className="absolute bottom-[-70px] left-1/3 h-48 w-48 rounded-full bg-[#bfe1ec]/45 blur-3xl" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="caveat mb-2 text-2xl text-[#8d5f2a] sm:text-3xl"
                >
                  one last little step ✦
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="text-4xl font-black tracking-[-0.045em] sm:text-5xl lg:text-6xl"
                >
                  Checkout
                  <span className="ml-2 inline-block -rotate-6 text-[#d58a9f]">♡</span>
                </motion.h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#1c2540]/60 sm:text-base">
                  Add your delivery details, check your little collection,
                  then continue to secure payment.
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
                <p className="caveat text-xl">your scent story starts here</p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] opacity-50">
                  SFH / secure checkout
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
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div className="absolute right-7 top-7 rotate-12">
                <span className="caveat text-2xl text-[#d58a9f]">nothing to checkout ♡</span>
              </div>

              <div className="mx-auto mb-6 flex h-20 w-20 rotate-[-4deg] items-center justify-center border border-[#1c2540]/10 bg-[#bfe1ec] shadow-[4px_5px_0_rgba(28,37,64,0.1)]">
                <ShoppingBag size={38} strokeWidth={1.7} />
              </div>

              <p className="caveat text-2xl text-[#8d5f2a]">
                your cart needs a little something...
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Your cart is empty.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#1c2540]/55">
                Add a perfume or build a combo first, then come back here to checkout.
              </p>

              <Link
                href="/shop"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1c2540] px-7 py-3.5 text-sm font-black text-white transition-transform hover:-translate-y-0.5"
              >
                Shop Fragrances
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Checkout steps */}
              <div className="mb-8 flex items-center justify-center gap-3 text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-black text-[#1c2540]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1c2540] text-xs text-white shadow-[2px_3px_0_rgba(28,37,64,0.12)]">
                    1
                  </span>
                  Customer details
                </div>
                <ChevronRight size={16} className="text-[#1c2540]/25" />
                <div className="flex items-center gap-2 text-[#1c2540]/40">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#1c2540]/15 bg-[#fffdf7] text-xs">
                    2
                  </span>
                  Secure payment
                </div>
              </div>

              <div className="grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                {/* Customer details */}
                <motion.section
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative overflow-hidden rounded-[1.75rem] border border-[#1c2540]/10 bg-[#fffdf7] p-5 shadow-[7px_8px_0_rgba(28,37,64,0.07)] sm:p-7"
                >
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#d9cdec]/45 blur-2xl" />

                  <div className="relative mb-7 flex items-center gap-4">
                    <div className="relative flex h-12 w-12 rotate-[-4deg] items-center justify-center border border-[#1c2540]/10 bg-[#f3c7d3] shadow-[3px_4px_0_rgba(28,37,64,0.08)]">
                      <div className="absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2 rotate-[-2deg] bg-[#fff6c9]/80" />
                      <ShoppingBag size={20} />
                    </div>
                    <div>
                      <p className="caveat text-xl text-[#8d5f2a]">where should heaven arrive?</p>
                      <h2 className="text-2xl font-black tracking-tight">
                        Customer details
                      </h2>
                      <p className="mt-1 text-sm text-[#1c2540]/50">
                        Add the details we need for delivery.
                      </p>
                    </div>
                  </div>

                  <CustomerDetailsForm
                    customer={customer}
                    onChange={setCustomer}
                  />

                  {error ? (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="alert"
                      className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                    >
                      {error}
                    </motion.div>
                  ) : null}

                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={isGenerating}
                    className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-black text-white transition-all ${
                      isGenerating
                        ? "cursor-wait bg-[#1c2540]/40"
                        : "bg-[#1c2540] hover:-translate-y-0.5 hover:shadow-[0_6px_0_rgba(28,37,64,0.15)]"
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Opening secure payment...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        Pay securely
                        <ChevronRight size={17} />
                      </>
                    )}
                  </button>

                  <p className="mt-3 text-center text-xs leading-5 text-[#1c2540]/45">
                    You&apos;ll be redirected to Razorpay&apos;s secure checkout to complete your payment.
                  </p>
                </motion.section>

                {/* Order summary */}
                <motion.aside
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative h-fit overflow-hidden rounded-[1.75rem] border border-[#1c2540]/10 bg-[#fffdf7] p-5 shadow-[7px_8px_0_rgba(28,37,64,0.08)] sm:p-6 lg:sticky lg:top-6"
                >
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#f3c7d3]/45 blur-2xl" />
                  <div className="absolute -bottom-10 -left-8 h-24 w-24 rounded-full bg-[#bfe1ec]/45 blur-2xl" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className="caveat text-2xl text-[#8d5f2a]">your little bundle ✦</p>
                      <h2 className="mt-1 text-2xl font-black tracking-tight">
                        Order summary
                      </h2>
                      <p className="mt-1 text-sm text-[#1c2540]/50">
                        {totalItems} {totalItems === 1 ? "item" : "items"} selected
                      </p>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 rotate-3 items-center justify-center border border-[#1c2540]/10 bg-[#fff6c9] shadow-sm">
                      <ShoppingBag size={18} />
                    </div>
                  </div>

                  <div className="relative mt-6 space-y-4">
                    {items.map((item, index) => {
                      const quantity = item.quantity ?? 1;
                      const line = totals.items.find((entry) => entry.item.id === item.id);
                      const itemPrice = line?.lineTotal ?? 0;

                      return (
                        <div
                          key={item.id}
                          className="relative border-b border-dashed border-[#1c2540]/12 pb-4 last:border-b-0"
                        >
                          <div className="flex justify-between gap-4">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className={[
                                    "inline-flex rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em]",
                                    index % 3 === 0
                                      ? "bg-[#f3c7d3]"
                                      : index % 3 === 1
                                        ? "bg-[#bfe1ec]"
                                        : "bg-[#d9cdec]",
                                  ].join(" ")}
                                >
                                  {item.type === "combo" ? "Combo" : "Perfume"}
                                </span>
                              </div>

                              <p className="mt-2 font-bold text-[#1c2540]">
                                {item.type === "combo"
                                  ? item.comboName ?? "Custom Combo"
                                  : item.productName ?? "Perfume"}
                              </p>
                              <p className="mt-1 text-xs text-[#1c2540]/45">
                                Qty: {quantity}
                              </p>
                            </div>

                            <span className="shrink-0 font-black text-[#1c2540]">
                              {formatPrice(itemPrice)}
                            </span>
                          </div>

                          {item.type === "combo" ? (
                            <div className="mt-3 rounded-2xl border border-[#1c2540]/8 bg-[#f7f0e4]/70 px-3 py-3 text-xs leading-5 text-[#1c2540]/60">
                              <p>
                                <span className="font-bold text-[#1c2540]">Bottle:</span>{" "}
                                {item.bottleSize ?? "-"}ml
                              </p>

                              {item.selectedProductNames?.length ? (
                                <p className="mt-1.5">
                                  <span className="font-bold text-[#1c2540]">Perfumes:</span>{" "}
                                  {item.selectedProductNames.join(", ")}
                                </p>
                              ) : null}

                              {(item.savings ?? 0) > 0 ? (
                                <p className="mt-1.5 font-bold text-[#16804a]">
                                  You save {formatPrice(item.savings ?? 0)}
                                </p>
                              ) : null}
                            </div>
                          ) : null}

                          {line?.personalizationText ? (
                            <div className="mt-3 rounded-2xl border border-[#1c2540]/8 bg-[#f7f0e4]/70 px-3 py-3 text-xs leading-5 text-[#1c2540]/60">
                              <p>
                                <span className="font-bold text-[#1c2540]">Personalization:</span>{" "}
                                {line.personalizationType} - &quot;
                                {line.personalizationText}&quot;
                              </p>
                              <p className="mt-1.5 font-bold text-[#1c2540]">
                                Personalization charge:{" "}
                                {formatPrice(line.personalizationCharge)}
                              </p>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  <div className="relative mt-5 space-y-3 border-t border-[#1c2540]/10 pt-5 text-sm">
                    <div className="flex items-center justify-between text-[#1c2540]/60">
                      <span>Subtotal</span>
                      <span className="font-bold text-[#1c2540]">
                        {formatPrice(totals.subtotal)}
                      </span>
                    </div>

                    {totals.discount > 0 ? (
                      <div className="flex items-center justify-between text-[#1c2540]/60">
                        <span>Discount</span>
                        <span className="font-bold text-[#16804a]">
                          -{formatPrice(totals.discount)}
                        </span>
                      </div>
                    ) : null}

                    <div className="flex items-center justify-between text-[#1c2540]/60">
                      <span>Shipping</span>
                      <span className="font-bold text-[#1c2540]">
                        {totals.shipping > 0 ? formatPrice(totals.shipping) : "FREE"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[#1c2540]/60">
                      <span>GST ({totals.gstRate}%)</span>
                      <span className="font-bold text-[#1c2540]">
                        {formatPrice(totals.gst)}
                      </span>
                    </div>
                  </div>

                  <div className="relative mt-5 flex items-end justify-between gap-4 border-t-2 border-dashed border-[#1c2540]/12 pt-5">
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

                  <div className="relative mt-5 rounded-2xl border border-[#1c2540]/8 bg-[#d9cdec]/45 p-4">
                    <div className="flex gap-3">
                      <MessageCircle
                        size={17}
                        className="mt-0.5 shrink-0 text-[#1c2540]/65"
                      />
                      <p className="text-xs leading-5 text-[#1c2540]/55">
                        Your customer and order details are used only to process this order.
                      </p>
                    </div>
                  </div>
                </motion.aside>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
