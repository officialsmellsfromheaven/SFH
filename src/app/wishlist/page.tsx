"use client";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useWishlistStore } from "@/lib/store";
import { products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import PageHero from "@/components/ui/PageHero";

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const wishlistProducts = products.filter((p) => items.includes(p.id));

  return (
    <div className="min-h-screen bg-stone-50">
      <PageHero eyebrow="Saved Items" title="My Wishlist" showLogo />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={56} className="text-stone-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-stone-600 mb-2">Your wishlist is empty</h2>
            <p className="text-stone-400 mb-6">Save your favourite fragrances here.</p>
            <Link href="/shop" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-3.5 rounded-full transition-colors text-sm">
              Explore Fragrances →
            </Link>
          </div>
        ) : (
          <>
            <p className="text-stone-500 mb-6">{wishlistProducts.length} saved item{wishlistProducts.length > 1 ? "s" : ""}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {wishlistProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
