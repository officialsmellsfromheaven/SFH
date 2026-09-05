"use client";

import ComboCard from "@/components/combo/ComboCard";
import { getActiveCombos } from "@/lib/combo/combo-config";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 45,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function ComboSection() {
  const combos = getActiveCombos();

  if (combos.length === 0) {
    return null;
  }

  const paperTones = [
    "bg-[#fffdf7]",
    "bg-[#fff6c9]",
    "bg-[#eaf5f5]",
    "bg-[#fbe8ee]",
  ];

  return (
    <section className="relative overflow-hidden border-y border-[#ded4c4] bg-[#f7f0e4] py-20 sm:py-24 lg:py-28">
      {/* Scrapbook heaven atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 top-20 h-72 w-72 rounded-full bg-[#bfe1ec]/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#f3c7d3]/25 blur-3xl"
      />

      {/* Decorative tape + handwritten note */}
      <motion.div
        initial={{ opacity: 0, y: -20, rotate: -8 }}
        whileInView={{ opacity: 1, y: 0, rotate: -5 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7 }}
        className="pointer-events-none absolute left-[5%] top-10 hidden w-36 rotate-[-5deg] border border-[#ddd1bf] bg-[#fffdf7] px-4 py-3 text-center shadow-[4px_6px_0_rgba(28,37,64,0.05)] lg:block"
      >
        <span
          className="text-2xl leading-none text-[#1c2540]"
          style={{ fontFamily: "CaveatLocal, cursive" }}
        >
          more scent = more memories ♡
        </span>
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[9%] top-8 hidden h-6 w-24 rotate-[5deg] bg-[#fff6c9]/80 lg:block"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 35, rotate: -1 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto mb-12 max-w-3xl text-center sm:mb-14 lg:mb-16"
        >
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#b88932]/50 sm:w-14" />

            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b88932] sm:text-[11px]">
              Build your perfect bundle
            </p>

            <span className="h-px w-10 bg-[#b88932]/50 sm:w-14" />
          </div>

          <h2
            className="text-5xl font-semibold leading-[0.88] tracking-[-0.06em] text-[#1c2540] sm:text-6xl lg:text-[4.7rem]"
            style={{ fontFamily: "CaveatLocal, cursive" }}
          >
            Custom fragrance
            <span className="block text-[#8b6726]">combos ✦</span>
          </h2>

          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.65,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto mt-5 h-px w-16 origin-center bg-[#b88932] sm:mt-6"
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto mt-5 max-w-2xl text-[14px] leading-7 text-[#5f5a61] sm:mt-6 sm:text-base"
          >
            Mix your favourite scents, choose the right bottle size, and make
            your own little heaven — with smarter savings along the way.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.12,
          }}
          className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4"
        >
          {combos.map((combo, index) => (
            <motion.div
              key={combo.id}
              variants={itemVariants}
              whileHover={{
                y: -8,
                rotate: index % 2 === 0 ? -1 : 1,
                transition: {
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              className="relative will-change-transform"
            >
              {/* Washi tape */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute left-1/2 top-[-9px] z-10 h-5 w-20 -translate-x-1/2 ${
                  index % 3 === 0
                    ? "rotate-[-3deg] bg-[#bfe1ec]/75"
                    : index % 3 === 1
                      ? "rotate-[2deg] bg-[#fff6c9]/85"
                      : "rotate-[-2deg] bg-[#f3c7d3]/75"
                }`}
              />

              <div className="relative">
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -bottom-2 left-2 right-2 h-full rotate-[1deg] border border-[#ddd1bf] ${paperTones[index % paperTones.length]} opacity-60`}
                />
                <ComboCard combo={combo} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

