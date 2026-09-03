"use client";

import Link from "next/link";
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
    <div className="min-h-screen bg-stone-50 px-4 py-10 sm:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
          >
            <ArrowLeft size={16} />
            Back to cart
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#bf4800]">
            Checkout
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-stone-900 sm:text-4xl">
            Customer & order details
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-stone-500 sm:text-base">
            Enter your delivery details and review your order before
            continuing.
          </p>
        </div>

        {/* Empty Cart */}
        {items.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-[28px] border border-stone-200 bg-white p-8 text-center shadow-sm">
            <ShoppingBag
              size={50}
              className="mx-auto mb-5 text-amber-600"
            />

            <h2 className="mb-2 text-2xl font-bold text-stone-800">
              Your cart is empty
            </h2>

            <p className="mb-6 text-stone-500">
              Add a perfume or build a combo first.
            </p>

            <Link
              href="/shop"
              className="inline-flex rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
            >
              Shop fragrances
            </Link>
          </div>
        ) : (
          <>
            {/* Checkout Steps */}
            <div className="mb-8 hidden items-center justify-center gap-3 text-sm sm:flex">
              <div className="flex items-center gap-2 font-semibold text-stone-900">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-900 text-xs text-white">
                  1
                </span>
                Customer details
              </div>

              <ChevronRight size={16} className="text-stone-300" />

              <div className="flex items-center gap-2 text-stone-400">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-stone-300 text-xs">
                  2
                </span>
                Payment
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              {/* Customer Details */}
              <section className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50">
                    <ShoppingBag
                      size={20}
                      className="text-amber-600"
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-stone-900">
                      Customer details
                    </h2>

                    <p className="text-sm text-stone-500">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>

                <CustomerDetailsForm
                  customer={customer}
                  onChange={setCustomer}
                />

                {error ? (
                  <div
                    role="alert"
                    className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                  >
                    {error}
                  </div>
                ) : null}

                {/* Continue Button */}
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={isGenerating}
                  className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-bold text-white transition ${
                    isGenerating
                      ? "cursor-wait bg-stone-400"
                      : "bg-[#0071e3] hover:bg-[#0067d3]"
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
                    </>
                  )}
                </button>

                <p className="mt-3 text-center text-xs leading-5 text-stone-500">
                  You’ll be redirected to Razorpay’s secure checkout to complete your payment.
                </p>
              </section>

              {/* Order Summary */}
              <aside className="h-fit rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-stone-900">
                      Order summary
                    </h2>

                    <p className="mt-1 text-sm text-stone-500">
                      {totalItems}{" "}
                      {totalItems === 1 ? "item" : "items"}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-50">
                    <ShoppingBag
                      size={18}
                      className="text-stone-700"
                    />
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {items.map((item) => {
                    const quantity = item.quantity ?? 1;

                    const line = totals.items.find((entry) => entry.item.id === item.id);
                    const itemPrice = line?.lineTotal ?? 0;

                    return (
                      <div
                        key={item.id}
                        className="border-b border-stone-100 pb-4 last:border-b-0"
                      >
                        <div className="flex justify-between gap-4">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#bf4800]">
                              {item.type === "combo"
                                ? "Combo"
                                : "Perfume"}
                            </p>

                            <p className="mt-1 font-medium text-stone-800">
                              {item.type === "combo"
                                ? item.comboName ?? "Custom Combo"
                                : item.productName ?? "Perfume"}
                            </p>

                            <p className="mt-1 text-xs text-stone-500">Qty: {quantity}</p>
                          </div>

                          <span className="shrink-0 font-semibold text-stone-900">
                            {formatPrice(itemPrice)}
                          </span>
                        </div>

                        {item.type === "combo" ? (
                          <div className="mt-3 rounded-2xl bg-stone-50 px-3 py-3 text-xs text-stone-600">
                            <p>
                              <span className="font-semibold text-stone-800">
                                Bottle:
                              </span>{" "}
                              {item.bottleSize ?? "-"}ml
                            </p>

                            {item.selectedProductNames?.length ? (
                              <p className="mt-1.5 leading-5">
                                <span className="font-semibold text-stone-800">
                                  Perfumes:
                                </span>{" "}
                                {item.selectedProductNames.join(", ")}
                              </p>
                            ) : null}

                            {(item.savings ?? 0) > 0 ? (
                              <p className="mt-1.5 font-semibold text-[#0a7a40]">
                                You save{" "}
                                {formatPrice(item.savings ?? 0)}
                              </p>
                            ) : null}
                          </div>
                        ) : null}

                        {line?.personalizationText ? (
                          <div className="mt-3 rounded-2xl bg-stone-50 px-3 py-3 text-xs text-stone-600">
                            <p>
                              <span className="font-semibold text-stone-800">
                                Personalization:
                              </span>{" "}
                              {line.personalizationType} - &quot;
                              {line.personalizationText}&quot;
                            </p>
                            <p className="mt-1.5 font-semibold text-stone-800">
                              Personalization charge:{" "}
                              {formatPrice(line.personalizationCharge)}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="mt-5 space-y-3 border-t border-stone-200 pt-5 text-sm">
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-stone-900">
                      {formatPrice(totals.subtotal)}
                    </span>
                  </div>

                  {totals.discount > 0 ? (
                    <div className="flex items-center justify-between text-stone-600">
                      <span>Discount</span>
                      <span className="font-semibold text-[#0a7a40]">
                        -{formatPrice(totals.discount)}
                      </span>
                    </div>
                  ) : null}

                  <div className="flex items-center justify-between text-stone-600">
                    <span>Shipping</span>
                    <span className="font-medium text-stone-900">
                      {totals.shipping > 0 ? formatPrice(totals.shipping) : "FREE"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-stone-600">
                      <span>GST ({totals.gstRate}%)</span>
                      <span className="font-medium text-stone-900">
                        {formatPrice(totals.gst)}
                      </span>
                    </div>
                </div>

                <div className="mt-4 flex items-end justify-between border-t border-stone-200 pt-5">
                  <div>
                    <p className="text-sm font-medium text-stone-500">
                      Total
                    </p>
                    <p className="mt-1 text-xs text-stone-400">
                      Final order amount
                    </p>
                  </div>

                  <span className="text-2xl font-bold text-stone-900">
                    {formatPrice(totals.grandTotal)}
                  </span>
                </div>

                {/* Trust Note */}
                <div className="mt-5 rounded-2xl bg-stone-50 p-4">
                  <div className="flex gap-3">
                    <MessageCircle
                      size={17}
                      className="mt-0.5 shrink-0 text-stone-500"
                    />

                    <p className="text-xs leading-5 text-stone-500">
                      Your customer and order details are used only
                      to process this order.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </div>
  );
}