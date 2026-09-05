import { collections, products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const col = collections.find((c) => c.id === id);
  return {
    title: col?.name ?? "Collection",
    description: col?.description,
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { id } = await params;
  const col = collections.find((c) => c.id === id);
  const colProducts = products.filter((p) => p.collections.some((c) => c.toLowerCase().includes(id)));

  if (!col) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-2xl font-bold text-stone-400">Collection not found</p>
        <Link href="/collections" className="mt-4 text-amber-600 font-semibold hover:underline">
          Back to Collections
        </Link>
      </div>
    );
  }

  const displayProducts = colProducts.length > 0 ? colProducts : products.slice(0, 6);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f0e4]">
      {/* Scrapbook Heaven atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-[#f3c7d3]/45 blur-3xl" />
        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#bfe1ec]/55 blur-3xl" />
        <div className="absolute left-1/2 top-[38%] h-96 w-96 -translate-x-1/2 rounded-full bg-[#d9cdec]/35 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #1c2540 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <section className="relative px-4 pb-8 pt-8 sm:px-6 sm:pb-12 sm:pt-12">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[34px] border border-[#1c2540]/10 bg-[#fffdf7] px-5 py-8 shadow-[0_24px_70px_rgba(28,37,64,0.11)] sm:px-10 sm:py-12">
            <div className="absolute left-10 top-0 h-10 w-32 -translate-y-1/2 rotate-[-3deg] bg-[#f3c7d3]/85 shadow-sm" />
            <div className="absolute right-8 top-8 hidden rotate-[5deg] rounded-md bg-[#fff6c9] px-4 py-2 shadow-sm sm:block">
              <span className="caveat text-lg font-semibold text-[#1c2540]">
                a little world of scent ♡
              </span>
            </div>

            <div className="max-w-3xl">
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1c2540]/45 transition-colors hover:text-[#b88932]"
              >
                <ArrowLeft size={14} />
                Back to Collections
              </Link>

              <p className="caveat mt-7 text-2xl font-semibold text-[#b88932]">
                curated memories, bottled ✦
              </p>

              <p className="mt-3 text-xs font-bold uppercase tracking-[0.28em] text-[#1c2540]/45">
                Collection
              </p>

              <h1 className="mt-2 font-serif text-4xl font-bold tracking-[-0.04em] text-[#1c2540] sm:text-6xl">
                {col.name}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#1c2540]/65 sm:text-base">
                {col.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rotate-[-2deg] rounded-full bg-[#bfe1ec] px-4 py-2 text-xs font-bold text-[#1c2540] shadow-sm">
                  ✦ handpicked
                </span>
                <span className="rotate-[2deg] rounded-full bg-[#cfe6cf] px-4 py-2 text-xs font-bold text-[#1c2540] shadow-sm">
                  {displayProducts.length} scents
                </span>
                <span className="rotate-[-1deg] rounded-full bg-[#d9cdec] px-4 py-2 text-xs font-bold text-[#1c2540] shadow-sm">
                  made for memories
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collection shelf */}
      <section className="relative px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="caveat text-2xl font-semibold text-[#1c2540]/70">
                from this chapter...
              </p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-[#1c2540] sm:text-3xl">
                Pick your next memory.
              </h2>
            </div>

            <span className="hidden rounded-full border border-[#1c2540]/10 bg-[#fffdf7] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#1c2540]/45 shadow-sm sm:inline-flex">
              {displayProducts.length} fragrances
            </span>
          </div>

          <div className="relative rounded-[30px] border border-[#1c2540]/10 bg-[#fffdf7]/75 p-4 shadow-[8px_10px_0_rgba(28,37,64,0.05)] sm:p-6">
            <div className="absolute -top-3 left-10 rotate-[-2deg] bg-[#fff6c9] px-4 py-2 shadow-sm">
              <span className="caveat text-lg font-semibold text-[#1c2540]">
                scent shelf ✦
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {displayProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={`min-w-0 ${index % 4 === 1 ? "rotate-[1deg]" : index % 4 === 2 ? "rotate-[-1deg]" : index % 4 === 3 ? "rotate-[0.7deg]" : ""}`}
                >
                  <div className="relative">
                    <div
                      className={`absolute -top-2 z-10 h-8 w-14 shadow-sm ${
                        index % 3 === 0
                          ? "left-4 rotate-[-5deg] bg-[#f3c7d3]/85"
                          : index % 3 === 1
                            ? "right-4 rotate-[5deg] bg-[#bfe1ec]/85"
                            : "left-1/2 -translate-x-1/2 rotate-[2deg] bg-[#fff6c9]/90"
                      }`}
                    />
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center">
            <p className="caveat text-xl font-semibold text-[#1c2540]/65">
              find the one that feels like you ♡
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center justify-center rounded-2xl bg-[#1c2540] px-6 py-3 text-sm font-bold text-white shadow-[5px_6px_0_rgba(28,37,64,0.12)] transition-all duration-300 hover:-translate-y-1"
            >
              Explore all collections ✦
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
