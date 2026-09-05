"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Leaf, ShieldCheck, Sparkles, Users } from "lucide-react";
import { getSiteImage } from "@/lib/siteImages";
import { motion } from "framer-motion";

const aboutStoryVisual = getSiteImage("aboutStory");
const founderVisual = getSiteImage("founder");

const values = [
  {
    icon: Heart,
    title: "Crafted with intention",
    text: "Every scent is shaped to feel personal, premium, and memorable from the first spray onward.",
  },
  {
    icon: Leaf,
    title: "Thoughtful ingredients",
    text: "We focus on fragrance composition and balance, building aromas that feel rich and refined.",
  },
  {
    icon: ShieldCheck,
    title: "Made to last",
    text: "The final experience is designed to linger with warmth, character, and a refined finish.",
  },
  {
    icon: Users,
    title: "Customer first",
    text: "We care about how a fragrance feels in everyday life, from daily rituals to special moments.",
  },
];

const craftSteps = [
  {
    step: "01",
    title: "Fragrance selection",
    text: "We begin with clear sensory direction and carefully chosen notes that define the mood.",
  },
  {
    step: "02",
    title: "Blending",
    text: "The formula is balanced to build complexity, layering, and a smooth signature experience.",
  },
  {
    step: "03",
    title: "Refinement",
    text: "Every scent is dialled in for clarity, richness, and a long-lasting impression.",
  },
  {
    step: "04",
    title: "Final check",
    text: "We review the final character to make sure it feels polished, memorable, and wearable.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden bg-[#f7f0e4] text-[#1c2540]">
      {/* soft scrapbook atmosphere */}
      <div className="pointer-events-none absolute -left-28 top-28 h-80 w-80 rounded-full bg-[#bfe1ec]/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-[48rem] h-96 w-96 rounded-full bg-[#f3c7d3]/35 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-[105rem] h-80 w-80 rounded-full bg-[#d9cdec]/30 blur-3xl" />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#d8cdbd] py-12 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.88fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative"
          >
            <div className="absolute -left-2 top-0 h-9 w-32 rotate-[-4deg] bg-[#f3c7d3]/80 shadow-sm" />
            <div className="absolute right-6 top-10 h-8 w-24 rotate-[5deg] bg-[#bfe1ec]/75 shadow-sm" />

            <div className="relative border border-[#d8cdbd] bg-[#fffdf7] p-6 shadow-[0_18px_50px_rgba(72,56,35,0.10)] sm:p-9 lg:p-11">
              <p
                className="caveat text-2xl font-semibold text-[#7d6a4e] sm:text-3xl"
                style={{ fontFamily: '"CaveatLocal", cursive' }}
              >
                a little story from heaven ✦
              </p>

              <p className="mt-4 inline-flex -rotate-[1deg] border border-[#e7d9b3] bg-[#fff6c9] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7b6833] shadow-[3px_4px_0_rgba(28,37,64,0.05)]">
                ABOUT SMELLS FROM HEAVEN
              </p>

              <h1 className="mt-6 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.92] tracking-[-0.06em] text-[#1c2540] sm:text-5xl lg:text-[4.7rem]">
                BORN FROM A
                <span className="block text-[#b88932]">PASSION FOR SCENT.</span>
              </h1>

              <div className="mt-6 h-px w-20 bg-[#b88932]" />

              <p className="mt-6 max-w-xl text-base leading-8 text-[#5e6675] sm:text-lg">
                Smells From Heaven was founded in 2024 by Rushikesh Joshi with a vision to make fragrance
                feel premium, personal, memorable and accessible.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 border-2 border-[#1c2540] bg-[#1c2540] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[4px_5px_0_rgba(28,37,64,0.12)] transition-all hover:-translate-y-1 hover:bg-[#27324f]"
                >
                  SHOP NOW
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/fragrance-finder"
                  className="inline-flex items-center gap-2 border border-[#cbbd9e] bg-[#fffdf7] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#1c2540] shadow-[3px_4px_0_rgba(28,37,64,0.05)] transition-all hover:-translate-y-1 hover:border-[#b88932]"
                >
                  FIND MY SCENT ♡
                </Link>
              </div>

              <p
                className="mt-7 text-xl text-[#7a8799]"
                style={{ fontFamily: '"CaveatLocal", cursive' }}
              >
                fragrance is how a moment stays with you.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -right-2 top-4 z-20 h-9 w-28 rotate-[6deg] bg-[#fff0a8]/85 shadow-sm" />
            <div className="absolute -left-2 bottom-16 z-20 h-8 w-24 rotate-[-5deg] bg-[#cfe6cf]/75 shadow-sm" />

            <div className="relative rotate-[1deg] border border-[#d8cdbd] bg-[#fffdf7] p-3 shadow-[8px_10px_0_rgba(28,37,64,0.06),0_24px_60px_rgba(72,56,35,0.10)]">
              <div className="relative aspect-[4/5] overflow-hidden border border-[#ded4c5] bg-[#efe7d9]">
                <Image
                  src={aboutStoryVisual?.src ?? "/logo.png"}
                  alt={aboutStoryVisual?.alt ?? "Founder story visual for Smells From Heaven"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>

              <div className="absolute bottom-7 left-6 rotate-[-4deg] border border-[#d8cdbd] bg-[#fff6c9] px-4 py-2 shadow-[4px_5px_0_rgba(28,37,64,0.07)]">
                <p className="text-lg text-[#6d6339]" style={{ fontFamily: '"CaveatLocal", cursive' }}>
                  made with feeling ♡
                </p>
              </div>

              <div className="absolute -right-3 bottom-8 rotate-[5deg] border border-[#d8cdbd] bg-[#e9f4f5] px-3 py-2 shadow-[4px_5px_0_rgba(28,37,64,0.06)]">
                <p className="text-base text-[#456875]" style={{ fontFamily: '"CaveatLocal", cursive' }}>
                  since 2024 ✦
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STORY */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="relative order-2 lg:order-1"
          >
            <div className="absolute -left-3 top-8 h-8 w-28 rotate-[-7deg] bg-[#d9cdec]/75 shadow-sm" />

            <div className="relative rotate-[-1deg] border border-[#d8cdbd] bg-[#fffdf7] p-3 shadow-[7px_8px_0_rgba(28,37,64,0.05)]">
              <div className="story-visual-frame relative aspect-[4/5] overflow-hidden border border-[#ded4c5] bg-[#f5efe4]">
                <Image
                  src="/images/artsfh2.png"
                  alt="Smells From Heaven brand story collage"
                  fill
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className="story-visual-image object-contain transition-transform duration-700 hover:scale-[1.02]"
                />
              </div>
              <p className="absolute -bottom-5 right-5 rotate-[3deg] bg-[#f3c7d3] px-4 py-2 text-lg text-[#765966] shadow-[4px_5px_0_rgba(28,37,64,0.05)]" style={{ fontFamily: '"CaveatLocal", cursive' }}>
                every bottle carries a feeling ✦
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="order-1 lg:order-2"
          >
            <p className="inline-block -rotate-[2deg] border border-[#d8dfc9] bg-[#edf7ed] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#55705a] shadow-[3px_4px_0_rgba(28,37,64,0.04)]">
              OUR STORY
            </p>

            <h2 className="mt-5 font-[var(--font-playfair)] text-3xl font-semibold leading-[0.94] tracking-[-0.06em] text-[#1c2540] sm:text-5xl">
              A story shaped by fragrance, confidence, and connection.
            </h2>

            <div className="mt-6 space-y-5 text-base leading-8 text-[#5e6675] sm:text-lg">
              <p>
                Smells From Heaven was built around the belief that fragrance should feel premium, personal,
                and memorable without ever feeling out of reach.
              </p>
              <p>
                The brand brings together modern expression with a refined fragrance aesthetic, creating scents
                that feel made for everyday rituals and standout moments alike.
              </p>
              <p>
                Every bottle is designed to leave a lasting impression that feels personal to the wearer.
              </p>
            </div>

            <div className="mt-7 inline-block rotate-[2deg] border border-[#d9cdec] bg-[#f0ebf8] px-4 py-3 shadow-[4px_5px_0_rgba(28,37,64,0.05)]">
              <p className="text-xl text-[#665878]" style={{ fontFamily: '"CaveatLocal", cursive' }}>
                scent becomes memory. memory becomes you. ♡
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* VALUES */}
      <section className="relative border-y border-[#d8cdbd] bg-[#efe7d9] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-9 text-center">
            <p className="text-xl text-[#7d6a4e]" style={{ fontFamily: '"CaveatLocal", cursive' }}>
              the little things we believe in ✦
            </p>
            <h2 className="mt-1 font-[var(--font-playfair)] text-4xl font-semibold tracking-[-0.06em] text-[#1c2540] sm:text-5xl">
              What matters to us.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {values.map(({ icon: Icon, title, text: valueText }, index) => {
              const cardStyles = [
                "rotate-[-1deg] border-[#cddfe4] bg-[#eef8fa]",
                "rotate-[1.5deg] border-[#ead5df] bg-[#fae9ef]",
                "rotate-[-1.5deg] border-[#d9cdec] bg-[#f0ebf8]",
                "rotate-[1deg] border-[#d8dfc9] bg-[#edf7ed]",
              ];

              return (
                <motion.article
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  whileHover={{ y: -7, rotate: 0 }}
                  className={`border p-6 shadow-[5px_6px_0_rgba(28,37,64,0.05)] ${cardStyles[index]}`}
                >
                  <div className="mb-5 flex h-12 w-12 rotate-[-3deg] items-center justify-center border border-[#d8cdbd] bg-[#fffdf7] text-[#8a6a2a] shadow-sm">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#1c2540]">{title}</h3>
                  <p className="mt-3 text-base leading-7 text-[#5e6675]">{valueText}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CRAFT */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative mx-auto mb-10 max-w-3xl text-center">
            <div className="absolute -left-3 top-2 h-7 w-24 rotate-[-5deg] bg-[#fff0a8]/75 shadow-sm" />
            <p className="relative text-[10px] font-bold uppercase tracking-[0.22em] text-[#b88932]">
              THE CRAFT BEHIND EVERY BOTTLE
            </p>
            <h2 className="mt-3 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-[#1c2540] sm:text-5xl">
              Thoughtful detail. Memorable finish.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#687184]">
              From the first idea to the final bottle, every step is about creating a scent that feels considered.
            </p>
          </div>

          <div className="relative grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {craftSteps.map((step, index) => (
              <motion.article
                key={step.step}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                whileHover={{ y: -6, rotate: 0 }}
                className={`relative border border-[#d8cdbd] bg-[#fffdf7] p-6 shadow-[5px_6px_0_rgba(28,37,64,0.05)] ${
                  index % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"
                }`}
              >
                <div className="absolute -top-3 right-5 h-7 w-20 rotate-[4deg] bg-[#bfe1ec]/70 shadow-sm" />
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#b88932]">{step.step}</p>
                <h3 className="mt-4 font-[var(--font-playfair)] text-2xl font-semibold text-[#1c2540]">{step.title}</h3>
                <p className="mt-3 text-base leading-7 text-[#5e6675]">{step.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="relative border-y border-[#d8cdbd] bg-[#e8edf1] py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, x: -20, rotate: -2 }}
            whileInView={{ opacity: 1, x: 0, rotate: -1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="absolute -left-2 top-5 z-20 h-8 w-24 rotate-[-5deg] bg-[#f3c7d3]/80 shadow-sm" />
            <div className="absolute -right-2 bottom-10 z-20 h-8 w-28 rotate-[4deg] bg-[#fff0a8]/75 shadow-sm" />

            <div className="border border-[#c7cbd0] bg-[#fffdf7] p-3 shadow-[8px_9px_0_rgba(28,37,64,0.07)]">
              <div className="relative aspect-[4/5] overflow-hidden border border-[#ded4c5] bg-[#efe7d9]">
                <Image
                  src={founderVisual?.src ?? "/logo.png"}
                  alt={founderVisual?.alt ?? "Rushikesh Joshi founder portrait"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
            </div>

            <div className="absolute -bottom-5 left-5 rotate-[-3deg] border border-[#d8cdbd] bg-[#cfe6cf] px-4 py-2 shadow-[4px_5px_0_rgba(28,37,64,0.06)]">
              <p className="text-xl text-[#55705a]" style={{ fontFamily: '"CaveatLocal", cursive' }}>
                the person behind the story ✦
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="relative"
          >
            <div className="relative border border-[#d8cdbd] bg-[#fffdf7] p-7 shadow-[7px_8px_0_rgba(28,37,64,0.06)] sm:p-9">
              <p className="text-xl text-[#8b6f45]" style={{ fontFamily: '"CaveatLocal", cursive' }}>
                a note from the founder ♡
              </p>

              <p className="mt-4 inline-block rotate-[1deg] border border-[#ead5df] bg-[#fae9ef] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a5361]">
                THE FOUNDER
              </p>

              <h2 className="mt-5 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-[#1c2540] sm:text-5xl">
                Rushikesh Joshi
              </h2>

              <p className="mt-3 text-lg text-[#6b7280]">Founder, Smells From Heaven</p>
              <div className="mt-6 h-px w-20 bg-[#b88932]" />

              <p className="mt-6 max-w-xl text-base leading-8 text-[#5e6675] sm:text-lg">
                Founded in 2024, Smells From Heaven is driven by a vision to make fragrance feel premium,
                personal, memorable and accessible.
              </p>

              <div className="mt-8 inline-flex rotate-[-1deg] items-center gap-3 border border-[#e7d9b3] bg-[#fff6c9] px-4 py-3 shadow-[4px_5px_0_rgba(28,37,64,0.05)]">
                <Sparkles size={16} className="text-[#b88932]" />
                <span className="text-sm font-semibold text-[#6f6339]">Founded in 2024</span>
              </div>

              <p className="mt-7 text-2xl text-[#7d6a4e]" style={{ fontFamily: '"CaveatLocal", cursive' }}>
                build something people remember. ✦
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROMISE */}
      <section className="relative py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="relative border border-[#d8cdbd] bg-[#fffdf7] px-6 py-10 shadow-[0_16px_40px_rgba(72,56,35,0.08)] sm:px-10">
            <div className="absolute -left-2 top-5 h-8 w-24 rotate-[-4deg] bg-[#d9cdec]/70 shadow-sm" />
            <div className="absolute -right-2 bottom-5 h-8 w-24 rotate-[4deg] bg-[#bfe1ec]/70 shadow-sm" />

            <p className="text-2xl text-[#7d6a4e]" style={{ fontFamily: '"CaveatLocal", cursive' }}>
              the heaven promise ✦
            </p>

            <h2 className="mt-2 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-[#1c2540] sm:text-5xl">
              Crafted for the way you show up.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#5e6675] sm:text-lg">
              Premium fragrance should feel expressive, wearable, and easy to return to—whether you are
              stepping into a moment or settling into your everyday ritual.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-[#27324f] bg-[#1c2540] py-16 text-white sm:py-20">
        <div className="pointer-events-none absolute -left-16 top-0 h-48 w-48 rounded-full bg-[#bfe1ec]/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-[#f3c7d3]/15 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="text-2xl text-[#fff0a8]" style={{ fontFamily: '"CaveatLocal", cursive' }}>
            your next chapter starts with a scent ♡
          </p>

          <h2 className="mt-2 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-5xl">
            Your signature scent starts here.
          </h2>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 border-2 border-[#fffdf7] bg-[#fffdf7] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#1c2540] shadow-[4px_5px_0_rgba(0,0,0,0.15)] transition-all hover:-translate-y-1"
            >
              SHOP THE COLLECTION
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/fragrance-finder"
              className="inline-flex items-center gap-2 border border-white/30 bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all hover:-translate-y-1 hover:border-[#fff0a8] hover:text-[#fff0a8]"
            >
              FIND MY SCENT
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
