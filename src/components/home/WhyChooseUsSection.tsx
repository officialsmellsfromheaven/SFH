"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Award,
  User,
  Search,
  Layers,
  Clock,
  Tag,
  MessageSquare,
  ShoppingCart,
  Box,
  MapPin,
  Headphones,
  Heart,
  Sparkles,
  Droplets,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

const CARDS = [
  {
    id: 1,
    icon: Award,
    title: "Premium Fragrances",
    desc: "Curated blends and fine extracts selected for their quality and character.",
  },
  {
    id: 2,
    icon: User,
    title: "Beautifully Personalized",
    desc: "Personalization options available to make gifts and orders feel special.",
  },
  {
    id: 3,
    icon: Search,
    title: "Discover Your Signature Scent",
    desc: "Guides and filters help you explore notes and styles to find what fits.",
  },
  {
    id: 4,
    icon: Layers,
    title: "Wide Fragrance Collection",
    desc: "A broad selection across families and concentrations for every taste.",
  },
  {
    id: 5,
    icon: Clock,
    title: "Long-Lasting Performance",
    desc: "Options chosen for good longevity when used as directed.",
  },
  {
    id: 6,
    icon: Tag,
    title: "Premium Experience, Honest Pricing",
    desc: "Transparent pricing and premium presentation across our range.",
  },
  {
    id: 7,
    icon: MessageSquare,
    title: "WhatsApp Personal Assistance",
    desc: "Direct WhatsApp help for recommendations and order confirmation.",
  },
  {
    id: 8,
    icon: ShoppingCart,
    title: "Simple Ordering",
    desc: "A streamlined checkout and order process for convenience.",
  },
  {
    id: 9,
    icon: Box,
    title: "Beautifully Packed",
    desc: "Orders are carefully packaged for gifting and safe delivery.",
  },
  {
    id: 10,
    icon: MapPin,
    title: "Track Your Order",
    desc: "Order tracking updates so you know when your delivery will arrive.",
  },
  {
    id: 11,
    icon: Headphones,
    title: "Customer-First Support",
    desc: "Support available for questions, returns and guidance.",
  },
  {
    id: 12,
    icon: Heart,
    title: "Made With Love",
    desc: "Passion and care go into sourcing and presenting each fragrance.",
  },
  {
    id: 13,
    icon: Droplets,
    title: "30–40% Premium Perfume Oil Concentration",
    desc: "We use approximately 30–40% premium perfume oil concentration, supported by quality fixatives and performance boosters where appropriate. Every fragrance is blended with care and love for a richer, more satisfying perfume experience.",
  },
  {
    id: 14,
    icon: Sparkles,
    title: "Premium Oils, Fixatives & Boosters",
    desc: "Our formulations are built with carefully selected premium perfume oils, fixatives, and performance-supporting materials where appropriate to help create balanced, memorable fragrances.",
  },
];

export default function WhyChooseUsSection() {
  const prefersReduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef(0);
  const slideInterval = useRef<number | null>(null);
  const total = CARDS.length;
  const rootRef = useRef<HTMLDivElement | null>(null);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
    setPaused(true);
  }, [total]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % total);
    setPaused(true);
  }, [total]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    rootRef.current?.addEventListener("focusin", () => setPaused(true));
    rootRef.current?.addEventListener("focusout", () => setPaused(false));
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  useEffect(() => {
    if (prefersReduced) return;
    if (paused) return;
    slideInterval.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 4500);
    return () => {
      if (slideInterval.current) window.clearInterval(slideInterval.current);
    };
  }, [paused, prefersReduced, total]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    setPaused(true);
  }
  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  }
  function onTouchEnd() {
    if (touchDeltaX.current > 50) prev();
    else if (touchDeltaX.current < -50) next();
    touchStartX.current = null;
    touchDeltaX.current = 0;
    setTimeout(() => setPaused(false), 1200);
  }

  return (
    <section
      ref={rootRef}
      aria-label="Why Smells From Heaven"
      className="bg-[#faf8f3] py-20 sm:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b88932]">
            Why Smells From Heaven?
          </p>
          <h2 className="font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-[#111111] sm:text-5xl">
          14 Reasons You&apos;ll Love Us ✨
          </h2>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div
            className="luxury-card relative rounded-[2rem] border border-[#e8dfcf] bg-[#fffdfb] p-4 shadow-[0_12px_34px_rgba(17,17,17,0.03)] hover:border-[#d8bf8b] sm:p-6"
            role="region"
            aria-roledescription="carousel"
            aria-label="Smells From Heaven benefits carousel"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="overflow-hidden rounded-[1.5rem] bg-[#f9f4ed] p-4 sm:p-6">
              <div className="relative h-44 sm:h-52">
                {CARDS.map((card, i) => {
                  const Icon = card.icon as LucideIcon;
                  const isActive = i === index;
                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
                      transition={{ duration: prefersReduced ? 0 : 0.45, ease: "easeOut" }}
                      style={{
                        position: isActive ? undefined : "absolute",
                        inset: isActive ? undefined : 0,
                      }}
                      className="flex h-full items-center justify-between gap-6 rounded-[1.25rem] p-2 sm:p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-[1rem] border border-[#efe5d2] bg-[#fffdf9] shadow-[0_8px_18px_rgba(17,17,17,0.03)]">
                          <Icon size={28} className="text-[#b88932]" />
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6e6e73]">#{card.id.toString().padStart(2, "0")}</div>
                          <h3 className="mt-2 text-lg font-semibold text-[#111111] sm:text-2xl">{card.title}</h3>
                          <p className="mt-2 max-w-xl text-sm leading-6 text-[#4d4d4d] sm:text-base">{card.desc}</p>
                        </div>
                      </div>

                      <div className="hidden sm:block">
                        <div className="flex h-24 w-24 items-center justify-center rounded-[1.4rem] border border-[#efe5d2] bg-[#f5eee2] text-[#b88932]">
                          <Sparkles size={24} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="absolute left-5 top-1/2 -translate-y-1/2 flex gap-2 sm:left-6">
              <button
                aria-label="Previous reason"
                onClick={prev}
                className="rounded-full border border-[#eadfc5] bg-white/90 p-2 text-[#111111] shadow-[0_10px_24px_rgba(17,17,17,0.04)] hover:border-[#b88932] hover:text-[#b88932] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b88932]"
              >
                <ChevronLeft size={18} />
              </button>
            </div>

            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex gap-2 sm:right-6">
              <button
                aria-label="Next reason"
                onClick={next}
                className="rounded-full border border-[#eadfc5] bg-white/90 p-2 text-[#111111] shadow-[0_10px_24px_rgba(17,17,17,0.04)] hover:border-[#b88932] hover:text-[#b88932] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b88932]"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="mt-5 flex items-center justify-center gap-3" role="tablist" aria-label="Reasons">
              {CARDS.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Go to reason ${i + 1}`}
                  onClick={() => {
                    setIndex(i);
                    setPaused(true);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index ? "w-7 bg-[#b88932]" : "w-2 bg-[#dccfa8]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 hidden grid-cols-3 gap-4 sm:grid">
          {CARDS.map((card) => {
            const Icon = card.icon as LucideIcon;
            return (
              <article key={card.id} className="rounded-[1.4rem] border border-[#eee3d2] bg-white p-4 shadow-[0_8px_20px_rgba(17,17,17,0.02)]">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#efe5d2] bg-[#f8f2ea] text-[#b88932]">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#111111]">{card.title}</div>
                    <p className="mt-1 text-xs leading-5 text-[#6e6e73]">{card.desc}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
