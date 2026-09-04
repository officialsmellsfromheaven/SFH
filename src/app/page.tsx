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
      ====================================================== */}

      <section className="bg-[#faf8f3] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-[0.96fr_1.04fr]">
            <div className="relative overflow-hidden rounded-[2rem] border border-[#eadfc5] bg-[#f5efe3] p-3 shadow-[0_18px_42px_rgba(17,17,17,0.04)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                <Image
                  src={moodVisual?.src ?? "/logo.png"}
                  alt={
                    moodVisual?.alt ??
                    "Smells From Heaven Gen-Z lifestyle brand visual"
                  }
                  fill
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b88932]">
                WEAR YOUR MOOD.
              </p>

              <h2 className="mt-4 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.92] tracking-[-0.06em] text-[#111111] sm:text-5xl lg:text-[4rem]">
                Your fragrance.
                <span className="block">Your vibe.</span>
                <span className="block">Your rules.</span>
              </h2>

              <p className="mt-5 max-w-xl text-lg leading-8 text-[#4d4d4d]">
                Discover a fragrance mood that matches the way you move
                through the world.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {moodOptions.map((option) => (
                  <span
                    key={option}
                    className="inline-flex items-center rounded-full border border-[#e7d9b3] bg-white px-4 py-2 text-sm font-medium text-[#111111]"
                  >
                    {option}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/fragrance-finder"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1d1d1d]"
                >
                  FIND MY SCENT
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/shop?filter=bestseller"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d9c8a2] bg-transparent px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111111] transition-all duration-200 hover:border-[#b88932] hover:text-[#b88932]"
                >
                  SHOP BESTSELLERS
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FRAGRANCE FINDER
          STRONG SCROLL ANIMATION
      ====================================================== */}

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            variants={finderContainer}
            className="mb-8 text-center sm:mb-10"
          >
            <motion.p
              variants={finderItem}
              className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b88932]"
            >
              NOT SURE WHAT TO WEAR?
            </motion.p>

            <motion.h2
              variants={finderItem}
              className="mt-3 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-[#111111] sm:text-5xl"
            >
              LET YOUR VIBE
              <span className="block">
                CHOOSE YOUR FRAGRANCE.
              </span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.12,
            }}
            variants={finderContainer}
            className="grid items-center gap-8 overflow-hidden rounded-[2rem] border border-[#efe5d2] bg-[#faf7f1] p-4 sm:p-6 lg:grid-cols-[0.9fr_1.1fr] lg:p-8"
          >
            <motion.div
              variants={finderItem}
              className="group relative overflow-hidden rounded-[1.6rem] bg-[#efe7d9]"
            >
              <motion.div
                initial={{
                  scale: 1.12,
                  opacity: 0.75,
                }}
                whileInView={{
                  scale: 1,
                  opacity: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative aspect-[4/5] w-full"
              >
                <Image
                  src={finderVisual?.src ?? "/logo.png"}
                  alt={
                    finderVisual?.alt ??
                    "Smells From Heaven fragrance finder character visual"
                  }
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
              </motion.div>
            </motion.div>

            <motion.div
              variants={finderContainer}
              className="flex flex-col"
            >
              <motion.div
                variants={finderContainer}
                className="grid gap-3 sm:grid-cols-2"
              >
                {moodOptions.map((option) => (
                  <motion.div
                    key={option}
                    variants={finderMoodItem}
                    whileHover={{
                      y: -7,
                      scale: 1.025,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                  >
                    <Link
                      href="/fragrance-finder"
                      className="block rounded-[1.2rem] border border-[#e8d9b9] bg-white px-5 py-4 text-left text-lg font-medium text-[#111111] transition-all duration-300 hover:border-[#b88932] hover:shadow-[0_18px_38px_rgba(17,17,17,0.08)]"
                    >
                      {option}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                variants={finderItem}
                className="mt-7 flex flex-wrap items-center gap-4"
              >
                <motion.div
                  whileHover={{
                    y: -4,
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                >
                  <Link
                    href="/fragrance-finder"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#1d1d1d] hover:shadow-[0_16px_35px_rgba(17,17,17,0.16)]"
                  >
                    START MATCHING
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{
                    y: -4,
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                >
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#d9c8a2] bg-white px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111111] transition-all duration-300 hover:border-[#b88932] hover:text-[#b88932]"
                  >
                    SHOP ALL
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          COLLECTIONS
          STRONG SCROLL + STAGGER ANIMATION
      ====================================================== */}

      <section className="bg-[#f7f3ee] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            variants={collectionContainer}
            className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          >
            <div>
              <motion.p
                variants={collectionItem}
                className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b88932]"
              >
                COLLECTIONS
              </motion.p>

              <motion.h2
                variants={collectionItem}
                className="mt-3 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-[#111111] sm:text-5xl"
              >
                Fragrance for every mood.
              </motion.h2>
            </div>

            <motion.div
              variants={collectionItem}
              whileHover={{
                x: 7,
              }}
            >
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111111] transition-colors hover:text-[#b88932]"
              >
                Explore all
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.1,
            }}
            variants={collectionContainer}
            className="grid gap-5 lg:grid-cols-2"
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
        </div>
      </section>

      {/* =====================================================
          MEN'S CAMPAIGN
          CINEMATIC ANIMATION
      ====================================================== */}

      <section className="relative overflow-hidden bg-[#efe5d5] py-20 sm:py-24">
        {/* Ambient background glow */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.7,
          }}
          whileInView={{
            opacity: 0.45,
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 1.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="pointer-events-none absolute -right-32 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-[#d9bf7f]/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            variants={campaignContainer}
            className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16"
          >
            {/* Campaign Image */}
            <motion.div
              variants={campaignItem}
              className="group relative overflow-hidden rounded-[2rem] border border-[#e6d8ba] bg-[#f6f0e7] p-3 shadow-[0_20px_50px_rgba(17,17,17,0.07)]"
            >
              <motion.div
                initial={{
                  scale: 1.16,
                  opacity: 0.65,
                }}
                whileInView={{
                  scale: 1,
                  opacity: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 1.35,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]"
              >
                <Image
                  src={mensCampaignVisual?.src ?? "/logo.png"}
                  alt={
                    mensCampaignVisual?.alt ??
                    "Smells From Heaven men's fragrance campaign visual"
                  }
                  fill
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
                />

                {/* Image overlay */}
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  whileInView={{
                    opacity: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.35,
                  }}
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
                />
              </motion.div>
            </motion.div>

            {/* Campaign Content */}
            <motion.div
              variants={campaignContainer}
              className="relative"
            >
              <motion.p
                variants={campaignItem}
                className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8a6a2a]"
              >
                MEN&apos;S CAMPAIGN
              </motion.p>

              <motion.div
                variants={campaignHeading}
                className="overflow-hidden"
              >
                <h2 className="mt-4 font-[var(--font-playfair)] text-5xl font-semibold leading-[0.9] tracking-[-0.065em] text-[#111111] sm:text-6xl lg:text-[5.3rem]">
                  DRESS SHARP.
                  <span className="mt-1 block">SMELL SHARPER.</span>
                </h2>
              </motion.div>

              <motion.div
                variants={campaignItem}
                className="mt-6 h-px w-20 bg-[#b88932]"
              />

              <motion.p
                variants={campaignItem}
                className="mt-6 max-w-lg text-lg leading-8 text-[#4d4d4d]"
              >
                Discover fragrances made for moments that matter.
              </motion.p>

              <motion.div
                variants={campaignButton}
                className="mt-8"
              >
                <motion.div
                  whileHover={{
                    y: -5,
                    scale: 1.025,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                >
                  <Link
                    href="/shop?filter=men"
                    className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#111111] px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_12px_28px_rgba(17,17,17,0.12)] transition-all duration-300 hover:bg-[#1d1d1d] hover:shadow-[0_20px_40px_rgba(17,17,17,0.18)]"
                  >
                    SHOP MEN&apos;S COLLECTION

                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          WHY SFH
      ====================================================== */}

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b88932]">
              WHY SFH
            </p>

            <h2 className="mt-3 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-[#111111] sm:text-5xl">
              Premium scent, personal energy.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {brandPillars.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-[1.6rem] border border-[#efe5d5] bg-[#faf8f3] p-6 shadow-[0_12px_28px_rgba(17,17,17,0.02)]"
              >
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#ead8a8] bg-[#f3e7ca]"
                  aria-hidden="true"
                >
                  <div className="h-3 w-3 rounded-full bg-[#b88932]" />
                </div>

                <h3 className="text-2xl font-semibold text-[#111111]">
                  {pillar.title}
                </h3>

                <p className="mt-3 text-base leading-7 text-[#4d4d4d]">
                  {pillar.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY CHOOSE US
      ====================================================== */}

      <WhyChooseUsSection />

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="bg-[#111111] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d9bf7f]">
            CRAFTED IN HEAVEN. WORN BY LEGENDS.
          </p>

          <h2 className="mt-4 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-5xl">
            Your next signature scent is waiting.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#faf8f3] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111111] transition-all duration-200 hover:-translate-y-0.5"
            >
              SHOP NOW
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/fragrance-finder"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-transparent px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:border-[#d9bf7f] hover:text-[#d9bf7f]"
            >
              FIND MY SCENT
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* =========================================================
   COLLECTION COLUMN
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
  return (
    <motion.div
      variants={collectionItem}
      whileHover={{
        y: -7,
        transition: {
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      className="rounded-[1.8rem] border border-[#eae0d1] bg-white p-5 shadow-[0_18px_40px_rgba(17,17,17,0.03)] transition-shadow duration-500 hover:shadow-[0_30px_65px_rgba(17,17,17,0.09)] sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <motion.h3
          initial={{
            opacity: 0,
            x: -15,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-3xl font-semibold text-[#111111]"
        >
          {title}
        </motion.h3>

        <motion.div
          whileHover={{
            x: 5,
          }}
        >
          <Link
            href={href}
            className="text-sm font-semibold uppercase tracking-[0.12em] text-[#111111] transition-colors hover:text-[#b88932]"
          >
            VIEW ALL
          </Link>
        </motion.div>
      </div>

      <motion.div
        variants={collectionContainer}
        className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3"
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            variants={collectionCard}
            whileHover={{
              y: -9,
              scale: 1.025,
            }}
            whileTap={{
              scale: 0.98,
            }}
          >
            <Link
              href={`/product/${product.id}`}
              className="luxury-card group block rounded-[1.4rem] border border-[#efe5d5] bg-[#faf7f1] p-3 text-left transition-all duration-300 hover:border-[#d8bf8b] hover:shadow-[0_20px_40px_rgba(17,17,17,0.08)]"
            >
              <div className="relative h-52 overflow-hidden rounded-[1rem] bg-[#f0eadf]">
                <motion.div
                  initial={{
                    scale: 1.12,
                  }}
                  whileInView={{
                    scale: 1,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.9,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src={getProductPrimaryImage(product)}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 240px"
                    className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.1]"
                  />
                </motion.div>
              </div>

              <motion.div
                className="mt-4"
                whileHover={{
                  x: 4,
                }}
              >
                <p className="text-lg font-medium text-[#111111]">
                  {product.name}
                </p>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}