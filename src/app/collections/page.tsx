import { collections } from "@/lib/data";
import { getCollectionImagePath } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections",
  description: "Explore all fragrance collections from Smells From Heaven.",
};

export default function CollectionsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f0e4] text-[#1c2540]">
      <div className="pointer-events-none absolute -left-24 top-24 h-64 w-64 rounded-full bg-[#bfe1ec]/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-[32rem] h-72 w-72 rounded-full bg-[#f3c7d3]/45 blur-3xl" />
      <div className="pointer-events-none absolute bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#d9cdec]/40 blur-3xl" />

      <section className="relative px-4 pb-9 pt-12 sm:px-6 sm:pb-11 sm:pt-16">
        <div className="mx-auto max-w-7xl">
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute -left-1 top-5 h-9 w-28 rotate-[-5deg] bg-[#bfe1ec]/80 shadow-sm" />
            <div className="absolute -right-1 top-8 h-8 w-24 rotate-[6deg] bg-[#f3c7d3]/75 shadow-sm" />

            <div className="relative overflow-hidden border border-[#d8cdbd] bg-[#fffdf7] px-6 py-10 shadow-[0_18px_50px_rgba(72,56,35,0.10)] sm:px-10 sm:py-12">
              <div className="absolute right-5 top-5 h-3 w-3 rounded-full bg-[#b88932]/70" />
              <div className="absolute bottom-5 left-6 h-2 w-2 rounded-full bg-[#9bbca1]" />

              <div className="text-center">
                <p className="caveat text-2xl font-semibold text-[#6d7890] sm:text-3xl">
                  little worlds, bottled with love ✦
                </p>

                <div className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-[#ded4c5] bg-[#fff6c9] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[#786532] shadow-sm">
                  <Sparkles size={12} />
                  Collections
                </div>

                <h1 className="mt-5 font-[var(--font-playfair)] text-4xl font-bold tracking-[-0.05em] text-[#1c2540] sm:text-5xl lg:text-6xl">
                  Explore Collections
                </h1>

                <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#667085] sm:text-base sm:leading-8">
                  Discover fragrances curated for every mood, occasion and personal style.
                </p>

                <p className="caveat mt-5 text-xl text-[#8b6f45] sm:text-2xl">
                  which chapter feels like you today? ♡
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-16 pt-4 sm:pb-24 sm:pt-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="caveat text-xl text-[#7a8799]">choose your little world ✦</p>
              <h2 className="mt-1 font-[var(--font-playfair)] text-2xl font-bold tracking-[-0.035em] text-[#1c2540] sm:text-3xl">
                Find your scent chapter.
              </h2>
            </div>

            <span className="hidden rounded-full border border-[#d8cdbd] bg-[#fffdf7] px-3 py-1 text-xs text-[#7a8799] shadow-sm sm:inline-flex">
              {collections.length} collections
            </span>
          </div>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection, index) => {
              const imagePath = getCollectionImagePath(collection.name);

              const tapes = [
                "bg-[#bfe1ec]/80",
                "bg-[#f3c7d3]/80",
                "bg-[#d9cdec]/80",
                "bg-[#fff0a8]/80",
                "bg-[#cfe6cf]/80",
              ];

              const papers = [
                "bg-[#eef8fa]",
                "bg-[#fae9ef]",
                "bg-[#f0ebf8]",
                "bg-[#fff9dc]",
                "bg-[#edf7ed]",
              ];

              const rotations = [
                "rotate-[-1deg]",
                "rotate-[1.2deg]",
                "rotate-[-0.7deg]",
                "rotate-[1deg]",
                "rotate-[-1.2deg]",
              ];

              return (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.id}`}
                  aria-label={`Explore ${collection.name}`}
                  className={`group relative block ${rotations[index % rotations.length]} transition-transform duration-300 hover:z-20 hover:rotate-0 hover:-translate-y-2`}
                >
                  <div
                    className={`relative overflow-hidden border border-[#d8cdbd] ${papers[index % papers.length]} p-3 shadow-[0_16px_35px_rgba(72,56,35,0.12)]`}
                  >
                    <div
                      className={`absolute left-1/2 top-[-10px] z-20 h-8 w-28 -translate-x-1/2 rotate-[-2deg] ${tapes[index % tapes.length]} shadow-sm`}
                    />

                    <div className="relative overflow-hidden border border-[#ded4c5] bg-[#fffdf7]">
                      <div
                        aria-hidden="true"
                        className="relative h-56 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.04] sm:h-64"
                        style={{ backgroundImage: `url("${imagePath}")` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-[#fffdf7]/55 via-transparent to-white/10" />

                        <div className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#536078] backdrop-blur-sm">
                          Collection {String(index + 1).padStart(2, "0")}
                        </div>
                      </div>

                      <div className="relative p-5 sm:p-6">
                        <div className="flex items-center justify-between gap-3">
                          <span className="caveat text-lg font-semibold text-[#7d6a4e]">
                            curated for you ✦
                          </span>

                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9a9a9a]">
                            {collection.productCount} scents
                          </span>
                        </div>

                        <h2 className="mt-3 font-[var(--font-playfair)] text-2xl font-bold leading-tight tracking-[-0.04em] text-[#1c2540] sm:text-[1.7rem]">
                          {collection.name}
                        </h2>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#667085]">
                          {collection.description}
                        </p>

                        <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#e5ddd1] pt-4">
                          <span className="caveat text-base text-[#7a8799]">
                            find your next memory
                          </span>

                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1c2540] transition-all duration-200 group-hover:gap-2.5">
                            Explore
                            <ArrowRight size={15} strokeWidth={2.2} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mx-auto mt-12 max-w-2xl text-center">
            <div className="mx-auto h-px w-20 bg-[#c9bca8]" />
            <p className="caveat mt-5 text-xl text-[#7d6a4e] sm:text-2xl">
              every collection holds a different kind of heaven. ♡
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
