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
      className="relative overflow-hidden bg-[#faf8f3] py-20 sm:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Ambient luxury glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 0.5, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute -left-40 top-24 h-[28rem] w-[28rem] rounded-full bg-[#d9bf7f]/10 blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 0.45, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute -right-40 bottom-[-8rem] h-[26rem] w-[26rem] rounded-full bg-[#ead8a8]/15 blur-3xl"
        />

        {/* Heading reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.14 } },
          }}
          className="relative mb-10 text-center"
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b88932]"
          >
            Why Smells From Heaven?
          </motion.p>

          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 45, scale: 0.96 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-[#111111] sm:text-5xl"
          >
            14 Reasons You&apos;ll Love Us ✨
          </motion.h2>

          <motion.div
            variants={{
              hidden: { opacity: 0, scaleX: 0 },
              visible: {
                opacity: 1,
                scaleX: 1,
                transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="mx-auto mt-5 h-px w-20 origin-center bg-[#b88932]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 45, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.16 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-4xl"
        >
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="luxury-card group relative rounded-[2rem] border border-[#e8dfcf] bg-[#fffdfb] p-4 shadow-[0_16px_40px_rgba(17,17,17,0.045)] transition-shadow duration-500 hover:border-[#d8bf8b] hover:shadow-[0_28px_65px_rgba(17,17,17,0.10)] sm:p-6"
            role="region"
            aria-roledescription="carousel"
            aria-label="Smells From Heaven benefits carousel"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Moving shine */}
            <motion.div
              initial={{ x: "-120%", opacity: 0 }}
              whileHover={{ x: "120%", opacity: 1 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent"
            />

            <div className="overflow-hidden rounded-[1.5rem] bg-[#f9f4ed] p-4 sm:p-6">
              <div className="relative h-48 sm:h-56">
                {CARDS.map((card, i) => {
                  const Icon = card.icon as LucideIcon;
                  const isActive = i === index;

                  return (
                    <motion.div
                      key={card.id}
                      initial={{ opacity: 0, y: 18, scale: 0.98 }}
                      animate={
                        isActive
                          ? { opacity: 1, y: 0, scale: 1 }
                          : { opacity: 0, y: -10, scale: 0.985 }
                      }
                      transition={{
                        duration: prefersReduced ? 0 : 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        position: isActive ? undefined : "absolute",
                        inset: isActive ? undefined : 0,
                      }}
                      className="flex h-full items-center justify-between gap-5 rounded-[1.25rem] p-2 sm:gap-6 sm:p-4"
                    >
                      <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                        <motion.div
                          animate={
                            isActive && !prefersReduced
                              ? { scale: [0.9, 1.08, 1], rotate: [0, -5, 0] }
                              : { scale: 1, rotate: 0 }
                          }
                          transition={{
                            duration: 0.7,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1rem] border border-[#ead9b5] bg-[#fffdf9] text-[#b88932] shadow-[0_10px_24px_rgba(17,17,17,0.05)]"
                        >
                          <Icon size={28} />
                        </motion.div>

                        <div className="min-w-0">
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                            transition={{ duration: 0.45, delay: 0.08 }}
                            className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6e6e73]"
                          >
                            #{card.id.toString().padStart(2, "0")}
                          </motion.div>

                          <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                            transition={{ duration: 0.5, delay: 0.12 }}
                            className="mt-2 text-lg font-semibold text-[#111111] sm:text-2xl"
                          >
                            {card.title}
                          </motion.h3>

                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                            transition={{ duration: 0.5, delay: 0.18 }}
                            className="mt-2 max-w-xl text-sm leading-6 text-[#4d4d4d] sm:text-base"
                          >
                            {card.desc}
                          </motion.p>
                        </div>
                      </div>

                      <motion.div
                        animate={
                          isActive && !prefersReduced
                            ? { y: [0, -5, 0], rotate: [0, 2, 0] }
                            : { y: 0, rotate: 0 }
                        }
                        transition={{
                          duration: 3.5,
                          repeat: isActive && !prefersReduced ? Infinity : 0,
                          ease: "easeInOut",
                        }}
                        className="hidden shrink-0 sm:block"
                      >
                        <div className="flex h-24 w-24 items-center justify-center rounded-[1.4rem] border border-[#ead8b1] bg-[#f5eee2] text-[#b88932] shadow-[0_12px_26px_rgba(17,17,17,0.04)]">
                          <Sparkles size={24} />
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Navigation buttons */}
            <motion.div
              whileHover={{ x: -2 }}
              className="absolute left-5 top-1/2 flex -translate-y-1/2 gap-2 sm:left-6"
            >
              <button
                aria-label="Previous reason"
                onClick={prev}
                className="rounded-full border border-[#eadfc5] bg-white/95 p-2 text-[#111111] shadow-[0_10px_24px_rgba(17,17,17,0.06)] transition-all duration-300 hover:border-[#b88932] hover:text-[#b88932] hover:shadow-[0_14px_30px_rgba(17,17,17,0.10)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b88932]"
              >
                <ChevronLeft size={18} />
              </button>
            </motion.div>

            <motion.div
              whileHover={{ x: 2 }}
              className="absolute right-5 top-1/2 flex -translate-y-1/2 gap-2 sm:right-6"
            >
              <button
                aria-label="Next reason"
                onClick={next}
                className="rounded-full border border-[#eadfc5] bg-white/95 p-2 text-[#111111] shadow-[0_10px_24px_rgba(17,17,17,0.06)] transition-all duration-300 hover:border-[#b88932] hover:text-[#b88932] hover:shadow-[0_14px_30px_rgba(17,17,17,0.10)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b88932]"
              >
                <ChevronRight size={18} />
              </button>
            </motion.div>

            {/* Progress dots */}
            <div className="mt-5 flex items-center justify-center gap-2.5" role="tablist" aria-label="Reasons">
              {CARDS.map((_, i) => (
                <motion.button
                  key={i}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Go to reason ${i + 1}`}
                  onClick={() => {
                    setIndex(i);
                    setPaused(true);
                  }}
                  whileHover={{ scale: 1.25 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    width: i === index ? 28 : 7,
                    opacity: i === index ? 1 : 0.65,
                  }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="h-2 rounded-full bg-[#b88932] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b88932]"
                />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Desktop reason grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06 } },
          }}
          className="mt-8 hidden grid-cols-3 gap-4 sm:grid"
        >
          {CARDS.map((card) => {
            const Icon = card.icon as LucideIcon;

            return (
              <motion.article
                key={card.id}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                whileHover={{ y: -5, scale: 1.01 }}
                className="group rounded-[1.4rem] border border-[#eee3d2] bg-white p-4 shadow-[0_8px_20px_rgba(17,17,17,0.02)] transition-shadow duration-300 hover:border-[#d8bf8b] hover:shadow-[0_18px_35px_rgba(17,17,17,0.07)]"
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    whileHover={{ rotate: 6, scale: 1.08 }}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#efe5d2] bg-[#f8f2ea] text-[#b88932]"
                  >
                    <Icon size={18} />
                  </motion.div>

                  <div>
                    <div className="text-sm font-semibold text-[#111111]">{card.title}</div>
                    <p className="mt-1 text-xs leading-5 text-[#6e6e73]">{card.desc}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
