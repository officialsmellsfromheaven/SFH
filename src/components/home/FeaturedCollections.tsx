"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { collections } from "@/lib/data";

const featured = collections.slice(0, 6);

export default function FeaturedCollections() {
  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-amber-600 text-sm font-semibold tracking-widest uppercase mb-2">
            Curated For You
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold font-[var(--font-playfair)] text-stone-900">
            Featured Collections
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto mt-4" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {featured.map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                href={`/collections/${col.id}`}
                className="group relative block rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-stone-800 to-stone-700"
              >
                {/* Background gradient fallback */}
                <div
                  className={`absolute inset-0 opacity-80 ${
                    [
                      "from-rose-900 to-amber-800",
                      "from-amber-900 to-stone-800",
                      "from-stone-900 to-amber-950",
                      "from-amber-800 to-rose-900",
                      "from-stone-800 to-amber-900",
                      "from-amber-950 to-stone-900",
                    ][i % 6]
                  } bg-gradient-to-br`}
                />

                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[length:20px_20px]" />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-300" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <h3 className="text-white font-bold text-sm sm:text-base font-[var(--font-playfair)] leading-tight mb-1">
                    {col.name}
                  </h3>
                  <p className="text-white/60 text-xs hidden sm:block line-clamp-2">
                    {col.description}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-amber-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Explore <ArrowRight size={12} />
                  </div>
                </div>

                {/* Product count badge */}
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-0.5">
                  <span className="text-white text-xs font-medium">
                    {col.productCount} items
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 border-2 border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 text-sm"
          >
            View All Collections
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
