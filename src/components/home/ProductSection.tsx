"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
      {/* Subtle ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[min(900px,90vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(184,137,50,0.08),transparent_68%)] blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-14 lg:mb-16">
          {subtitle && (
            <div className="mb-5 flex items-center justify-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-[#b88932]/50 sm:w-12"
              />

              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b88932] sm:text-[11px]">
                {subtitle}
              </p>

              <span
                aria-hidden="true"
                className="h-px w-8 bg-[#b88932]/50 sm:w-12"
              />
            </div>
          )}

          <h2 className="font-[var(--font-playfair)] text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-[#111111] sm:text-5xl lg:text-[3.5rem]">
            {title}
          </h2>

          {/* Gold accent */}
          <div
            aria-hidden="true"
            className="mx-auto mt-6 h-px w-12 bg-[#b88932] sm:mt-7 sm:w-16"
          />

          <Link
            href={viewAllHref}
            className="group mt-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#111111] transition-colors duration-300 hover:text-[#b88932] sm:mt-7 sm:text-[11px]"
          >
            <span>{viewAllLabel}</span>

            <ChevronRight
              size={15}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}