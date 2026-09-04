"use client";

import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useWishlistStore } from "@/lib/store";
import {
  Product,
  getProductFragranceFamilies,
  getProductPrimaryImage,
  getProductSlug,
} from "@/lib/data";
import { getLowestProductPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";
import { orderConfig } from "@/lib/orderConfig";
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

  const familyLabel =
    product.fragranceFamily && product.fragranceFamily.trim()
      ? product.fragranceFamily.trim().toUpperCase()
      : "UNCATEGORIZED";

  const handleWishlist = () => {
    toggleWishlist(product.id);
    toast(wishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -5,
        transition: {
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      className="luxury-card product-card group flex min-h-[520px] flex-col overflow-hidden rounded-[1.6rem] border border-[#e9dfcf] bg-[#ffffff] p-4 text-center shadow-[0_10px_25px_rgba(17,17,17,0.02)] transition-[border-color,box-shadow] duration-300 hover:border-[#dfc28d] hover:shadow-[0_18px_40px_rgba(17,17,17,0.07)] max-[639px]:box-border max-[639px]:min-w-0"
    >
      {/* Top row */}
      <div className="flex items-center justify-between px-1 pt-1 max-[639px]:min-w-0 max-[639px]:gap-2">
        <div className="flex flex-wrap items-center gap-2 max-[639px]:min-w-0">
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b88932]">
            {familyLabel}
          </span>

          {product.isNew || product.newArrival ? (
            <Badge variant="green" className="text-[10px]">
              New
            </Badge>
          ) : null}
        </div>

        <motion.button
          type="button"
          onClick={handleWishlist}
          aria-label={
            wishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          whileTap={{ scale: 0.88 }}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.18 }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#efe6d7] bg-[#faf8f3] text-[#4d4d4d] transition-colors duration-300 hover:border-[#b88932] hover:text-[#111111]"
        >
          <Heart
            size={18}
            fill={wishlisted ? "currentColor" : "none"}
          />
        </motion.button>
      </div>

      {/* Product image */}
      <Link
        href={`/product/${productSlug}`}
        className="block px-3 pt-3 max-[639px]:min-w-0"
      >
        <motion.div
          whileHover={{ scale: 1.015 }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-[1.25rem] bg-[#f7f3ed]"
        >
          <SafeImage
            src={productImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 280px"
            className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </motion.div>
      </Link>

      {/* Product information */}
      <div className="mt-auto flex flex-1 flex-col px-1 pb-2 pt-4 max-[639px]:min-w-0 max-[639px]:px-0">
        <Link
          href={`/product/${productSlug}`}
          className="block max-[639px]:min-w-0"
        >
          <motion.h3
            whileHover={{ y: -1 }}
            transition={{ duration: 0.2 }}
            className="break-words text-[1.55rem] font-medium leading-[1.1] tracking-[-0.04em] text-[#111111] max-[639px]:text-[1.2rem]"
          >
            {product.name}
          </motion.h3>
        </Link>

        <div className="mt-3 flex flex-wrap justify-center gap-1.5 max-[639px]:min-w-0">
          {fragranceTags.map((tag) => (
            <span
              key={tag}
              className="max-w-full break-words rounded-full border border-[#efe6d7] bg-[#faf8f3] px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-[#4d4d4d]"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="mx-auto mt-3 max-w-[18rem] break-words text-sm leading-6 text-[#6e6e73] max-[639px]:text-[13px] max-[639px]:leading-5">
          {product.longevity} longevity. {product.projection} projection.
        </p>

        <p className="mt-4 break-words text-base font-medium text-[#111111]">
          From {formatPrice(getLowestProductPrice(product))}
        </p>

        {/* WhatsApp */}
        <div className="mt-5 flex items-center justify-center gap-5 max-[639px]:min-w-0 max-[639px]:mt-6 max-[639px]:flex-col max-[639px]:gap-3">
          <motion.div
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="max-[639px]:w-full"
          >
            <Link
              href={`https://wa.me/${orderConfig.whatsappNumber}?text=${encodeURIComponent(
                `Hello! I would like to know more about ${product.name}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full items-center justify-center gap-2 rounded-full bg-[#111111] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:bg-[#1d1d1d] hover:shadow-[0_12px_22px_rgba(17,17,17,0.12)] max-[639px]:min-w-0 max-[639px]:w-full max-[639px]:px-2"
            >
              <MessageCircle size={15} />
              WhatsApp
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}