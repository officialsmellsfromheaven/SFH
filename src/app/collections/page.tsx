import { collections } from "@/lib/data";
import { getCollectionImagePath } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections",
  description: "Explore all fragrance collections from Smells From Heaven.",
};

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="pt-10 sm:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#bf4800]">
              Collections
            </p>
            <h1 className="mt-3 font-[var(--font-playfair)] text-4xl font-bold tracking-[-0.05em] text-[#1d1d1f] sm:text-5xl">
              Explore Collections
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#6e6e73] sm:text-lg">
              Discover fragrances curated for every mood, occasion and personal style.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16 pt-10 sm:pb-20 sm:pt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => {
              const imagePath = getCollectionImagePath(collection.name);

              return (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.id}`}
                  aria-label={`Explore ${collection.name}`}
                  className="group relative overflow-hidden rounded-xl border border-[#e5e5e5] bg-[#f5f5f7] text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#d9d9dc] hover:shadow-[0_16px_30px_rgba(0,0,0,0.04)]"
                >
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.02]"
                    style={{ backgroundImage: `url("${imagePath}")` }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(245,245,247,0.28),rgba(245,245,247,0.82))]" />

                  <div className="relative z-10 flex min-h-[280px] flex-col p-5">
                    <div className="mb-6">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#bf4800]">
                        Curated Collection
                      </span>
                    </div>

                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold leading-tight tracking-[-0.04em] text-[#1d1d1f]">
                        {collection.name}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-[#6e6e73]">
                        {collection.description}
                      </p>
                    </div>

                    <div className="mt-8 flex items-center justify-between gap-4 border-t border-[#e5e5e5] pt-4">
                      <span className="text-sm font-medium text-[#1d1d1f]">
                        {collection.productCount} fragrances
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-[#0066cc] transition-colors group-hover:text-[#0077ed]">
                        Explore
                        <ArrowRight size={15} strokeWidth={2.2} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
