"use client";

import Image from "next/image";
import Link from "next/link";
import { getSiteImage } from "@/lib/siteImages";

export default function HeroBanner() {
  const heroVisual = getSiteImage("homeHero");

  return (
    <section className="relative isolate overflow-hidden bg-[#faf8f3] text-[#111111]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(184,137,50,0.18),_transparent_36%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 max-[639px]:gap-3 max-[639px]:py-8 sm:px-6 lg:grid-cols-[0.96fr_1.04fr] lg:gap-10 lg:py-20">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#b88932]">SMELLS FROM HEAVEN</p>
          <h1 className="mt-5 max-[639px]:mt-4 font-[var(--font-playfair)] text-5xl font-semibold leading-[0.9] tracking-[-0.07em] text-[#111111] sm:text-6xl lg:text-[5.3rem]">
            <span className="block">FIND YOUR</span>
            <span className="block">SIGNATURE.</span>
          </h1>
          <p className="mt-5 max-[639px]:mt-4 max-w-lg text-lg leading-7 text-[#4d4d4d] sm:text-xl">Fragrance that feels uniquely you.</p>
          <div className="mt-8 max-[639px]:mt-6 flex flex-wrap items-center gap-3.5">
            <Link href="/shop?filter=men" className="inline-flex items-center justify-center rounded-full bg-[#111111] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1d1d1d]">SHOP MEN&apos;S</Link>
            <Link href="/shop?filter=women" className="inline-flex items-center justify-center rounded-full border border-[#d9c8a2] bg-white/80 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111111] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#b88932] hover:text-[#b88932]">SHOP WOMEN&apos;S</Link>
          </div>
          <div className="mt-9 max-[639px]:mt-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#4d4d4d]">
            <span>CRAFTED IN HEAVEN</span>
            <span className="h-px w-10 bg-[#b88932]" />
            <span>WORN BY LEGENDS</span>
          </div>
        </div>
        <div className="relative z-10 flex items-center justify-end pointer-events-none max-[639px]:-mt-4">
          <div className="relative h-[60vh] w-full max-w-[760px] max-[639px]:h-[min(38vh,320px)] sm:h-[74vh] sm:max-w-[920px] md:h-[86vh] md:max-w-[1080px] lg:h-[96vh] lg:max-w-[1240px] xl:h-[110vh] xl:max-w-[1400px] lg:translate-y-8 xl:-translate-y-5 lg:scale-[1.08] xl:scale-[1.12]">
            <Image
              src={heroVisual?.src ?? "/logo.png"}
              alt={heroVisual?.alt ?? "Smells From Heaven luxury hero portrait"}
              fill
              priority={heroVisual?.priority ?? true}
              sizes="(max-width: 1024px) 100vw, 680px"
              className="home-hero-image object-contain"
              aria-hidden={false}
            />
          </div>
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
          `}</style>
        </div>
      </div>
    </section>
  );
}
