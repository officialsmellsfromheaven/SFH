"use client";

import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/lib/data";

type Props = {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
  tone?: "light" | "white";
};

export default function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref = "/shop",
  viewAllLabel = "View all",
  tone = "white",
}: Props) {
  const sectionBackground =
    tone === "light" ? "bg-[#f4efe7]" : "bg-[#faf8f3]";

  return (
    <section
      className={`${sectionBackground} relative overflow-hidden py-20 sm:py-24 lg:py-28`}
    >
      {/* Heaven glow + scrapbook atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-[#f3c7d3]/45 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#bfe1ec]/45 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-80 w-[min(1000px,90vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,246,201,0.7),transparent_68%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:radial-gradient(#1c2540_0.55px,transparent_0.55px)] [background-size:13px_13px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Scrapbook heading */}
        <div className="relative mx-auto mb-12 max-w-4xl text-center sm:mb-14 lg:mb-16">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-7 w-28 -translate-x-1/2 -translate-y-2 rotate-[-2deg] bg-[#fff6c9]/90 shadow-sm"
          />

          <div className="relative">
            {subtitle && (
              <div className="mb-4 inline-flex rotate-[-1deg] items-center gap-2 rounded-full border border-[#1c2540]/10 bg-white/75 px-4 py-1.5 shadow-[0_3px_12px_rgba(28,37,64,0.06)] backdrop-blur-sm">
                <Sparkles size={12} className="text-[#b88932]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b88932] sm:text-[11px]">
                  {subtitle}
                </p>
              </div>
            )}

            <h2
              className="text-5xl font-bold leading-[0.88] tracking-[-0.025em] text-[#1c2540] sm:text-6xl lg:text-[5.2rem]"
              style={{ fontFamily: "CaveatLocal, cursive" }}
            >
              {title}
            </h2>

            <div className="mx-auto mt-4 flex items-center justify-center gap-3">
              <span className="h-px w-10 rotate-[-2deg] bg-[#b88932]/60 sm:w-16" />
              <span
                aria-hidden="true"
                className="text-lg text-[#b88932]"
                style={{ fontFamily: "CaveatLocal, cursive" }}
              >
                ✦ handpicked memories ✦
              </span>
              <span className="h-px w-10 rotate-[2deg] bg-[#b88932]/60 sm:w-16" />
            </div>

            <Link
              href={viewAllHref}
              className="group mt-5 inline-flex rotate-[1deg] items-center gap-2 rounded-md bg-[#fffdf7] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1c2540] shadow-[2px_3px_0_rgba(28,37,64,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:rotate-0 hover:text-[#b88932] sm:text-[11px]"
            >
              <span>{viewAllLabel}</span>
              <ChevronRight
                size={15}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Product grid — kept fully driven by the existing ProductCard */}
        <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={[
                "relative",
                index % 4 === 1 ? "lg:translate-y-5" : "",
                index % 4 === 3 ? "lg:-translate-y-3" : "",
              ].join(" ")}
            >
              <div
                aria-hidden="true"
                className={[
                  "pointer-events-none absolute z-10 h-7 w-20 bg-[#f7dce4]/85 shadow-sm",
                  index % 2 === 0
                    ? "-left-3 -top-3 rotate-[-7deg]"
                    : "-right-3 -top-3 rotate-[6deg]",
                ].join(" ")}
              />
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}