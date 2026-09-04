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

  return (
    <section className="relative overflow-hidden bg-[#f7f3ee] py-20 sm:py-24 lg:py-28">
      {/* Ambient heaven glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[min(900px,100vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(184,137,50,0.09),transparent_68%)] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto mb-12 max-w-3xl text-center sm:mb-14 lg:mb-16"
        >
          <div className="mb-5 flex items-center justify-center gap-3">
            <motion.span
              aria-hidden="true"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "3rem", opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-px bg-[#b88932]/60"
            />

            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b88932] sm:text-[11px]">
              Build your perfect bundle
            </p>

            <motion.span
              aria-hidden="true"
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: "3rem", opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-px bg-[#b88932]/60"
            />
          </div>

          <h2 className="font-[var(--font-playfair)] text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#111111] sm:text-5xl lg:text-[3.5rem]">
            Custom fragrance combos
          </h2>

          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.65,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto mt-6 h-px w-14 origin-center bg-[#b88932] sm:mt-7 sm:w-16"
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto mt-5 max-w-2xl text-[14px] leading-7 text-[#4d4d4d] sm:mt-6 sm:text-base"
          >
            Mix your favourite scents, choose the right bottle size, and
            unlock a smarter, more rewarding price per fragrance.
          </motion.p>
        </motion.div>

        {/* Combo cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.12,
          }}
          className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4"
        >
          {combos.map((combo) => (
            <motion.div
              key={combo.id}
              variants={itemVariants}
              whileHover={{
                y: -6,
                transition: {
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              className="will-change-transform"
            >
              <ComboCard combo={combo} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}