"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { getSiteImage } from "@/lib/siteImages";
import LiveVisitors from "@/lib/supabase/LiveVisitors";

const textReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const headingContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.12,
    },
  },
};

const headingLine: Variants = {
  hidden: {
    opacity: 0,
    y: 38,
    clipPath: "inset(0 0 100% 0)",
  },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const buttonContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const buttonItem: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function HeroBanner() {
  const heroVisual = getSiteImage("homeHero");

  return (
    <section className="relative isolate overflow-hidden bg-[#faf8f3] text-[#111111]">
      {/* Ambient gold glow */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(184,137,50,0.18),_transparent_36%)]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 max-[639px]:gap-3 max-[639px]:py-8 sm:px-6 lg:grid-cols-[0.96fr_1.04fr] lg:gap-10 lg:py-20">
        {/* Hero content */}
        <div className="max-w-xl">
          {/* Brand Intro */}
          <motion.p
            variants={textReveal}
            initial="hidden"
            animate="visible"
            transition={{
              delay: 0.05,
            }}
            className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b88932] sm:text-[11px]"
          >
            WELCOME TO HEAVEN
          </motion.p>

          {/* Main Heading */}
          <motion.h1
            variants={headingContainer}
            initial="hidden"
            animate="visible"
            className="font-[var(--font-playfair)] text-5xl font-semibold leading-[0.9] tracking-[-0.07em] text-[#111111] sm:text-6xl lg:text-[5.3rem]"
          >
            <motion.span
              variants={headingLine}
              className="block"
            >
              WHERE EVERY
            </motion.span>

            <motion.span
              variants={headingLine}
              className="block"
            >
              SCENT FEELS
            </motion.span>

            <motion.span
              variants={headingLine}
              className="block"
            >
              LIKE HEAVEN.
            </motion.span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={textReveal}
            initial="hidden"
            animate="visible"
            transition={{
              delay: 0.62,
            }}
            className="mt-5 max-w-lg text-lg leading-7 text-[#4d4d4d] max-[639px]:mt-4 sm:text-xl"
          >
            Crafted for the moments you want to be remembered.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={buttonContainer}
            initial="hidden"
            animate="visible"
            className="mt-8 flex flex-wrap items-center gap-3.5 max-[639px]:mt-6"
          >
            <motion.div variants={buttonItem}>
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center rounded-full bg-[#111111] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#1d1d1d] hover:shadow-[0_14px_30px_rgba(17,17,17,0.14)]"
              >
                <span>EXPLORE THE COLLECTION</span>
              </Link>
            </motion.div>

            <motion.div variants={buttonItem}>
              <Link
                href="/fragrance-finder"
                className="group inline-flex items-center justify-center rounded-full border border-[#d9c8a2] bg-white/80 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111111] transition-all duration-300 hover:-translate-y-1 hover:border-[#b88932] hover:text-[#b88932] hover:shadow-[0_12px_26px_rgba(184,137,50,0.10)]"
              >
                <span>FIND YOUR SCENT</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Live Visitor Count */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.15,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5 max-[639px]:mt-4"
          >
            <LiveVisitors />
          </motion.div>

          {/* Brand Signature */}
          <motion.div
            initial={{
              opacity: 0,
              y: 14,
              letterSpacing: "0.08em",
            }}
            animate={{
              opacity: 1,
              y: 0,
              letterSpacing: "0.22em",
            }}
            transition={{
              delay: 1.3,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-9 text-[10px] font-semibold uppercase text-[#4d4d4d] max-[639px]:mt-6"
          >
            CRAFTED IN HEAVEN · WORN BY LEGENDS
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 1.08,
            x: 35,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            x: 0,
          }}
          transition={{
            duration: 1.35,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10 flex items-center justify-end pointer-events-none max-[639px]:-mt-4"
        >
          <motion.div
            animate={{
              y: [0, -7, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative h-[60vh] w-full max-w-[760px] max-[639px]:h-[min(38vh,320px)] sm:h-[74vh] sm:max-w-[920px] md:h-[86vh] md:max-w-[1080px] lg:h-[96vh] lg:max-w-[1240px] xl:h-[110vh] xl:max-w-[1400px] lg:translate-y-8 xl:-translate-y-5 lg:scale-[1.08] xl:scale-[1.12]"
          >
            <Image
              src={heroVisual?.src ?? "/logo.png"}
              alt={
                heroVisual?.alt ??
                "Smells From Heaven luxury hero portrait"
              }
              fill
              priority={heroVisual?.priority ?? true}
              sizes="(max-width: 1024px) 100vw, 680px"
              className="home-hero-image object-contain"
              aria-hidden={false}
            />
          </motion.div>

          <style jsx>{`
            .home-hero-image {
              object-position: center 45% !important;
            }

            @media (min-width: 640px) {
              .home-hero-image {
                object-position: 92% center !important;
              }
            }

            @media (min-width: 768px) {
              .home-hero-image {
                object-position: 92% center !important;
              }
            }

            @media (min-width: 1024px) {
              .home-hero-image {
                object-position: 94% center !important;
              }
            }

            @media (min-width: 1280px) {
              .home-hero-image {
                object-position: 96% center !important;
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .home-hero-image {
                transform: none !important;
              }
            }
          `}</style>
        </motion.div>
      </div>
    </section>
  );
}