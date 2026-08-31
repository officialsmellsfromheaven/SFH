"use client";

import Link from "next/link";
import { MessageCircle, FileText } from "lucide-react";
import { useState } from "react";
import { orderConfig } from "@/lib/orderConfig";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import {
  buildWhatsAppMessage,
  getInvoiceNumber,
  printCustomerInvoice,
  type CustomerDetails,
} from "@/lib/customerInvoice";

const initialCustomer: CustomerDetails = {
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
  const [customer, setCustomer] = useState<CustomerDetails>(initialCustomer);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const total = items.reduce(
    (sum, item) =>
      sum + (item.type === "combo" ? item.comboPrice ?? 0 : item.referencePrice ?? 0),
    0,
  );

  function update(field: keyof CustomerDetails, value: string) {
    setCustomer((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    const required: Array<keyof CustomerDetails> = [
      "name", "phone", "email", "address", "city", "state", "pincode",
    ];
    if (required.some((field) => !customer[field].trim())) {
      setError("Please fill all required customer details.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(customer.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!/^\d{10}$/.test(customer.phone.replace(/\D/g, ""))) {
      setError("Please enter a valid 10-digit mobile number.");
      return false;
    }
    if (!/^\d{6}$/.test(customer.pincode.trim())) {
      setError("Please enter a valid 6-digit pincode.");
      return false;
    }
    setError("");
    return true;
  }

  async function placeOrder() {
    if (isGenerating) return; // prevent double clicks
    if (!validate() || items.length === 0) return;

    setIsGenerating(true);
    const invoiceNumber = getInvoiceNumber();

    try {
      // Generate PDF and trigger download
      await printCustomerInvoice(customer, items, invoiceNumber);

      // After successful PDF generation, build WhatsApp message and open WhatsApp
      const orderText = buildWhatsAppMessage(customer, items, invoiceNumber);
      const whatsappUrl =
        `https://wa.me/${orderConfig.whatsappNumber}?text=${encodeURIComponent(orderText)}`;

      // slight delay to ensure download started
      window.setTimeout(() => {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }, 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate invoice.");
    } finally {
      setIsGenerating(false);
    }
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
            Enter your details, generate the invoice, then continue to WhatsApp.
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
                <FileText className="text-amber-600" />
                <div>
                  <h2 className="text-xl font-semibold text-stone-900">Customer details</h2>
                  <p className="text-sm text-stone-500">All fields are required.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name *" value={customer.name} onChange={(v) => update("name", v)} />
                <Field label="Mobile Number *" value={customer.phone} onChange={(v) => update("phone", v)} inputMode="numeric" />
                <Field label="Email *" value={customer.email} onChange={(v) => update("email", v)} type="email" />
                <Field label="Pincode *" value={customer.pincode} onChange={(v) => update("pincode", v)} inputMode="numeric" />
                <div className="sm:col-span-2">
                  <Field label="Complete Address *" value={customer.address} onChange={(v) => update("address", v)} />
                </div>
                <Field label="City *" value={customer.city} onChange={(v) => update("city", v)} />
                <Field label="State *" value={customer.state} onChange={(v) => update("state", v)} />
              </div>

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
                {isGenerating ? "Generating Invoice..." : "Generate Invoice & Order on WhatsApp"}
              </button>

              <p className="mt-3 text-center text-xs text-stone-500">
                Invoice opens in a new window. Use “Print / Save as PDF” there.
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
                <span className="text-2xl font-bold text-stone-900">{formatPrice(total)}</span>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-700">{label}</span>
      <input
        type={type}
        value={value}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
      />
    </label>
  );
}
