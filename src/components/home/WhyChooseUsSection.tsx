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
      className="relative overflow-hidden bg-[#f7f0e4] py-20 sm:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Scrapbook background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#bfe1ec]/35 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#f3c7d3]/30 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d9cdec]/20 blur-3xl" />

        <div className="absolute left-[7%] top-12 h-3 w-28 rotate-[-6deg] bg-[#fff6c9]/80" />
        <div className="absolute right-[9%] top-28 h-3 w-24 rotate-[8deg] bg-[#cfe6cf]/80" />
        <div className="absolute bottom-20 left-[11%] h-3 w-24 rotate-[5deg] bg-[#f3c7d3]/70" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className="relative mx-auto mb-10 max-w-3xl text-center sm:mb-14"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 18, rotate: -4 },
              visible: {
                opacity: 1,
                y: 0,
                rotate: -2,
                transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="mx-auto inline-flex rotate-[-2deg] items-center rounded-sm border border-[#ded2bd] bg-[#fffdf7] px-4 py-2 shadow-[2px_3px_0_rgba(28,37,64,0.08)]"
          >
            <span
              className="text-2xl leading-none text-[#1c2540] sm:text-3xl"
              style={{ fontFamily: "CaveatLocal, cursive" }}
            >
              why we&apos;re worth remembering ✦
            </span>
          </motion.div>

          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 35, scale: 0.97 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="mt-5 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.94] tracking-[-0.06em] text-[#1c2540] sm:text-5xl lg:text-6xl"
          >
            14 little reasons.
            <span className="block">One big feeling.</span>
          </motion.h2>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
              },
            }}
            className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#5d5a61] sm:text-lg"
          >
            Premium fragrance, thoughtful details, and a little bit of heaven
            in everything we do.
          </motion.p>
        </motion.div>

        {/* Mobile / tablet interactive scrapbook card */}
        <motion.div
          initial={{ opacity: 0, y: 45, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-4xl lg:hidden"
        >
          {/* Tape */}
          <div className="pointer-events-none absolute left-1/2 top-[-10px] z-20 h-7 w-28 -translate-x-1/2 rotate-[-2deg] bg-[#fff6c9]/90 shadow-sm" />

          <motion.div
            whileHover={{ y: -4, rotate: -0.3 }}
            transition={{ duration: 0.35 }}
            className="relative overflow-hidden border border-[#dfd3bf] bg-[#fffdf7] p-4 shadow-[8px_12px_0_rgba(28,37,64,0.06),0_24px_55px_rgba(17,17,17,0.08)] sm:p-6"
            role="region"
            aria-roledescription="carousel"
            aria-label="Smells From Heaven benefits carousel"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#d8ccb8_0.7px,transparent_0.7px)] [background-size:12px_12px]" />

            <div className="relative min-h-[330px] overflow-hidden border border-dashed border-[#d8ccb8] bg-[#f9f3e8] p-5 sm:min-h-[290px] sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <span
                  className="text-2xl text-[#1c2540]"
                  style={{ fontFamily: "CaveatLocal, cursive" }}
                >
                  SFH scrapbook
                </span>
                <span className="rotate-[3deg] text-[10px] font-bold uppercase tracking-[0.18em] text-[#b88932]">
                  memory no. {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {CARDS.map((card, i) => {
                const Icon = card.icon as LucideIcon;
                const isActive = i === index;

                return (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, x: 25, rotate: 2 }}
                    animate={
                      isActive
                        ? { opacity: 1, x: 0, rotate: i % 2 === 0 ? -0.6 : 0.6 }
                        : { opacity: 0, x: -20, rotate: 0 }
                    }
                    transition={{
                      duration: prefersReduced ? 0 : 0.55,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      position: isActive ? undefined : "absolute",
                      inset: isActive ? undefined : 0,
                    }}
                    className="relative flex min-h-[205px] flex-col justify-between border border-[#ddd1bc] bg-white p-5 shadow-[5px_7px_0_rgba(28,37,64,0.06)] sm:min-h-[185px] sm:p-6"
                  >
                    <div className="absolute -right-2 -top-2 h-7 w-20 rotate-[7deg] bg-[#f3c7d3]/70" />

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 shrink-0 rotate-[-4deg] items-center justify-center border border-[#d7c49d] bg-[#fff6c9] text-[#b88932] shadow-[3px_4px_0_rgba(28,37,64,0.06)]">
                        <Icon size={25} />
                      </div>
                      <span
                        className="text-xl text-[#7b6d65]"
                        style={{ fontFamily: "CaveatLocal, cursive" }}
                      >
                        made with intention
                      </span>
                    </div>

                    <div className="mt-5">
                      <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8b827d]">
                        reason #{String(card.id).padStart(2, "0")}
                      </div>
                      <h3 className="mt-1 text-2xl font-semibold leading-tight text-[#1c2540]">
                        {card.title}
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#5d5a61]">
                        {card.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="relative mt-5 flex items-center justify-between gap-4">
              <button
                aria-label="Previous reason"
                onClick={prev}
                className="rounded-full border border-[#d9ccb7] bg-white p-2.5 text-[#1c2540] shadow-[3px_4px_0_rgba(28,37,64,0.05)] transition-all duration-300 hover:-translate-x-1 hover:border-[#b88932] hover:text-[#b88932] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b88932]"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex min-w-0 flex-1 flex-col items-center">
                <div className="flex items-center gap-1.5" role="tablist" aria-label="Reasons">
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
                        width: i === index ? 24 : 6,
                        opacity: i === index ? 1 : 0.45,
                      }}
                      transition={{ duration: 0.25 }}
                      className="h-1.5 rounded-full bg-[#1c2540] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b88932]"
                    />
                  ))}
                </div>
                <span
                  className="mt-2 text-xl text-[#8b827d]"
                  style={{ fontFamily: "CaveatLocal, cursive" }}
                >
                  swipe through the memories →
                </span>
              </div>

              <button
                aria-label="Next reason"
                onClick={next}
                className="rounded-full border border-[#d9ccb7] bg-white p-2.5 text-[#1c2540] shadow-[3px_4px_0_rgba(28,37,64,0.05)] transition-all duration-300 hover:translate-x-1 hover:border-[#b88932] hover:text-[#b88932] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b88932]"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Desktop scrapbook wall */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07 } },
          }}
          className="relative mt-8 hidden lg:block"
        >
          <div className="absolute inset-x-8 top-5 bottom-5 border border-dashed border-[#d9ccb7]" />

          <div className="relative grid grid-cols-4 gap-5 xl:gap-6">
            {CARDS.map((card, i) => {
              const Icon = card.icon as LucideIcon;
              const rotations = [-2, 1.5, -1, 2, -1.5, 1, -2.5, 1.5, -1, 2, -1.5, 1, -2, 1];
              const papers = [
                "#fffdf7",
                "#fff6c9",
                "#eaf5f5",
                "#fbe8ee",
                "#eef5e9",
              ];

              return (
                <motion.article
                  key={card.id}
                  variants={{
                    hidden: { opacity: 0, y: 35, scale: 0.94, rotate: 0 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      rotate: rotations[i],
                      transition: {
                        duration: 0.65,
                        ease: [0.22, 1, 0.36, 1],
                      },
                    },
                  }}
                  whileHover={{
                    y: -10,
                    rotate: 0,
                    scale: 1.045,
                    zIndex: 10,
                    transition: { duration: 0.25 },
                  }}
                  className="group relative min-h-[245px] border border-[#dcd0bb] p-5 shadow-[5px_7px_0_rgba(28,37,64,0.055),0_16px_30px_rgba(17,17,17,0.055)]"
                  style={{ backgroundColor: papers[i % papers.length] }}
                >
                  {/* Tape */}
                  <div
                    className={`pointer-events-none absolute left-1/2 top-[-11px] h-6 w-20 -translate-x-1/2 ${
                      i % 3 === 0
                        ? "rotate-[-4deg] bg-[#bfe1ec]/75"
                        : i % 3 === 1
                          ? "rotate-[3deg] bg-[#fff6c9]/85"
                          : "rotate-[-2deg] bg-[#f3c7d3]/75"
                    }`}
                  />

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 rotate-[-4deg] items-center justify-center border border-[#d6c69f] bg-white/80 text-[#b88932] shadow-[2px_3px_0_rgba(28,37,64,0.05)] transition-transform duration-300 group-hover:rotate-[4deg]">
                      <Icon size={19} />
                    </div>

                    <span
                      className="text-2xl text-[#8b827d]"
                      style={{ fontFamily: "CaveatLocal, cursive" }}
                    >
                      {String(card.id).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-semibold leading-tight text-[#1c2540]">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#5d5a61]">
                    {card.desc}
                  </p>

                  <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
                    <span
                      className="text-lg text-[#9b8d82]"
                      style={{ fontFamily: "CaveatLocal, cursive" }}
                    >
                      wear the feeling.
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-[#b88932]" />
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.div>

        {/* Tiny closing note */}
        <motion.div
          initial={{ opacity: 0, y: 18, rotate: -2 }}
          whileInView={{ opacity: 1, y: 0, rotate: -1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, delay: 0.15 }}
          className="mx-auto mt-10 w-fit rotate-[-1deg] border border-[#ded2bd] bg-[#fffdf7] px-5 py-3 shadow-[3px_5px_0_rgba(28,37,64,0.05)]"
        >
          <span
            className="text-2xl text-[#1c2540]"
            style={{ fontFamily: "CaveatLocal, cursive" }}
          >
            because the best scents become memories ✿
          </span>
        </motion.div>
      </div>
    </section>
  );
}
