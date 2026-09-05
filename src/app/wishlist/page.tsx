"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, ArrowRight, Bookmark } from "lucide-react";
import Link from "next/link";
import { useWishlistStore } from "@/lib/store";
import { products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const wishlistProducts = products.filter((p) => items.includes(p.id));

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f0e4] text-[#1c2540]">
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-24 top-28 h-72 w-72 rounded-full bg-[#d9cdec]/45 blur-3xl" />
        <div className="absolute right-[-90px] top-10 h-80 w-80 rounded-full bg-[#f3c7d3]/40 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-[#bfe1ec]/40 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              "radial-gradient(#1c2540 0.7px, transparent 0.7px)",
            backgroundSize: "9px 9px",
          }}
        />
      </div>

      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 lg:pt-14">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#1c2540]/10 bg-[#fffdf7] px-6 py-10 shadow-[8px_10px_0_rgba(28,37,64,0.08)] sm:px-10 lg:px-14">
            <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#fff6c9] blur-2xl" />
            <div className="absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-[#bfe1ec]/45 blur-3xl" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="caveat mb-3 text-2xl text-[#8d5f2a] sm:text-3xl"
                >
                  little things worth keeping ✦
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  className="text-4xl font-black tracking-[-0.045em] sm:text-5xl lg:text-6xl"
                >
                  My Wishlist
                  <span className="ml-2 inline-block -rotate-6 text-[#d58a9f]">♡</span>
                </motion.h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[#1c2540]/65 sm:text-base">
                  A little shelf for the scents that caught your heart.
                  Keep the ones you are not ready to forget.
                </p>
              </div>

              <motion.div
                initial={{ opacity: 0, rotate: 4, y: 10 }}
                animate={{ opacity: 1, rotate: 4, y: 0 }}
                transition={{ delay: 0.15 }}
                className="relative w-fit rotate-2 border border-[#1c2540]/10 bg-[#fff6c9] px-5 py-4 shadow-[4px_5px_0_rgba(28,37,64,0.12)]"
              >
                <div className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-2 bg-[#f3c7d3]/75" />
                <Bookmark className="mb-1 h-5 w-5" />
                <p className="caveat text-xl">saved with love</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] opacity-55">
                  SFH / memory shelf
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          {wishlistProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mx-auto mt-5 max-w-2xl overflow-hidden rounded-[2rem] border border-[#1c2540]/10 bg-[#fffdf7] px-6 py-16 text-center shadow-[7px_8px_0_rgba(28,37,64,0.08)] sm:px-10"
            >
              <div className="absolute left-5 top-5 -rotate-12 border border-[#1c2540]/10 bg-[#d9cdec] px-3 py-2 shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="absolute right-7 top-8 rotate-12 text-[#d58a9f]">
                <span className="caveat text-2xl">oops... empty ♡</span>
              </div>

              <div className="mx-auto mb-6 flex h-20 w-20 rotate-[-4deg] items-center justify-center border border-[#1c2540]/10 bg-[#f3c7d3] shadow-[4px_5px_0_rgba(28,37,64,0.1)]">
                <Heart size={38} strokeWidth={1.7} />
              </div>
              <p className="caveat text-2xl text-[#8d5f2a]">
                your memory shelf is waiting...
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                No saved scents yet.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#1c2540]/55">
                Find a fragrance that feels like you, tap the heart, and
                we&apos;ll keep it here for later.
              </p>
              <Link
                href="/shop"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1c2540] px-7 py-3.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                Explore Fragrances
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="caveat text-2xl text-[#8d5f2a]">
                    your saved chapter ✦
                  </p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                    Fragrances you loved.
                  </h2>
                </div>
                <div className="rotate-[-2deg] border border-[#1c2540]/10 bg-[#fffdf7] px-4 py-2 shadow-[3px_4px_0_rgba(28,37,64,0.08)]">
                  <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#1c2540]/55">
                    {wishlistProducts.length} saved item
                    {wishlistProducts.length > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                {wishlistProducts.map((p, index) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.06, 0.35) }}
                    className="relative min-w-0"
                  >
                    <div
                      className={[
                        "pointer-events-none absolute -top-2 left-1/2 z-20 h-6 w-16 -translate-x-1/2 rotate-[-3deg] opacity-80",
                        index % 4 === 0
                          ? "bg-[#f3c7d3]"
                          : index % 4 === 1
                            ? "bg-[#bfe1ec]"
                            : index % 4 === 2
                              ? "bg-[#d9cdec]"
                              : "bg-[#fff6c9]",
                      ].join(" ")}
                    />
                    <div
                      className={
                        index % 4 === 0
                          ? "rotate-[-1deg]"
                          : index % 4 === 1
                            ? "rotate-[1deg]"
                            : index % 4 === 2
                              ? "rotate-[-0.5deg]"
                              : "rotate-[0.8deg]"
                      }
                    >
                      <ProductCard product={p} />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mx-auto mt-12 max-w-xl text-center">
                <p className="caveat text-xl text-[#8d5f2a]">
                  some scents are meant to stay a little longer ♡
                </p>
                <Link
                  href="/shop"
                  className="mt-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#1c2540] underline decoration-[#d58a9f] decoration-2 underline-offset-4"
                >
                  Discover more scents
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
