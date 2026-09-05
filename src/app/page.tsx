"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";

import HeroBanner from "@/components/home/HeroBanner";
import ProductSection from "@/components/home/ProductSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import ComboSection from "@/components/combo/ComboSection";
import {
  getProductPrimaryImage,
  products,
  type Product,
} from "@/lib/data";
import { getSiteImage } from "@/lib/siteImages";

/* =========================================================
   IMAGES
========================================================= */

const moodVisual = getSiteImage("homeMood");
const finderVisual = getSiteImage("fragranceFinder");
const mensCampaignVisual = getSiteImage("mensCampaign");

/* =========================================================
   PRODUCTS
========================================================= */

const bestSellers = products
  .filter((product) => product.isBestSeller)
  .concat(products.filter((product) => !product.isBestSeller))
  .slice(0, 4);

const moodOptions = [
  "🔥 BOLD",
  "🌊 FRESH",
  "🌙 MYSTERIOUS",
  "🍯 SWEET",
  "🌿 CLEAN",
];

const menProducts = products
  .filter((product) => product.category === "men")
  .slice(0, 3);

const womenProducts = products
  .filter((product) => product.category === "women")
  .slice(0, 3);

/* =========================================================
   BRAND PILLARS
========================================================= */

const brandPillars = [
  {
    title: "Premium by design",
    text: "Signature blends with clean structure, warm woods, and memorable finishing notes.",
  },
  {
    title: "Made for your mood",
    text: "Choose the energy you want to wear, from fresh and crisp to deep and intoxicating.",
  },
  {
    title: "Easy to love",
    text: "Luxury-inspired fragrances shaped for Indian lifestyles, daily rituals, and special nights.",
  },
];

/* =========================================================
   FRAGRANCE FINDER ANIMATIONS
========================================================= */

const finderContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
    },
  },
};

