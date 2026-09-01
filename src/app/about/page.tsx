"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Leaf, ShieldCheck, Sparkles, Users } from "lucide-react";
import { getSiteImage } from "@/lib/siteImages";

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
    <div className="bg-[#faf8f3] text-[#111111]">
      <section className="relative overflow-hidden border-b border-[#eadfc7] bg-[radial-gradient(circle_at_top,_rgba(184,137,50,0.14),_rgba(250,248,243,0)_42%)] py-14 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b88932]">
              ABOUT SMELLS FROM HEAVEN
            </p>
            <h1 className="mt-5 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.94] tracking-[-0.06em] text-[#111111] sm:text-5xl lg:text-[5rem]">
              BORN FROM A
              <span className="block">PASSION FOR SCENT.</span>
            </h1>
            <div className="mt-6 h-px w-20 bg-[#b88932]" />
            <p className="mt-6 max-w-xl text-base leading-8 text-[#4d4d4d] sm:text-lg">
              Smells From Heaven was founded in 2024 by Rushikesh Joshi with a vision to make fragrance
              feel premium, personal, memorable and accessible.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1d1d1d]"
              >
                SHOP NOW
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/fragrance-finder"
                className="inline-flex items-center gap-2 rounded-full border border-[#d9c8a2] bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#111111] transition-all duration-200 hover:border-[#b88932] hover:text-[#b88932]"
              >
                FIND MY SCENT
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-6 rounded-full bg-[#e8d5a8]/30 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[2rem] border border-[#eadfc7] bg-[#f5efe4] p-3 shadow-[0_24px_70px_rgba(17,17,17,0.08)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                <Image
                  src={aboutStoryVisual?.src ?? "/logo.png"}
                  alt={aboutStoryVisual?.alt ?? "Founder story visual for Smells From Heaven"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b88932]">
              OUR STORY
            </p>
            <h2 className="mt-4 font-[var(--font-playfair)] text-3xl font-semibold leading-[0.96] tracking-[-0.06em] text-[#111111] sm:text-5xl">
              A story shaped by fragrance, confidence, and connection.
            </h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-[#4d4d4d] sm:text-lg">
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
          </div>

          <div className="relative">
            <div className="absolute inset-6 rounded-full bg-[#e8d5a8]/30 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[2rem] border border-[#eadfc7] bg-[#f5efe4] p-3 shadow-[0_24px_70px_rgba(17,17,17,0.08)]">
              <div className="story-visual-frame relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#f5efe4]">
                <Image
                  src="/images/artsfh2.png"
                  alt="Smells From Heaven brand story collage"
                  fill
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className="story-visual-image object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e8dcc2] bg-[#f0eadf] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {values.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-[1.5rem] border border-[#e7d9bc] bg-white p-6 shadow-[0_12px_30px_rgba(17,17,17,0.02)]">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#f0e1b9] text-[#8a6a2a]">
                  <Icon size={22} />
                </div>
                <h3 className="text-2xl font-semibold text-[#111111]">{title}</h3>
                <p className="mt-3 text-base leading-7 text-[#4d4d4d]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b88932]">
              THE CRAFT BEHIND EVERY BOTTLE
            </p>
            <h2 className="mt-3 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-[#111111] sm:text-5xl">
              Thoughtful detail. Memorable finish.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {craftSteps.map((step) => (
              <article key={step.step} className="rounded-[1.4rem] border border-[#eadfc7] bg-[#faf8f3] p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#b88932]">{step.step}</p>
                <h3 className="mt-4 text-2xl font-semibold text-[#111111]">{step.title}</h3>
                <p className="mt-3 text-base leading-7 text-[#4d4d4d]">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111111] py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#3b352f] bg-[#1b1a18] p-3">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
              <Image
                src={founderVisual?.src ?? "/logo.png"}
                alt={founderVisual?.alt ?? "Rushikesh Joshi founder portrait"}
                fill
                sizes="(max-width: 1024px) 100vw, 560px"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d9bf7f]">
              THE FOUNDER
            </p>
            <h2 className="mt-4 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-5xl">
              Rushikesh Joshi
            </h2>
            <p className="mt-3 text-lg text-[#d4d4d4]">Founder, Smells From Heaven</p>
            <div className="mt-6 h-px w-20 bg-[#d9bf7f]" />
            <p className="mt-6 max-w-xl text-base leading-8 text-[#d5d5d5] sm:text-lg">
              Founded in 2024, Smells From Heaven is driven by a vision to make fragrance feel premium,
              personal, memorable and accessible.
            </p>
            <div className="mt-8 flex items-center gap-3 rounded-full border border-[#3b352f] bg-[#1a1817] px-4 py-3 text-sm text-[#f1e5c8]">
              <Sparkles size={16} className="text-[#d9bf7f]" />
              Founded in 2024
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b88932]">
            THE HEAVEN PROMISE
          </p>
          <h2 className="mt-4 font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-[#111111] sm:text-5xl">
            Crafted for the way you show up.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#4d4d4d] sm:text-lg">
            Premium fragrance should feel expressive, wearable, and easy to return to?whether you are
            stepping into a moment or settling into your everyday ritual.
          </p>
        </div>
      </section>

      <section className="bg-[#111111] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <h2 className="font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-5xl">
            Your signature scent starts here.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-[#faf8f3] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[#111111] transition-all duration-200 hover:-translate-y-0.5"
            >
              SHOP THE COLLECTION
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/fragrance-finder"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:border-[#d9bf7f] hover:text-[#d9bf7f]"
            >
              FIND MY SCENT
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
