import Link from "next/link";
import { Check } from "lucide-react";
import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = { title: "Monthly Subscription – The Heaven Box" };

const plans = [
  {
    name: "Essential Box",
    price: 999,
    original: 1499,
    items: 2,
    features: ["2 handpicked fragrances (10ml each)", "Free shipping", "10% off all purchases", "Monthly newsletter"],
    highlight: false,
  },
  {
    name: "Heaven Box",
    price: 1799,
    original: 2699,
    items: 3,
    features: ["3 premium fragrances (10ml each)", "Free shipping", "15% off all purchases", "Early access to launches", "Exclusive subscriber discounts", "Heaven Points × 2"],
    highlight: true,
  },
  {
    name: "Luxury Box",
    price: 3499,
    original: 5499,
    items: 5,
    features: ["5 luxury fragrances (10–30ml)", "Free express shipping", "20% off all purchases", "Priority customer service", "Free gift every 3rd month", "Heaven Points × 3"],
    highlight: false,
  },
];

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <PageHero eyebrow="Monthly Subscription" title="The Heaven Box" subtitle="Discover new fragrances every month, curated by our master perfumers, delivered to your door." showLogo />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid sm:grid-cols-3 gap-6 mb-14">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-7 border-2 ${
                plan.highlight
                  ? "border-amber-500 bg-gradient-to-br from-amber-50 to-white shadow-xl shadow-amber-100 relative"
                  : "border-stone-200 bg-white"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="font-bold text-stone-800 text-xl font-[var(--font-playfair)] mb-1">{plan.name}</h3>
              <p className="text-stone-400 text-sm mb-4">{plan.items} fragrances/month</p>
              <div className="mb-5">
                <span className="text-3xl font-bold text-stone-900">₹{plan.price.toLocaleString("en-IN")}</span>
                <span className="text-stone-400 text-sm">/month</span>
                <span className="ml-2 text-sm text-stone-400 line-through">₹{plan.original.toLocaleString("en-IN")}</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-stone-600">
                    <Check size={15} className="text-emerald-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/shop"
                className={`block w-full text-center py-3.5 rounded-xl font-semibold text-sm transition-colors ${
                  plan.highlight
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "border-2 border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white"
                }`}
              >
                Start Shopping
              </Link>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 border border-stone-100 text-center">
          <h3 className="font-bold text-stone-800 text-xl mb-2">How It Works</h3>
          <div className="grid sm:grid-cols-4 gap-6 mt-6">
            {[
              { step: "1", title: "Choose a Plan", desc: "Pick the box that suits your budget and fragrance appetite." },
              { step: "2", title: "We Curate", desc: "Our perfumers handpick 2–5 fragrances based on your preferences." },
              { step: "3", title: "We Ship", desc: "Your Heaven Box ships on the 1st of every month." },
              { step: "4", title: "Discover & Enjoy", desc: "Try new fragrances and reorder your favourites at subscriber price." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 font-bold flex items-center justify-center mx-auto mb-3">{item.step}</div>
                <h4 className="font-bold text-stone-800 mb-1 text-sm">{item.title}</h4>
                <p className="text-stone-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
