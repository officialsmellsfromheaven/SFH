"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Caveat } from "next/font/google";
import { getSiteImage } from "@/lib/siteImages";
import LiveVisitors from "@/lib/supabase/LiveVisitors";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

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
    <section className="relative isolate min-h-[720px] overflow-hidden bg-[#f7f0e4] text-[#1c2540] sm:min-h-[760px] lg:min-h-[820px]">
      {/* =========================================================
          BACKGROUND — HEAVEN PAPER
      ========================================================== */}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_72%_12%,rgba(191,225,236,0.72),transparent_28%),radial-gradient(circle_at_15%_78%,rgba(243,199,211,0.42),transparent_25%),radial-gradient(circle_at_92%_82%,rgba(217,205,236,0.38),transparent_28%)]"
      />

      {/* Paper grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.13'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Ambient gold glow */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_55%_42%,rgba(255,246,201,0.75),transparent_34%)]"
      />

      {/* =========================================================
          CLOUDS
      ========================================================== */}

      <motion.div
        aria-hidden="true"
        animate={{
          x: [0, 14, 0],
          y: [0, -8, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -left-16 top-16 hidden h-20 w-64 rounded-full bg-white/55 blur-[1px] sm:block"
      >
        <span className="absolute -top-8 left-12 h-20 w-20 rounded-full bg-white/55" />
        <span className="absolute -top-11 left-28 h-28 w-28 rounded-full bg-white/55" />
        <span className="absolute -top-5 left-48 h-16 w-16 rounded-full bg-white/55" />
      </motion.div>

      <motion.div
        aria-hidden="true"
        animate={{
          x: [0, -16, 0],
          y: [0, 10, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -right-20 top-[32%] hidden h-16 w-52 rounded-full bg-white/45 lg:block"
      >
        <span className="absolute -top-7 left-8 h-16 w-16 rounded-full bg-white/45" />
        <span className="absolute -top-10 left-24 h-24 w-24 rounded-full bg-white/45" />
        <span className="absolute -top-5 left-44 h-14 w-14 rounded-full bg-white/45" />
      </motion.div>

      {/* =========================================================
          SCRAPBOOK DECORATIONS
      ========================================================== */}

      <motion.div
        initial={{ opacity: 0, rotate: -4, y: -10 }}
        animate={{ opacity: 1, rotate: -4, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="absolute left-5 top-6 z-20 hidden rotate-[-4deg] border border-[#1c2540]/15 bg-[#fff6c9] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] shadow-[3px_4px_0_rgba(28,37,64,0.08)] sm:block"
      >
        A LITTLE PIECE OF HEAVEN
      </motion.div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, rotate: -12, scale: 0.8 }}
        animate={{ opacity: 1, rotate: -7, scale: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="pointer-events-none absolute -left-10 bottom-20 hidden h-44 w-64 bg-[#f3c7d3]/70 shadow-[8px_12px_0_rgba(28,37,64,0.05)] sm:block"
      />

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, rotate: 7, scale: 0.85 }}
        animate={{ opacity: 1, rotate: 5, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="pointer-events-none absolute -right-12 bottom-16 hidden h-52 w-72 bg-[#d9cdec]/55 shadow-[8px_12px_0_rgba(28,37,64,0.05)] lg:block"
      />

      {/* =========================================================
          MAIN LAYOUT
      ========================================================== */}

      <div className="relative mx-auto grid max-w-[1380px] items-center gap-6 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-4 lg:px-10 lg:py-16">
        {/* =====================================================
            LEFT — EDITORIAL COPY
        ====================================================== */}

        <div className="relative z-30 max-w-xl">
          {/* Welcome sticker */}
          <motion.div
            initial={{ opacity: 0, rotate: -3, y: 12 }}
            animate={{ opacity: 1, rotate: -3, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="mb-5 inline-flex items-center gap-2 bg-[#1c2540] px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] text-white shadow-[4px_4px_0_rgba(28,37,64,0.12)] sm:mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff5a36]" />
            WELCOME TO HEAVEN
          </motion.div>

          {/* =================================================
              MAIN HANDWRITTEN HEADING
          ================================================== */}

          <motion.h1
            variants={headingContainer}
            initial="hidden"
            animate="visible"
            className={`${caveat.className} -rotate-[1.2deg] text-[3.8rem] font-bold leading-[0.78] tracking-[-0.035em] text-[#1c2540] sm:text-[5.1rem] lg:text-[6rem] xl:text-[6.7rem]`}
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
              className="relative block"
            >
              LIKE HEAVEN.

              <span
                aria-hidden="true"
                className="absolute -right-2 bottom-[-10px] h-3 w-20 rotate-[-2deg] rounded-full bg-[#ff5a36]/75 sm:right-4 sm:w-28"
              />
            </motion.span>
          </motion.h1>

          {/* Memory note */}
          <motion.div
            initial={{ opacity: 0, rotate: 4, x: -10 }}
            animate={{ opacity: 1, rotate: 3, x: 0 }}
            transition={{ delay: 0.65, duration: 0.7 }}
            className={`mt-5 ml-1 inline-block bg-[#fff6c9] px-4 py-2 ${caveat.className} text-[19px] font-medium text-[#1c2540] shadow-[4px_5px_0_rgba(28,37,64,0.07)] sm:ml-8`}
          >
            smells like a memory ✦
          </motion.div>

          {/* Description */}
          <motion.p
            variants={textReveal}
            initial="hidden"
            animate="visible"
            transition={{
              delay: 0.72,
            }}
            className="mt-6 max-w-md text-[15px] leading-6 text-[#46506a] sm:mt-7 sm:text-lg sm:leading-7"
          >
            Crafted for the moments you want to be remembered.
          </motion.p>

          {/* =================================================
              CTA BUTTONS
          ================================================== */}

          <motion.div
            variants={buttonContainer}
            initial="hidden"
            animate="visible"
            className="mt-7 flex flex-wrap items-center gap-3 max-[639px]:mt-6"
          >
            <motion.div variants={buttonItem}>
              <Link
                href="/shop"
                className="group relative inline-flex items-center justify-center overflow-hidden bg-[#1c2540] px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white shadow-[5px_5px_0_#ff5a36] transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_#ff5a36] sm:px-6 sm:py-4"
              >
                <span className="relative z-10">
                  EXPLORE THE COLLECTION
                </span>

                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </motion.div>

            <motion.div variants={buttonItem}>
              <Link
                href="/fragrance-finder"
                className="group inline-flex rotate-[1deg] items-center justify-center border-2 border-[#1c2540]/20 bg-[#fffdf7] px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1c2540] shadow-[4px_4px_0_rgba(28,37,64,0.08)] transition-all duration-300 hover:-translate-y-1 hover:rotate-[-1deg] hover:border-[#1c2540]/40 sm:px-6 sm:py-4"
              >
                <span>FIND YOUR SCENT</span>

                <span className="ml-2 text-[15px] transition-transform duration-300 group-hover:scale-125">
                  ♡
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Live Visitors */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.15,
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5"
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
            className="mt-8 text-[9px] font-semibold uppercase text-[#46506a]"
          >
            CRAFTED IN HEAVEN · WORN BY LEGENDS
          </motion.div>
        </div>

        {/* =====================================================
            RIGHT — HERO COLLAGE
        ====================================================== */}

        <div className="relative z-20 flex min-h-[430px] items-center justify-center sm:min-h-[600px] lg:min-h-[700px]">
          {/* =================================================
              CURRENTLY OBSESSED CARD
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: -20,
              rotate: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotate: 6,
            }}
            transition={{
              delay: 0.65,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute right-0 top-4 z-30 hidden w-40 rotate-[6deg] bg-[#fffdf7] p-3 pb-4 shadow-[8px_10px_0_rgba(28,37,64,0.09)] sm:block lg:right-4 lg:top-2"
          >
            <div className="absolute -top-3 left-1/2 h-7 w-16 -translate-x-1/2 rotate-[-4deg] bg-[#e6d8b9]/80" />

            <div className="flex aspect-square items-center justify-center bg-[#bfe1ec] text-5xl">
              ☁️
            </div>

            <p
              className={`${caveat.className} mt-3 text-[21px] font-medium leading-5 text-[#1c2540]`}
            >
              currently
              <br />
              obsessed.
            </p>

            <p className="mt-2 text-[7px] font-semibold uppercase tracking-[0.2em] text-[#7b8294]">
              HEAVEN ARCHIVE / 01
            </p>
          </motion.div>

          {/* =================================================
              SPRAY GLOW REPEAT NOTE
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: -20,
              rotate: -8,
            }}
            animate={{
              opacity: 1,
              x: 0,
              rotate: -6,
            }}
            transition={{
              delay: 0.85,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute left-[-4px] top-[28%] z-30 hidden w-36 bg-[#fbe6ec] px-4 py-5 shadow-[6px_7px_0_rgba(28,37,64,0.07)] sm:block lg:left-[-22px]"
          >
            <div className="absolute -top-2 left-7 h-5 w-14 rotate-[-8deg] bg-[#d9c8a2]/70" />

            <p
              className={`${caveat.className} text-[22px] font-medium leading-5 text-[#1c2540]`}
            >
              spray.
              <br />
              glow.
              <br />
              repeat. ✦
            </p>

            <div className="mt-4 h-px w-full bg-[#1c2540]/10" />

            <p className="mt-2 text-[7px] font-semibold uppercase tracking-[0.16em] text-[#7b8294]">
              SFH NOTE
            </p>
          </motion.div>

          {/* =================================================
              MAIN HERO IMAGE
          ================================================== */}

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
            className="relative z-10 flex w-full items-center justify-center pointer-events-none max-[639px]:-mt-2"
          >
            {/* Soft paper shadow */}
            <motion.div
              aria-hidden="true"
              animate={{
                rotate: [-2, 1, -2],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute h-[82%] w-[66%] rotate-[-2deg] bg-[#fffdf7]/65 shadow-[0_20px_50px_rgba(28,37,64,0.08)] sm:h-[78%] sm:w-[65%] lg:h-[82%] lg:w-[64%]"
            />

            {/* Main image */}
            <motion.div
              animate={{
                y: [0, -7, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative h-[430px] w-full max-w-[650px] max-[639px]:h-[430px] sm:h-[650px] md:h-[760px] lg:h-[820px] xl:h-[900px]"
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
          </motion.div>

          {/* =================================================
              MADE IN HEAVEN STICKER
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.6,
              rotate: -20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: -13,
            }}
            transition={{
              delay: 1,
              duration: 0.7,
              type: "spring",
              stiffness: 140,
              damping: 12,
            }}
            className="absolute bottom-[12%] left-[8%] z-30 hidden h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-[#1c2540]/35 bg-[#fff6c9] text-center shadow-[5px_6px_0_rgba(28,37,64,0.08)] sm:flex lg:left-[5%]"
          >
            <span
              className={`${caveat.className} text-[15px] font-bold leading-3 text-[#1c2540]`}
            >
              MADE
              <br />
              IN
              <br />
              HEAVEN
              <br />
              ☁
            </span>
          </motion.div>

          {/* =================================================
              SIGNATURE SCENT LABEL
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
              rotate: 4,
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotate: 3,
            }}
            transition={{
              delay: 1.05,
              duration: 0.75,
            }}
            className="absolute bottom-[9%] right-[5%] z-30 hidden w-40 bg-[#cfe6cf] px-4 py-3 shadow-[5px_6px_0_rgba(28,37,64,0.07)] sm:block lg:right-[8%]"
          >
            <p
              className={`${caveat.className} text-[22px] font-medium leading-5 text-[#1c2540]`}
            >
              your signature
              <br />
              scent awaits...
            </p>

            <p className="mt-2 text-[7px] font-semibold uppercase tracking-[0.18em] text-[#596d5b]">
              FIND YOUR MOOD
            </p>
          </motion.div>

          {/* Sparkles */}
          <motion.div
            aria-hidden="true"
            animate={{
              rotate: [0, 20, 0],
              scale: [1, 1.12, 1],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-[27%] top-[18%] z-30 text-2xl text-[#ff5a36]"
          >
            ✦
          </motion.div>

          <motion.div
            aria-hidden="true"
            animate={{
              rotate: [0, -15, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-[29%] right-[17%] z-30 text-lg text-[#1c2540]/60"
          >
            ✧
          </motion.div>
        </div>
      </div>

      {/* =========================================================
          BOTTOM SCRAPBOOK LABEL
      ========================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
          rotate: -2,
        }}
        animate={{
          opacity: 1,
          y: 0,
          rotate: -2,
        }}
        transition={{
          delay: 1.25,
          duration: 0.8,
        }}
        className="absolute bottom-4 left-1/2 z-40 hidden -translate-x-1/2 rotate-[-2deg] bg-white/75 px-5 py-2 text-[8px] font-semibold uppercase tracking-[0.22em] text-[#46506a] shadow-[3px_4px_0_rgba(28,37,64,0.05)] sm:block"
      >
        EVERY SCENT HAS A STORY · WHAT'S YOURS?
      </motion.div>

      {/* =========================================================
          RESPONSIVE IMAGE POSITIONING
      ========================================================== */}

      <style jsx>{`
        .home-hero-image {
          object-position: center 45% !important;
        }

        @media (min-width: 640px) {
          .home-hero-image {
            object-position: 88% center !important;
          }
        }

        @media (min-width: 768px) {
          .home-hero-image {
            object-position: 90% center !important;
          }
        }

        @media (min-width: 1024px) {
          .home-hero-image {
            object-position: 93% center !important;
          }
        }

        @media (min-width: 1280px) {
          .home-hero-image {
            object-position: 95% center !important;
          }
        }

        @media (max-width: 639px) {
          .home-hero-image {
            object-position: center 44% !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-hero-image {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}