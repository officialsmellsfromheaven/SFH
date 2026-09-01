"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const benefits = [
  {
    title: "Curated Fragrances",
    description: "Find a scent that feels like you. Personality meets perfume.",
    icon: "✨",
  },
  {
    title: "Build Your Collection",
    description: "Create your own fragrance combination. Mix, match, save more.",
    icon: "🎨",
  },
  {
    title: "Easy WhatsApp Ordering",
    description: "Choose your fragrance and order directly. Simple, personal, efficient.",
    icon: "💬",
  },
  {
    title: "Free Shipping",
    description: "On qualifying orders above ₹999. Fast delivery to your doorstep.",
    icon: "📦",
  },
];

export default function ExperiencePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-10 sm:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#bf4800]">
              The Smells From Heaven Experience
            </p>
            <h1 className="mt-3 font-[var(--font-playfair)] text-4xl font-bold tracking-[-0.05em] text-[#1d1d1f] sm:text-5xl">
              Your scent. Your vibe.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#6e6e73] sm:text-lg">
              Premium fragrances crafted for everyday confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-6 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl border border-[#e5e5e5] bg-[#f5f5f7] p-6 transition-all duration-200 hover:border-[#d9d9dc] hover:shadow-[0_16px_30px_rgba(0,0,0,0.04)]"
            >
              <div className="mb-4 text-3xl">{benefit.icon}</div>
              <h3 className="text-xl font-semibold tracking-[-0.04em] text-[#1d1d1f]">
                {benefit.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#6e6e73]">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-2xl border border-[#e5e5e5] bg-gradient-to-r from-[#faf8f3] to-[#f5f5f7] p-8 text-center sm:p-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#bf4800]">
            Ready to find your scent?
          </p>
          <h2 className="mt-3 font-[var(--font-playfair)] text-3xl font-bold tracking-[-0.04em] text-[#1d1d1f] sm:text-4xl">
            Discover Your Fragrance
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-base text-[#6e6e73]">
            Explore our collections, use our fragrance finder, or build your own combo.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-[#111111] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#2d2d2d]"
            >
              SHOP FRAGRANCES
              <ArrowRight className="ml-2" size={16} />
            </Link>
            <Link
              href="/fragrance-finder"
              className="inline-flex items-center justify-center rounded-full border border-[#d9d9dc] bg-white px-8 py-3 text-sm font-semibold text-[#1d1d1f] transition-colors hover:border-[#b88932] hover:text-[#b88932]"
            >
              FIND MY SCENT
            </Link>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mt-16 rounded-2xl border border-[#e5e5e5] bg-white p-8 sm:p-12">
          <h2 className="text-center font-[var(--font-playfair)] text-3xl font-bold tracking-[-0.04em] text-[#1d1d1f] sm:text-4xl">
            Why Smells From Heaven?
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="mb-3 text-3xl">💎</div>
              <h3 className="font-semibold text-[#1d1d1f]">Premium Quality</h3>
              <p className="mt-2 text-sm text-[#6e6e73]">
                Signature blends with clean structure and memorable finishing notes.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-3 text-3xl">🎯</div>
              <h3 className="font-semibold text-[#1d1d1f]">For Every Mood</h3>
              <p className="mt-2 text-sm text-[#6e6e73]">
                Choose the energy you want to wear, from fresh to deep and intoxicating.
              </p>
            </div>
            <div className="text-center">
              <div className="mb-3 text-3xl">✨</div>
              <h3 className="font-semibold text-[#1d1d1f]">Easy to Love</h3>
              <p className="mt-2 text-sm text-[#6e6e73]">
                Luxury-inspired fragrances shaped for Indian lifestyles and special moments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
