"use client";

import { Heart, MessageCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/lib/store";
import { Product, getProductFragranceFamilies, getProductPrimaryImage, getProductSlug } from "@/lib/data";
import { getLowestProductPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";
import SafeImage from "@/components/ui/SafeImage";
import Badge from "@/components/ui/Badge";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);
  const fragranceTags = getProductFragranceFamilies(product);
  const productImage = getProductPrimaryImage(product);
  const productSlug = getProductSlug(product);

  const familyLabel = (product.fragranceFamily && product.fragranceFamily.trim())
    ? product.fragranceFamily.trim().toUpperCase()
    : "UNCATEGORIZED";

  const handleWishlist = () => {
    toggleWishlist(product.id);
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <article className="luxury-card product-card group flex min-h-[520px] flex-col overflow-hidden rounded-[1.6rem] border border-[#e9dfcf] bg-[#ffffff] p-4 text-center shadow-[0_10px_25px_rgba(17,17,17,0.02)] hover:border-[#dfc28d]">
      <div className="flex items-center justify-between px-1 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b88932]">
            {familyLabel}
          </span>
          {product.isNew || product.newArrival ? (
            <Badge variant="green" className="text-[10px]">New</Badge>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#efe6d7] bg-[#faf8f3] text-[#4d4d4d] transition-colors hover:border-[#b88932] hover:text-[#111111]"
        >
          <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <Link href={`/product/${productSlug}`} className="block px-3 pt-3">
        <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-[1.25rem] bg-[#f7f3ed]">
          <SafeImage
           src={productImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 280px"
           className="object-contain transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
      </Link>

      <div className="mt-auto flex flex-1 flex-col px-1 pb-2 pt-4">
        <Link href={`/product/${productSlug}`} className="block">
          <h3 className="text-[1.55rem] font-medium leading-[1.1] tracking-[-0.04em] text-[#111111]">
            {product.name}
          </h3>
        </Link>
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">
          {fragranceTags.map((tag) => (
            <span
              key={tag}
             className="rounded-full border border-[#efe6d7] bg-[#faf8f3] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-[#4d4d4d]"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mx-auto mt-3 max-w-[18rem] text-sm leading-6 text-[#6e6e73]">
          {product.longevity} longevity. {product.projection} projection.
        </p>
        <p className="mt-4 text-base font-medium text-[#111111]">
          From {formatPrice(getLowestProductPrice(product))}
        </p>

        <div className="mt-5 flex items-center justify-center gap-5">
          <Link
            href={`/product/${productSlug}`}
           className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#111111] transition-colors hover:text-[#b88932]"
          >
            Learn more <ChevronRight size={15} strokeWidth={2.4} />
          </Link>
          <Link
            href={`/product/${productSlug}`}
           className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1d1d1d] hover:shadow-[0_12px_22px_rgba(17,17,17,0.12)]"
          >
            <MessageCircle size={15} />
           WhatsApp
          </Link>
        </div>
      </div>
    </article>
  );
}
