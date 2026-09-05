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
    <main className="relative min-h-screen overflow-hidden bg-[#f7f0e4] text-[#1c2540]">
      {/* Soft Heaven atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 top-24 h-80 w-80 rounded-full bg-[#f3c7d3]/35 blur-3xl" />
        <div className="absolute -right-24 top-32 h-80 w-80 rounded-full bg-[#bfe1ec]/40 blur-3xl" />
        <div className="absolute left-1/2 top-[52%] h-96 w-96 -translate-x-1/2 rounded-full bg-[#d9cdec]/25 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #1c2540 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
      </div>

      {/* Hero */}
      <section className="relative px-4 pb-10 pt-8 sm:px-6 sm:pt-12">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[34px] border border-[#1c2540]/10 bg-[#fffdf7] px-6 py-10 shadow-[0_24px_70px_rgba(28,37,64,0.10)] sm:px-12 sm:py-14">
            <div className="absolute left-10 top-0 h-9 w-28 -translate-y-1/2 rotate-[-4deg] bg-[#f3c7d3]/75 shadow-sm" />
            <div className="absolute right-10 top-7 hidden rotate-[4deg] bg-[#fff6c9] px-4 py-2 shadow-sm sm:block">
              <span className="caveat text-lg font-semibold">
                a little heaven, just for you ♡
              </span>
            </div>

            <div className="mx-auto max-w-3xl text-center">
              <p className="caveat text-2xl font-semibold text-[#b88932]">
                the SFH experience ✦
              </p>
              <h1 className="mt-2 font-serif text-4xl font-bold tracking-[-0.05em] sm:text-6xl">
                Your scent. Your vibe.
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#1c2540]/65 sm:text-base">
                Premium fragrances crafted for everyday confidence — with a
                little more feeling in every detail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience benefits */}
      <section className="relative px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <p className="caveat text-2xl font-semibold text-[#1c2540]/65">
              more than just a bottle...
            </p>
            <h2 className="mt-1 font-serif text-3xl font-bold sm:text-4xl">
              Everything should feel effortless.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <article
                key={benefit.title}
                className={`group relative overflow-hidden rounded-[28px] border border-[#1c2540]/10 p-7 shadow-[6px_8px_0_rgba(28,37,64,0.055)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_11px_0_rgba(28,37,64,0.07)] ${
                  index % 4 === 0
                    ? "rotate-[-0.7deg] bg-[#fffdf7]"
                    : index % 4 === 1
                      ? "rotate-[0.7deg] bg-[#f3c7d3]/45"
                      : index % 4 === 2
                        ? "rotate-[-0.5deg] bg-[#bfe1ec]/45"
                        : "rotate-[0.6deg] bg-[#cfe6cf]/50"
                }`}
              >
                <div
                  className={`absolute left-1/2 top-0 h-8 w-16 -translate-x-1/2 -translate-y-1/2 rotate-[2deg] shadow-sm ${
                    index % 3 === 0
                      ? "bg-[#fff6c9]/90"
                      : index % 3 === 1
                        ? "bg-[#f3c7d3]/80"
                        : "bg-[#bfe1ec]/80"
                  }`}
                />

                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="caveat text-xl font-semibold text-[#b88932]">
                      chapter {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1 text-xl font-bold tracking-[-0.03em]">
                      {benefit.title}
                    </h3>
                  </div>

                  <div className="flex h-14 w-14 shrink-0 rotate-[5deg] items-center justify-center rounded-2xl border border-[#1c2540]/10 bg-[#fffdf7]/75 text-3xl shadow-sm transition-transform duration-300 group-hover:rotate-[-4deg] group-hover:scale-105">
                    {benefit.icon}
                  </div>
                </div>

                <p className="mt-5 max-w-md text-sm leading-7 text-[#1c2540]/60">
                  {benefit.description}
                </p>

                <p className="mt-5 text-right caveat text-lg font-semibold text-[#1c2540]/45">
                  made to feel like you ♡
                </p>
              </article>
            ))}
          </div>

          {/* CTA */}
          <section className="relative mt-16 overflow-hidden rounded-[32px] border border-[#1c2540]/10 bg-[#fffdf7] p-7 shadow-[8px_10px_0_rgba(28,37,64,0.055)] sm:mt-20 sm:p-12">
            <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#f3c7d3]/40 blur-3xl" />
            <div className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-[#bfe1ec]/45 blur-3xl" />

            <div className="relative mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-4 inline-block rotate-[-2deg] bg-[#fff6c9] px-5 py-2 shadow-sm">
                <span className="caveat text-xl font-semibold">
                  ready for your next memory? ✦
                </span>
              </div>

              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#b88932]">
                YOUR NEXT CHAPTER
              </p>

              <h2 className="mt-3 font-serif text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
                Discover Your Fragrance
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#1c2540]/60 sm:text-base">
                Explore our collections, use our fragrance finder, or build
                your own combo.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/shop"
                  className="group inline-flex items-center justify-center rounded-full bg-[#1c2540] px-7 py-3.5 text-sm font-bold text-white shadow-[4px_5px_0_rgba(28,37,64,0.14)] transition-all hover:-translate-y-0.5 hover:bg-[#2b3656]"
                >
                  SHOP FRAGRANCES
                  <ArrowRight
                    className="ml-2 transition-transform group-hover:translate-x-1"
                    size={16}
                  />
                </Link>

                <Link
                  href="/fragrance-finder"
                  className="inline-flex items-center justify-center rounded-full border border-[#1c2540]/15 bg-[#f7f0e4] px-7 py-3.5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:border-[#b88932] hover:text-[#b88932]"
                >
                  FIND MY SCENT
                </Link>
              </div>
            </div>
          </section>

          {/* Why SFH */}
          <section className="relative mt-14 rounded-[30px] border border-[#1c2540]/10 bg-[#d9cdec]/35 p-7 shadow-[6px_8px_0_rgba(28,37,64,0.05)] sm:mt-20 sm:p-11">
            <div className="absolute -right-2 -top-3 rotate-[4deg] bg-[#fffdf7] px-4 py-2 shadow-sm">
              <span className="caveat text-lg font-semibold">
                why it feels different ✦
              </span>
            </div>

            <div className="text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b88932]">
                THE SFH WAY
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                Why Smells From Heaven?
              </h2>
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {[
                {
                  icon: "💎",
                  title: "Premium Quality",
                  text: "Signature blends with clean structure and memorable finishing notes.",
                },
                {
                  icon: "🎯",
                  title: "For Every Mood",
                  text: "Choose the energy you want to wear, from fresh to deep and intoxicating.",
                },
                {
                  icon: "✨",
                  title: "Easy to Love",
                  text: "Luxury-inspired fragrances shaped for Indian lifestyles and special moments.",
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className={`relative text-center ${
                    index === 1 ? "sm:translate-y-3" : ""
                  }`}
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 rotate-[-4deg] items-center justify-center rounded-2xl border border-[#1c2540]/10 bg-[#fffdf7] text-3xl shadow-sm">
                    {item.icon}
                  </div>
                  <h3 className="font-bold tracking-[-0.02em]">{item.title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-[#1c2540]/55">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-10 text-center caveat text-xl font-semibold text-[#1c2540]/60">
              because the best scents don't just smell good — they stay with you. ♡
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