const finderItem: Variants = {
  hidden: {
    opacity: 0,
    y: 32,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const finderMoodItem: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================================================
   COLLECTION ANIMATIONS
========================================================= */

const collectionContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const collectionItem: Variants = {
  hidden: {
    opacity: 0,
    y: 55,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const collectionCard: Variants = {
  hidden: {
    opacity: 0,
    y: 45,
    scale: 0.92,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================================================
   MEN'S CAMPAIGN ANIMATIONS
========================================================= */

const campaignContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.16,
    },
  },
};

const campaignItem: Variants = {
  hidden: {
    opacity: 0,
    y: 45,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const campaignHeading: Variants = {
  hidden: {
    opacity: 0,
    y: 55,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const campaignButton: Variants = {
  hidden: {
    opacity: 0,
    y: 25,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================================================
   WHY SFH ANIMATIONS
========================================================= */

const whySfhContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const whySfhItem: Variants = {
  hidden: {
    opacity: 0,
    y: 55,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const whySfhIcon: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    rotate: -25,
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================================================
   HOME PAGE
========================================================= */

export default function HomePage() {
  return (
    <>
      {/* =====================================================
          HERO
      ====================================================== */}

      <HeroBanner />

      {/* =====================================================
          QUICK CATEGORIES
      ====================================================== */}

      <section className="border-y border-[#e9dfcf] bg-[#ffffff]/80">
        <div className="mx-auto flex max-w-7xl snap-x gap-6 overflow-x-auto px-4 py-5 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-[#4d4d4d] sm:justify-center sm:px-6">
          {[
            "EDP sprays",
            "Attars",
            "Oud blends",
            "Gift sets",
            "Free shipping over 999",
          ].map((item, index) => (
            <Link
              key={item}
              href="/shop"
              className="luxury-link group relative shrink-0 px-2 py-2 transition-colors hover:text-[#b88932]"
            >
              <span>{item}</span>

              {index < 4 ? (
                <span className="pointer-events-none absolute -right-3 top-1/2 hidden h-4 w-px -translate-y-1/2 bg-[#e9dfcf] sm:block" />
              ) : null}
            </Link>
          ))}
        </div>
      </section>

      {/* =====================================================
          COMBOS
      ====================================================== */}

      <ComboSection />

      {/* =====================================================
          BEST SELLERS
      ====================================================== */}

      <ProductSection
        title="Best sellers"
        subtitle="Loved for their depth and character"
        products={bestSellers}
        viewAllHref="/shop?filter=bestseller"
        viewAllLabel="Shop best sellers"
        tone="light"
      />

      {/* =====================================================
          WEAR YOUR MOOD
          SCRAPBOOK / HEAVEN MOOD BOARD
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#f7f0e4] py-20 sm:py-28">
        {/* Soft Heaven atmosphere */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#bfe1ec]/55 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#f3c7d3]/45 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.16 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.14 } },
            }}
            className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16"
          >
            {/* Scrapbook photo */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 45, rotate: -3, scale: 0.96 },
                visible: {
                  opacity: 1,
                  y: 0,
                  rotate: -2,
                  scale: 1,
                  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              whileHover={{ y: -8, rotate: -0.5 }}
              className="relative mx-auto w-full max-w-xl"
            >
              {/* Washi tape */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-5 left-1/2 z-20 h-10 w-32 -translate-x-1/2 rotate-[-4deg] bg-[#f1d9a6]/85 shadow-sm"
              />

              <div className="relative rotate-[-1deg] border border-[#e2d5bf] bg-[#fffdf7] p-4 shadow-[7px_10px_0_rgba(28,37,64,0.07),0_24px_55px_rgba(28,37,64,0.10)] sm:p-5">
                <div className="relative aspect-[4/5] overflow-hidden bg-[#e9f0ed]">
                  <Image
                    src={moodVisual?.src ?? "/logo.png"}
                    alt={
                      moodVisual?.alt ??
                      "Smells From Heaven Gen-Z lifestyle brand visual"
                    }
                    fill
                    sizes="(max-width: 1024px) 100vw, 620px"
                    className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.05]"
                  />
                </div>

                <div className="flex items-center justify-between gap-3 px-1 pt-4">
                  <span
                    className="text-[19px] font-medium text-[#1c2540]"
                    style={{ fontFamily: "CaveatLocal, cursive" }}
                  >
                    a mood worth remembering ✦
                  </span>
                  <span className="rotate-[-4deg] text-lg text-[#b88932]">
                    ♡
                  </span>
                </div>
              </div>

              <motion.div
                whileHover={{ rotate: 6, scale: 1.05 }}
                className="absolute -bottom-7 -right-2 z-20 rotate-[4deg] border border-[#e2d5bf] bg-[#fff6c9] px-4 py-3 shadow-[4px_6px_0_rgba(28,37,64,0.08)] sm:-right-7"
              >
                <span
                  className="text-[21px] font-semibold text-[#1c2540]"
                  style={{ fontFamily: "CaveatLocal, cursive" }}
                >
                  pick your vibe ✍︎
                </span>
              </motion.div>
            </motion.div>

            {/* Mood story */}
            <motion.div
              variants={{
                hidden: { opacity: 0, x: 35 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className="relative"
            >
              <motion.div
                whileHover={{ rotate: -1, y: -2 }}
                className="mb-5 inline-block rotate-[2deg] border border-[#ead5df] bg-[#fae9ef] px-4 py-2 shadow-[3px_4px_0_rgba(28,37,64,0.06)]"
              >
                <span
                  className="text-[21px] font-semibold text-[#1c2540]"
                  style={{ fontFamily: "CaveatLocal, cursive" }}
                >
                  WEAR YOUR MOOD. ♡
                </span>
              </motion.div>

              <h2 className="font-[var(--font-playfair)] text-5xl font-semibold leading-[0.9] tracking-[-0.065em] text-[#1c2540] sm:text-6xl lg:text-[5.2rem]">
                Your fragrance.
                <span className="block">Your vibe.</span>
                <span className="block text-[#b88932]">Your rules.</span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-[#55515a] sm:text-lg">
                Discover a fragrance mood that matches the way you move
                through the world. Some days need a little sunshine. Some need
                mystery. Some just need you.
              </p>

              {/* Mood stickers */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.07 } },
                }}
                className="mt-7 flex max-w-xl flex-wrap gap-3"
              >
                {moodOptions.map((option, index) => {
                  const noteStyles = [
                    "rotate-[-2deg] border-[#cddfe4] bg-[#e9f4f5]",
                    "rotate-[2deg] border-[#d8dfc9] bg-[#edf3df]",
                    "rotate-[-1deg] border-[#d9cdec] bg-[#f0ebf8]",
                    "rotate-[3deg] border-[#ead5df] bg-[#fae9ef]",
                    "rotate-[-2deg] border-[#e7d9b3] bg-[#fff6c9]",
                  ];

                  return (
                    <motion.span
                      key={option}
                      variants={{
                        hidden: { opacity: 0, y: 18, scale: 0.9 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          transition: {
                            duration: 0.45,
                            ease: [0.22, 1, 0.36, 1],
                          },
                        },
                      }}
                      whileHover={{ y: -6, rotate: 0, scale: 1.05 }}
                      className={`inline-flex items-center border px-4 py-2.5 text-[15px] font-semibold text-[#1c2540] shadow-[3px_4px_0_rgba(28,37,64,0.05)] ${noteStyles[index]}`}
                      style={{ fontFamily: "CaveatLocal, cursive" }}
                    >
                      {option}
                    </motion.span>
                  );
                })}
              </motion.div>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <motion.div whileHover={{ y: -4, rotate: -1 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/fragrance-finder"
                    className="inline-flex items-center justify-center gap-2 border-2 border-[#1c2540] bg-[#1c2540] px-7 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-[5px_6px_0_rgba(28,37,64,0.13)] transition-all duration-300 hover:bg-[#27324f]"
                  >
                    FIND MY SCENT
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ y: -4, rotate: 1 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/shop?filter=bestseller"
                    className="inline-flex items-center justify-center gap-2 border border-[#cbbd9e] bg-[#fffdf7] px-7 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1c2540] shadow-[4px_5px_0_rgba(28,37,64,0.05)] transition-all duration-300 hover:border-[#b88932] hover:text-[#b88932]"
                  >
                    SHOP BESTSELLERS
                  </Link>
                </motion.div>
              </div>

              <p
                className="mt-7 text-[21px] text-[#6b6570]"
                style={{ fontFamily: "CaveatLocal, cursive" }}
              >
                no rules. just good scent. ☁
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          FRAGRANCE FINDER
          SCRAPBOOK / SCENT MATCH
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#fffdf7] py-20 sm:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#d9cdec]/45 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-[#bfe1ec]/45 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.16 }}
            variants={finderContainer}
            className="mx-auto mb-10 max-w-3xl text-center sm:mb-14"
          >
            <motion.div
              variants={finderItem}
              className="mx-auto mb-4 inline-block rotate-[-2deg] border border-[#ead5df] bg-[#fae9ef] px-4 py-2 shadow-[3px_4px_0_rgba(28,37,64,0.06)]"
            >
              <span
                className="text-[21px] font-semibold text-[#1c2540]"
                style={{ fontFamily: "CaveatLocal, cursive" }}
              >
                not sure what to wear? ♡
              </span>
            </motion.div>

            <motion.h2
              variants={finderItem}
              className="font-[var(--font-playfair)] text-4xl font-semibold leading-[0.94] tracking-[-0.06em] text-[#1c2540] sm:text-6xl"
            >
              LET YOUR VIBE
              <span className="block text-[#b88932]">
                CHOOSE YOUR FRAGRANCE.
              </span>
            </motion.h2>

            <motion.p
              variants={finderItem}
              className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#55515a] sm:text-lg"
            >
              A little mood. A little magic. Find the scent that feels like you today.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={finderContainer}
            className="relative mx-auto max-w-6xl"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-4 left-[18%] z-20 h-9 w-32 rotate-[-5deg] bg-[#f1d9a6]/80 shadow-sm"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-4 right-[14%] z-20 h-8 w-28 rotate-[6deg] bg-[#bfe1ec]/80 shadow-sm"
            />

            <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
              <motion.div
                variants={finderItem}
                whileHover={{ y: -8, rotate: -1 }}
                className="relative rotate-[1.5deg] border border-[#e2d5bf] bg-[#fffdf7] p-4 shadow-[7px_10px_0_rgba(28,37,64,0.07),0_24px_55px_rgba(28,37,64,0.09)] sm:p-5"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#e9f0ed]">
                  <Image
                    src={finderVisual?.src ?? "/logo.png"}
                    alt={
                      finderVisual?.alt ??
                      "Smells From Heaven fragrance finder character visual"
                    }
                    fill
                    sizes="(max-width: 1024px) 100vw, 520px"
                    className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.06]"
                  />
                </div>

                <div className="flex items-center justify-between px-1 pt-4">
                  <span
                    className="text-[20px] text-[#1c2540]"
                    style={{ fontFamily: "CaveatLocal, cursive" }}
                  >
                    your scent story starts here ✦
                  </span>
                  <span className="text-lg text-[#b88932]">☁</span>
                </div>
              </motion.div>

              <motion.div variants={finderContainer} className="relative">
                <motion.div variants={finderItem} className="mb-5">
                  <span
                    className="text-2xl text-[#1c2540]"
                    style={{ fontFamily: "CaveatLocal, cursive" }}
                  >
                    Pick the energy you want to wear...
                  </span>
                </motion.div>

                <motion.div
                  variants={finderContainer}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {moodOptions.map((option, index) => {
                    const noteStyles = [
                      "rotate-[-2deg] border-[#cddfe4] bg-[#e9f4f5]",
                      "rotate-[2deg] border-[#d8dfc9] bg-[#edf3df]",
                      "rotate-[-1deg] border-[#d9cdec] bg-[#f0ebf8]",
                      "rotate-[3deg] border-[#ead5df] bg-[#fae9ef]",
                      "rotate-[-2deg] border-[#e7d9b3] bg-[#fff6c9]",
                    ];

                    return (
                      <motion.div
                        key={option}
                        variants={finderMoodItem}
                        whileHover={{ y: -7, rotate: 0, scale: 1.035 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Link
                          href="/fragrance-finder"
                          className={`group flex items-center justify-between border px-5 py-4 text-[#1c2540] shadow-[4px_5px_0_rgba(28,37,64,0.05)] transition-all duration-300 hover:shadow-[7px_9px_0_rgba(28,37,64,0.08)] ${noteStyles[index]}`}
                        >
                          <span
                            className="text-[20px] font-semibold"
                            style={{ fontFamily: "CaveatLocal, cursive" }}
                          >
                            {option}
                          </span>
                          <ArrowRight
                            size={17}
                            className="opacity-50 transition-transform duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>

                <motion.div
                  variants={finderItem}
                  className="mt-8 flex flex-wrap items-center gap-4"
                >
                  <motion.div
                    whileHover={{ y: -5, rotate: -1 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link
                      href="/fragrance-finder"
                      className="inline-flex items-center justify-center gap-2 border-2 border-[#1c2540] bg-[#1c2540] px-7 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-[5px_6px_0_rgba(28,37,64,0.13)] transition-all duration-300 hover:bg-[#27324f]"
                    >
                      START MATCHING
                      <ArrowRight size={16} />
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5, rotate: 1 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link
                      href="/shop"
                      className="inline-flex items-center justify-center border border-[#cbbd9e] bg-[#fffdf7] px-7 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1c2540] shadow-[4px_5px_0_rgba(28,37,64,0.05)] transition-all duration-300 hover:border-[#b88932] hover:text-[#b88932]"
                    >
                      SHOP ALL
                    </Link>
                  </motion.div>
                </motion.div>

                <motion.p
                  variants={finderItem}
                  className="mt-6 text-[21px] text-[#6b6570]"
                  style={{ fontFamily: "CaveatLocal, cursive" }}
                >
                  no overthinking. just pick a vibe. ♡
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          COLLECTIONS
          SCRAPBOOK HEAVEN
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#f7f0e4] py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.65 }}
          whileInView={{ opacity: 0.55, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#bfe1ec]/55 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.65 }}
          whileInView={{ opacity: 0.5, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#f3c7d3]/50 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={collectionContainer}
            className="relative mx-auto mb-12 max-w-4xl text-center sm:mb-16"
          >
            <motion.div
              variants={collectionItem}
              className="mx-auto mb-4 inline-block rotate-[-2deg] border border-[#e2d5bf] bg-[#fff6c9] px-5 py-2 shadow-[4px_5px_0_rgba(28,37,64,0.07)]"
            >
              <span className="caveat text-[21px] font-semibold text-[#1c2540]">pick your little world ✦</span>
            </motion.div>

            <motion.p
              variants={collectionItem}
              className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b88932]"
            >
              THE SFH COLLECTIONS
            </motion.p>

            <motion.h2
              variants={collectionItem}
              className="mt-3 font-[var(--font-playfair)] text-5xl font-semibold leading-[0.9] tracking-[-0.065em] text-[#1c2540] sm:text-7xl"
            >
              Scents for every
              <span className="block text-[#8a6a2a]">version of you.</span>
            </motion.h2>

            <motion.p
              variants={collectionItem}
              className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#5b5960] sm:text-lg"
            >
              Two moods. Two little worlds. Find the fragrance chapter that feels most like you today.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={collectionContainer}
            className="relative grid gap-8 lg:grid-cols-2"
          >
            <CollectionColumn
              title="MEN'S"
              products={menProducts}
              href="/shop?filter=men"
            />

            <CollectionColumn
              title="WOMEN'S"
              products={womenProducts}
              href="/shop?filter=women"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18, rotate: -1 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-10 w-fit max-w-full border border-[#e2d5bf] bg-[#fffdf7] px-5 py-3 shadow-[4px_6px_0_rgba(28,37,64,0.06)] sm:px-7"
          >
            <p className="caveat text-center text-[21px] font-medium text-[#1c2540] sm:text-[24px]">
              one collection for the mood, another for the memory ♡
            </p>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          MEN'S CAMPAIGN
          SCRAPBOOK HEAVEN / EDITORIAL MEMORY
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#efe5d5] py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.65 }}
          whileInView={{ opacity: 0.5, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute -right-40 top-1/2 h-[30rem] w-[30rem] -translate-y-1/2 rounded-full bg-[#d9cdec]/45 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 0.45, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-[#bfe1ec]/45 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={campaignContainer}
            className="relative grid items-center gap-10 lg:grid-cols-[0.98fr_1.02fr] lg:gap-16"
          >
            {/* Scrapbook photo */}
            <motion.div
              variants={campaignItem}
              whileHover={{ y: -8, rotate: -0.5 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto w-full max-w-[620px] rotate-[-2deg]"
            >
              <div className="absolute -left-3 top-8 z-20 h-9 w-28 rotate-[-9deg] bg-[#f3c7d3]/80 shadow-sm" />
              <div className="absolute -right-4 bottom-16 z-20 h-9 w-24 rotate-[8deg] bg-[#d9cdec]/80 shadow-sm" />

              <div className="relative border border-[#dfd0b8] bg-[#fffdf7] p-3 pb-5 shadow-[8px_12px_0_rgba(28,37,64,0.08),0_28px_65px_rgba(28,37,64,0.12)] sm:p-4 sm:pb-6">
                <motion.div
                  initial={{ scale: 1.12, opacity: 0.5 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="relative aspect-[4/5] overflow-hidden bg-[#e8dfd1]"
                >
                  <Image
                    src={mensCampaignVisual?.src ?? "/logo.png"}
                    alt={
                      mensCampaignVisual?.alt ??
                      "Smells From Heaven men's fragrance campaign visual"
                    }
                    fill
                    sizes="(max-width: 1024px) 100vw, 620px"
                    className="object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.05]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#111111]/25 via-transparent to-transparent" />
                </motion.div>

                <div className="mt-3 flex items-end justify-between gap-4 px-1">
                  <span className="caveat text-[22px] font-medium text-[#1c2540]">
                    notes from his chapter ✦
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8a6a2a]">
                    SFH / 01
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Editorial content */}
            <motion.div variants={campaignContainer} className="relative">
              <motion.div
                variants={campaignItem}
                className="mb-5 inline-block -rotate-2 border border-[#d8c8aa] bg-[#fff6c9] px-4 py-2 shadow-[4px_5px_0_rgba(28,37,64,0.07)]"
              >
                <span className="caveat text-[21px] font-semibold text-[#1c2540]">
                  for the man who leaves a memory behind ✦
                </span>
              </motion.div>

              <motion.p
                variants={campaignItem}
                className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#8a6a2a]"
              >
                THE MEN&apos;S CHAPTER
              </motion.p>

              <motion.div variants={campaignHeading} className="overflow-hidden">
                <h2 className="mt-4 font-[var(--font-playfair)] text-5xl font-semibold leading-[0.88] tracking-[-0.07em] text-[#1c2540] sm:text-7xl lg:text-[5.6rem]">
                  DRESS SHARP.
                  <span className="block text-[#6d5631]">SMELL SHARPER.</span>
                </h2>
              </motion.div>

              <motion.div variants={campaignItem} className="mt-7 flex items-center gap-3">
                <span className="h-px w-16 bg-[#b88932]" />
                <span className="caveat text-[20px] text-[#6b6570]">confidence, bottled.</span>
              </motion.div>

              <motion.p
                variants={campaignItem}
                className="mt-6 max-w-xl text-base leading-7 text-[#514d50] sm:text-lg sm:leading-8"
              >
                Discover fragrances made for the moments that matter — the first handshake, the late-night plan, the room you walk into and the memory you leave behind.
              </motion.p>

              <motion.div
                variants={campaignItem}
                className="mt-7 flex flex-wrap gap-3"
              >
                <span className="rotate-[-2deg] border border-[#d7c8b0] bg-[#fffdf7] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1c2540] shadow-[3px_4px_0_rgba(28,37,64,0.05)]">
                  clean
                </span>
                <span className="rotate-[2deg] border border-[#ead5df] bg-[#fae9ef] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1c2540] shadow-[3px_4px_0_rgba(28,37,64,0.05)]">
                  magnetic
                </span>
                <span className="rotate-[-1deg] border border-[#cddfe4] bg-[#e9f4f5] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1c2540] shadow-[3px_4px_0_rgba(28,37,64,0.05)]">
                  unforgettable
                </span>
              </motion.div>

              <motion.div variants={campaignButton} className="mt-8">
                <motion.div whileHover={{ y: -5, rotate: -1 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/shop?filter=men"
                    className="group inline-flex items-center justify-center gap-3 border-2 border-[#1c2540] bg-[#1c2540] px-7 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-[5px_6px_0_rgba(28,37,64,0.14)] transition-all duration-300 hover:bg-[#27324f] hover:shadow-[8px_9px_0_rgba(28,37,64,0.16)]"
                  >
                    SHOP MEN&apos;S COLLECTION
                    <ArrowRight size={17} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </motion.div>

              <motion.p
                variants={campaignItem}
                className="mt-5 text-[21px] text-[#6b6570]"
                style={{ fontFamily: "CaveatLocal, cursive" }}
              >
                wear it like you mean it. ♡
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          WHY SFH
          SCRAPBOOK / MEMORY WALL
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#f7f0e4] py-20 sm:py-28">
        {/* Soft paper atmosphere */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 0.55, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-[#bfe1ec]/50 blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 0.5, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#d9cdec]/45 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          {/* Section intro */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={whySfhContainer}
            className="relative mx-auto mb-12 max-w-3xl text-center sm:mb-16"
          >
            <motion.div variants={whySfhItem} className="mx-auto mb-4 inline-block -rotate-2 bg-[#fff6c9] px-4 py-2 shadow-[2px_3px_0_rgba(28,37,64,0.08)]">
              <span className="caveat text-[21px] font-semibold text-[#1c2540]">why SFH? ✦</span>
            </motion.div>

            <motion.h2
              variants={whySfhItem}
              className="font-[var(--font-playfair)] text-4xl font-semibold leading-[0.95] tracking-[-0.06em] text-[#1c2540] sm:text-6xl"
            >
              Not just a fragrance.
              <span className="block">It&apos;s a memory you can wear.</span>
            </motion.h2>

            <motion.p
              variants={whySfhItem}
              className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#55515a] sm:text-lg"
            >
              We make scents for the moments you never want to forget — the first impression, the late-night plan, the person, the place, the feeling.
            </motion.p>
          </motion.div>

          {/* Scrapbook memory board */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            variants={whySfhContainer}
            className="relative mx-auto max-w-6xl"
          >
            {/* Tape pieces */}
            <motion.div
              variants={whySfhItem}
              className="pointer-events-none absolute -top-3 left-[13%] z-20 h-8 w-28 rotate-[-5deg] bg-[#f1d9a6]/75 shadow-sm"
            />
            <motion.div
              variants={whySfhItem}
              className="pointer-events-none absolute -right-2 top-[28%] z-20 h-8 w-24 rotate-[9deg] bg-[#d9cdec]/80 shadow-sm"
            />

            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              {/* Big memory card */}
              <motion.article
                variants={whySfhItem}
                whileHover={{ y: -8, rotate: -0.5 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative min-h-[390px] rotate-[-1deg] overflow-hidden border border-[#e4d8c5] bg-[#fffdf7] p-7 shadow-[6px_10px_0_rgba(28,37,64,0.06),0_22px_55px_rgba(28,37,64,0.08)] sm:p-9"
              >
                <div className="absolute right-7 top-7 rotate-[7deg] rounded-full border-2 border-[#ff5a36]/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#ff5a36]">
                  made to remember
                </div>

                <div className="flex h-full flex-col justify-between">
                  <div>
                    <span className="caveat text-2xl text-[#8a6a2a]">01 — the feeling</span>
                    <h3 className="mt-5 max-w-xl font-[var(--font-playfair)] text-4xl font-semibold leading-[0.95] tracking-[-0.055em] text-[#1c2540] sm:text-5xl">
                      Premium enough for the moment.
                      <span className="block">Personal enough to become yours.</span>
                    </h3>
                    <p className="mt-6 max-w-lg text-base leading-7 text-[#5b5960]">
                      Every SFH fragrance is built around character — clean openings, expressive hearts and a finish that stays with you long after the moment is over.
                    </p>
                  </div>

                  <motion.div
                    whileHover={{ rotate: 4, scale: 1.04 }}
                    className="mt-8 inline-flex w-fit -rotate-3 items-center gap-2 border border-[#e4d8c5] bg-[#fff6c9] px-4 py-2 shadow-[3px_4px_0_rgba(28,37,64,0.07)]"
                  >
                    <span className="text-lg">✦</span>
                    <span className="caveat text-[20px] font-semibold text-[#1c2540]">Wear the memory.</span>
                  </motion.div>
                </div>
              </motion.article>

              {/* Three smaller scrapbook notes */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                {brandPillars.map((pillar, index) => (
                  <motion.article
                    key={pillar.title}
                    variants={whySfhItem}
                    whileHover={{ y: -7, rotate: index % 2 === 0 ? 1 : -1, scale: 1.015 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative overflow-hidden border p-6 shadow-[5px_7px_0_rgba(28,37,64,0.05),0_16px_35px_rgba(28,37,64,0.06)] ${
                      index === 0
                        ? "rotate-[1deg] border-[#cddfe4] bg-[#e9f4f5]"
                        : index === 1
                          ? "rotate-[-1deg] border-[#ead5df] bg-[#fae9ef]"
                          : "rotate-[1.5deg] border-[#d8dfc9] bg-[#edf3df]"
                    }`}
                  >
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <motion.div
                        variants={whySfhIcon}
                        whileHover={{ rotate: 12, scale: 1.12 }}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white/70 text-lg shadow-sm"
                      >
                        {index === 0 ? "✦" : index === 1 ? "♡" : "☁"}
                      </motion.div>
                      <span className="caveat text-[19px] text-[#5c5860]">0{index + 2}</span>
                    </div>

                    <h3 className="text-2xl font-semibold tracking-[-0.025em] text-[#1c2540]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#55515a] sm:text-[15px]">
                      {pillar.text}
                    </p>

                    <div className="mt-5 h-px w-16 bg-[#1c2540]/20" />
                    <p className="caveat mt-3 text-[18px] text-[#6b6570]">
                      {index === 0 ? "details matter ✦" : index === 1 ? "your mood, your rules ♡" : "keep it close ☁"}
                    </p>
                  </motion.article>
                ))}
              </div>
            </div>

            {/* Bottom handwritten note */}
            <motion.div
              variants={whySfhItem}
              whileHover={{ y: -4, rotate: 1 }}
              className="mx-auto mt-8 w-fit max-w-full rotate-[-1deg] border border-[#e2d5bf] bg-[#fffdf7] px-5 py-3 shadow-[4px_6px_0_rgba(28,37,64,0.06)] sm:px-7"
            >
              <p className="caveat text-center text-[21px] font-medium text-[#1c2540] sm:text-[24px]">
                crafted in heaven — made for your everyday little moments ✍︎
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          WHY CHOOSE US
      ====================================================== */}

      <WhyChooseUsSection />

      {/* =====================================================
          FINAL CTA
          SCRAPBOOK HEAVEN MOMENT
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#1c2540] py-20 text-white sm:py-24">
        {/* Heaven glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 0.6, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d9cdec]/20 blur-3xl"
        />

        {/* Floating paper scraps */}
        <motion.div
          initial={{ opacity: 0, y: 25, rotate: -12 }}
          whileInView={{ opacity: 1, y: 0, rotate: -8 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="pointer-events-none absolute left-[7%] top-12 hidden h-28 w-24 rotate-[-8deg] border border-white/10 bg-[#fff6c9]/90 shadow-[5px_8px_0_rgba(0,0,0,0.12)] sm:block"
        >
          <span
            className="absolute left-3 top-5 text-2xl text-[#1c2540]"
            style={{ fontFamily: "CaveatLocal, cursive" }}
          >
            spray some magic ✦
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 25, rotate: 10 }}
          whileInView={{ opacity: 1, y: 0, rotate: 6 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="pointer-events-none absolute right-[7%] bottom-12 hidden h-32 w-28 border border-white/10 bg-[#f3c7d3]/90 shadow-[5px_8px_0_rgba(0,0,0,0.12)] sm:block"
        >
          <span
            className="absolute left-3 top-5 text-2xl text-[#1c2540]"
            style={{ fontFamily: "CaveatLocal, cursive" }}
          >
            see you in heaven ♡
          </span>
        </motion.div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -3 }}
            whileInView={{ opacity: 1, y: 0, rotate: -2 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.65 }}
            className="mx-auto inline-flex rotate-[-2deg] border border-[#d9ccb7]/40 bg-[#fffdf7] px-4 py-2 shadow-[4px_5px_0_rgba(0,0,0,0.15)]"
          >
            <span
              className="text-2xl text-[#1c2540] sm:text-3xl"
              style={{ fontFamily: "CaveatLocal, cursive" }}
            >
              your next memory starts here ✿
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-7 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d9bf7f]"
          >
            CRAFTED IN HEAVEN. WORN BY LEGENDS.
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-[var(--font-playfair)] text-5xl font-semibold leading-[0.9] tracking-[-0.065em] text-white sm:text-6xl lg:text-7xl"
          >
            Find the scent
            <span className="block text-[#f3c7d3]">you&apos;ll remember.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg"
          >
            One spray. One mood. One memory waiting to happen.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.34 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <motion.div
              whileHover={{ y: -5, rotate: -1 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 border-2 border-[#fffdf7] bg-[#fffdf7] px-7 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1c2540] shadow-[5px_6px_0_rgba(0,0,0,0.18)] transition-all duration-300 hover:shadow-[8px_9px_0_rgba(0,0,0,0.18)]"
              >
                SHOP THE HEAVEN
                <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ y: -5, rotate: 1 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/fragrance-finder"
                className="inline-flex items-center justify-center gap-2 border border-white/30 bg-white/5 px-7 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-all duration-300 hover:border-[#f3c7d3] hover:text-[#f3c7d3]"
              >
                FIND MY SCENT
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mx-auto mt-10 h-px max-w-xs origin-center bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />

          <motion.p
            initial={{ opacity: 0, y: 10, rotate: -2 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.58 }}
            className="mt-4 text-2xl text-white/70"
            style={{ fontFamily: "CaveatLocal, cursive" }}
          >
            made for the moments you never want to forget.
          </motion.p>
        </div>
      </section>
    </>
  );
}

/* =========================================================
   COLLECTION COLUMN
   SCRAPBOOK PAPER CARD
========================================================= */

type CollectionColumnProps = {
  title: string;
  products: Product[];
  href: string;
};

function CollectionColumn({
  title,
  products,
  href,
}: CollectionColumnProps) {
  const isMens = title.toUpperCase().includes("MEN");
  const paper = isMens ? "bg-[#e9f4f5] border-[#cddfe4]" : "bg-[#fae9ef] border-[#ead5df]";
  const accent = isMens ? "#315d69" : "#9b536c";

  return (
    <motion.div
      variants={collectionItem}
      whileHover={{ y: -8, rotate: isMens ? -0.4 : 0.4 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-visible border p-4 shadow-[7px_9px_0_rgba(28,37,64,0.07),0_24px_55px_rgba(28,37,64,0.08)] sm:p-6 ${paper} ${isMens ? "rotate-[-1deg]" : "rotate-[1deg]"}`}
    >
      <div className="pointer-events-none absolute -top-4 left-[18%] z-20 h-9 w-32 rotate-[-4deg] bg-[#f1d9a6]/80 shadow-sm" />
      <div className="pointer-events-none absolute -right-3 top-[42%] z-20 h-8 w-24 rotate-[8deg] bg-[#fffdf7]/75 shadow-sm" />

      <div className="relative border border-black/5 bg-[#fffdf7] p-4 shadow-[3px_4px_0_rgba(28,37,64,0.05)] sm:p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p
              className="caveat text-[23px] font-semibold"
              style={{ color: accent }}
            >
              0{isMens ? "1" : "2"} — your chapter
            </p>
            <motion.h3
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="mt-1 font-[var(--font-playfair)] text-4xl font-semibold tracking-[-0.055em] text-[#1c2540] sm:text-5xl"
            >
              {title}
            </motion.h3>
          </div>

          <motion.div
            whileHover={{ rotate: 10, scale: 1.08 }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white/75 text-xl shadow-sm"
          >
            {isMens ? "✦" : "♡"}
          </motion.div>
        </div>

        <p className="mb-6 max-w-md text-sm leading-6 text-[#5b5960]">
          {isMens
            ? "Clean. confident. effortless. Scents made to leave an impression."
            : "Soft. expressive. unforgettable. Scents made to become part of your story."}
        </p>

        <motion.div
          variants={collectionContainer}
          className="grid gap-4 sm:grid-cols-3"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              variants={collectionCard}
              whileHover={{ y: -10, rotate: index % 2 === 0 ? -1.5 : 1.5, scale: 1.025 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <Link
                href={`/product/${product.id}`}
                className="group block border border-[#e7ded1] bg-[#faf7f1] p-2.5 text-left shadow-[3px_4px_0_rgba(28,37,64,0.045)] transition-shadow duration-300 hover:shadow-[7px_10px_0_rgba(28,37,64,0.07),0_18px_30px_rgba(28,37,64,0.08)]"
              >
                <div className="pointer-events-none absolute -top-2 left-1/2 z-10 h-5 w-14 -translate-x-1/2 rotate-[-2deg] bg-[#d9cdec]/75" />

                <div className="relative h-48 overflow-hidden bg-[#f0eadf] sm:h-52">
                  <motion.div
                    initial={{ scale: 1.08 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={getProductPrimaryImage(product)}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 45vw, 240px"
                      className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.09]"
                    />
                  </motion.div>
                </div>

                <div className="px-1 pb-1 pt-3">
                  <p className="line-clamp-2 text-[15px] font-medium leading-5 text-[#1c2540]">
                    {product.name}
                  </p>
                  <p
                    className="caveat mt-1 text-[17px]"
                    style={{ color: accent }}
                  >
                    made for this mood ✦
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          whileHover={{ x: 5 }}
          className="mt-6 flex justify-end"
        >
          <Link
            href={href}
            className="group inline-flex items-center gap-2 border-b border-[#1c2540]/25 pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1c2540] transition-colors hover:border-[#b88932] hover:text-[#b88932]"
          >
            explore {title.toLowerCase()}
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

