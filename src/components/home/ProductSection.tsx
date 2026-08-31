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
  return (
    <section className={tone === "light" ? "bg-[#f4efe7] py-20 sm:py-24" : "bg-[#faf8f3] py-20 sm:py-24"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 text-center">
          {subtitle && (
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b88932]">
              {subtitle}
            </p>
          )}
          <h2 className="font-[var(--font-playfair)] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-[#111111] sm:text-5xl">
            {title}
          </h2>
          <Link
            href={viewAllHref}
            className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#111111] transition-colors hover:text-[#b88932]"
          >
            {viewAllLabel} <ChevronRight size={16} strokeWidth={2.4} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
