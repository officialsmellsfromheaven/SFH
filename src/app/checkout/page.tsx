"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { buildWhatsAppOrderUrl, calculateCartTotals, type WhatsAppCustomer } from "@/lib/orderMessaging";
import CustomerDetailsForm, { validateCustomerDetails } from "@/components/CustomerDetailsForm";

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
  const { items } = useCartStore();
  const [customer, setCustomer] = useState<WhatsAppCustomer>(initialCustomer);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const totals = calculateCartTotals(items);

  function validate() {
    const validationError = validateCustomerDetails(customer);
    if (validationError) {
      setError(validationError);
      return false;
    }
    setError("");
    return true;
  }

  function placeOrder() {
    if (isGenerating) return; // prevent double clicks
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!validate()) return;

    setIsGenerating(true);
    const whatsappUrl = buildWhatsAppOrderUrl(customer, items);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsGenerating(false);
  }

  return (
    <div className="min-h-screen bg-stone-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#bf4800]">
            Checkout
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-stone-900">
            Customer & order details
          </h1>
          <p className="mt-3 text-stone-500">
            Enter your details, then send your complete order directly through WhatsApp.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-[28px] border border-stone-200 bg-white p-8 text-center shadow-sm">
            <MessageCircle size={50} className="mx-auto mb-5 text-amber-600" />
            <h2 className="mb-2 text-2xl font-bold text-stone-800">Your cart is empty</h2>
            <p className="mb-6 text-stone-500">Add a perfume or build a combo first.</p>
            <Link
              href="/shop"
              className="inline-flex rounded-full bg-amber-600 px-6 py-3 text-sm font-semibold text-white"
            >
              Shop fragrances
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <MessageCircle className="text-amber-600" />
                <div>
                  <h2 className="text-xl font-semibold text-stone-900">Customer details</h2>
                  <p className="text-sm text-stone-500">Your order details stay in this message.</p>
                </div>
              </div>

              <CustomerDetailsForm customer={customer} onChange={setCustomer} />

              {error ? (
                <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="button"
                onClick={placeOrder}
                disabled={isGenerating}
                className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-bold text-white transition ${isGenerating ? "bg-stone-400 cursor-wait" : "bg-[#0071e3] hover:bg-[#0067d3]"}`}
              >
                <MessageCircle size={18} />
                {isGenerating ? "Opening WhatsApp..." : "Order on WhatsApp"}
              </button>

              <p className="mt-3 text-center text-xs text-stone-500">
                Your complete order summary will be pre-filled in WhatsApp.
              </p>
            </section>

            <aside className="h-fit rounded-[28px] border border-stone-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-xl font-semibold text-stone-900">Order summary</h2>
              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="border-b border-stone-100 pb-4">
                    <div className="flex justify-between gap-3">
                      <span className="font-medium text-stone-800">
                        {item.type === "combo" ? item.comboName : item.productName}
                      </span>
                      <span className="font-semibold text-stone-900">
                        {formatPrice(item.type === "combo" ? item.comboPrice ?? 0 : item.referencePrice ?? 0)}
                      </span>
                    </div>
                    {item.type === "combo" ? (
                      <p className="mt-1 text-xs text-stone-500">
                        {item.quantity ?? 0} × {item.bottleSize ?? 0}ml
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-stone-200 pt-5">
                <span className="text-lg font-semibold text-stone-800">Total</span>
                <span className="text-2xl font-bold text-stone-900">{formatPrice(totals.finalTotal)}</span>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
