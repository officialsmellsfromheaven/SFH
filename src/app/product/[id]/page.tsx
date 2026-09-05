"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  Share2,
  MessageCircle,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Truck,
  RotateCcw,
  Shield,
} from "lucide-react";

import {
  products,
  getProductFragranceFamilies,
  getProductGalleryImages,
  getProductMainAccords,
  getProductSlug,
  getProductSubCategories,
  normalizeProductRouteValue,
} from "@/lib/data";

import { getProductSizePrice } from "@/lib/pricing";
import { getProductReviewSummary } from "@/lib/supabase/reviews";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import StarRating from "@/components/ui/StarRating";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/ProductCard";
import SafeImage from "@/components/ui/SafeImage";
import ProductReviews from "@/components/ProductReviews";
import toast from "react-hot-toast";
import { BottleSize, bottleSizes, orderConfig } from "@/lib/orderConfig";
import { calculateOrderTotals } from "@/lib/orderTotals";
import {
  clearPendingOrder,
  getPendingOrder,
  type PendingOrder,
} from "@/lib/pendingOrder";

type PersonalizationType = "Name" | "Initials" | "Short Message";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();

  const routeKey = normalizeProductRouteValue(id);

  const product = products.find((p) => {
    const candidateKeys = [
      normalizeProductRouteValue(getProductSlug(p)),
      normalizeProductRouteValue(p.slug),
      normalizeProductRouteValue(p.id),
      normalizeProductRouteValue(p.name),
    ];

    return (
      candidateKeys.includes(routeKey) ||
      candidateKeys.some(
        (candidate) =>
          candidate.replace(/-/g, "") === routeKey.replace(/-/g, "")
      )
    );
  });

  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const { addItem } = useCartStore();
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState<BottleSize>("50ml");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [liveRating, setLiveRating] = useState(0);
  const [liveReviewCount, setLiveReviewCount] = useState(0);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const [personalizationType, setPersonalizationType] =
    useState<PersonalizationType>("Name");

  const [personalizationText, setPersonalizationText] = useState("");

  const [pendingOrder, setPendingOrder] = useState<PendingOrder | null>(null);
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "notes" | "details" | "reviews"
  >("reviews");

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    const pending = getPendingOrder();

    if (pending) {
      setPendingOrder(pending);
    }
  }, []);

  const confirmPendingOrder = async () => {
    if (!pendingOrder || isConfirmingOrder) return;

    setIsConfirmingOrder(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: pendingOrder.customer,
          items: pendingOrder.items,
          orderNumber: pendingOrder.orderNumber,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error || "Unable to confirm your order. Please try again."
        );
      }

      clearPendingOrder();
      setPendingOrder(null);
      toast.success(`Order ${pendingOrder.orderNumber} confirmed successfully.`);
    } catch (error) {
      console.error("Pending single-product order confirmation failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while confirming your order."
      );
    } finally {
      setIsConfirmingOrder(false);
    }
  };

  useEffect(() => {
    if (!product?.id) {
      return;
    }

    let cancelled = false;

    const loadLiveReviewSummary = async () => {
      setReviewsLoading(true);

      const summary = await getProductReviewSummary(product.id);

      if (!cancelled) {
        setLiveRating(summary.averageRating);
        setLiveReviewCount(summary.reviewCount);
        setReviewsLoading(false);
      }
    };

    loadLiveReviewSummary();

    return () => {
      cancelled = true;
    };
  }, [product?.id]);

  const selectedSizePrice = useMemo(
    () => getProductSizePrice(product, selectedSize),
    [product, selectedSize]
  );

  const totals = useMemo(
    () =>
      calculateOrderTotals({
        bottleSize: selectedSize,
        quantity,
        hasPersonalization: personalizationText.trim().length > 0,
        unitPrice: selectedSizePrice,
      }),
    [
      selectedSize,
      quantity,
      personalizationText,
      selectedSizePrice,
    ]
  );

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-2xl font-bold text-stone-400">
          Product not found
        </p>

        <Link
          href="/shop"
          className="mt-4 text-amber-600 font-semibold hover:underline"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const price = selectedSizePrice;

  const wishlisted = isWishlisted(product.id);

  const fragranceFamilies = getProductFragranceFamilies(product);
  const mainAccords = getProductMainAccords(product);
  const subCategories = getProductSubCategories(product);
  const galleryImages = getProductGalleryImages(product);

  const activeImage =
    galleryImages[
      Math.min(selectedImage, galleryImages.length - 1)
    ] ?? galleryImages[0];

  const similar = products
    .filter(
      (p) =>
        p.id !== product.id &&
        getProductFragranceFamilies(p).some((family) =>
          fragranceFamilies.includes(family)
        )
    )
    .slice(0, 4);

  const handlePersonalizationChange = (value: string) => {
    setPersonalizationText(value.slice(0, 20));
  };

  const handleCheckoutNow = () => {
    const item = {
      id: `${product.id}-${selectedSize}-${Date.now()}`,
      type: "product" as const,
      productId: product.id,
      productName: `${product.name} (${selectedSize})`,
      bottleSize: Number.parseInt(selectedSize, 10),
      quantity,
      referencePrice: totals.subtotal,
      personalizationText: personalizationText.trim(),
      personalizationType,
    };

    addItem(item);
    router.push("/checkout");
  };

  const faqItems = [
    {
      q: "Is this fragrance long-lasting?",
      a: `Yes! ${product.name} offers ${product.longevity} longevity with ${product.projection.toLowerCase()} projection.`,
    },
    {
      q: "How should I apply this perfume?",
      a: "Apply to pulse points — wrists, neck, and behind the ears. Don't rub; let it dry naturally.",
    },
    {
      q: "Is the packaging gift-ready?",
      a: "All our fragrances come in premium packaging. Share gifting notes on WhatsApp when confirming your order.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {pendingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
              <MessageCircle size={26} />
            </div>
            <h2 className="text-center text-xl font-bold text-stone-900">
              Did you send the WhatsApp order?
            </h2>
            <p className="mt-2 text-center text-sm leading-6 text-stone-500">
              Order reference <span className="font-semibold text-stone-800">{pendingOrder.orderNumber}</span> is waiting for confirmation.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  clearPendingOrder();
                  setPendingOrder(null);
                }}
                disabled={isConfirmingOrder}
                className="rounded-full border border-stone-200 px-5 py-3 text-sm font-semibold text-stone-600 hover:bg-stone-50 disabled:opacity-50"
              >
                Not yet
              </button>
              <button
                type="button"
                onClick={confirmPendingOrder}
                disabled={isConfirmingOrder}
                className="rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-wait disabled:opacity-60"
              >
                {isConfirmingOrder ? "Confirming..." : "Yes, I sent it"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-stone-400"
        >
          <Link href="/" className="hover:text-amber-600">
            Home
          </Link>

          <span>/</span>

          <Link href="/shop" className="hover:text-amber-600">
            Shop
          </Link>

          <span>/</span>

          <span className="text-stone-600 font-medium truncate">
            {product.name}
          </span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {/* SFH scrapbook product hero */}
        <div className="relative overflow-hidden rounded-[2rem] border border-[#e8dccb] bg-[#fffdf7] p-4 shadow-[0_18px_60px_rgba(28,37,64,0.08)] sm:p-6 lg:p-8">
          <div className="pointer-events-none absolute -left-16 top-12 h-48 w-48 rounded-full bg-[#bfe1ec]/45 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[#f3c7d3]/30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-[#d9cdec]/30 blur-3xl" />

          <div className="relative grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr] xl:gap-14">
            {/* Images */}
            <div className="space-y-5">
              <div className="relative mx-auto w-full max-w-[650px]">
                <div
                  className="absolute -right-2 top-5 z-20 hidden rotate-3 rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#665878] shadow-sm sm:block"
                  style={{ background: "#d9cdec" }}
                >
                  little bottle of heaven ✦
                </div>

                <div
                  className="absolute -left-2 top-8 z-20 h-9 w-28 -rotate-6 opacity-80 shadow-sm sm:h-10 sm:w-36"
                  style={{ background: "#f3c7d3" }}
                />

                <div className="relative aspect-square rotate-[-1.2deg] overflow-hidden border-[10px] border-[#fffdf7] bg-[#eef8fa] shadow-[0_18px_35px_rgba(28,37,64,0.14)] ring-1 ring-[#e5d9c9]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.95),transparent_42%),linear-gradient(135deg,#eef8fa,#fff7ed)]" />

                  <SafeImage
                    src={activeImage}
                    alt={product.name}
                    fill
                    className="object-contain p-8 sm:p-12"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />

                  {personalizationText.trim() && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="mt-24 rounded-full border border-white/50 bg-white/45 px-5 py-2 text-sm font-bold tracking-[0.2em] text-[#7b5d36] shadow-sm backdrop-blur-sm">
                        {personalizationText}
                      </span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute left-4 top-4 flex flex-col gap-1.5 sm:left-6 sm:top-6">
                    {product.isNew && <Badge variant="green">New</Badge>}
                    {product.isBestSeller && (
                      <Badge variant="gold">Bestseller</Badge>
                    )}
                    {product.isLimited && (
                      <Badge variant="red">Limited Edition</Badge>
                    )}
                    {product.discount && (
                      <Badge variant="red">-{product.discount}% OFF</Badge>
                    )}
                  </div>
                </div>

                <div className="absolute -bottom-5 -left-2 z-20 hidden w-48 -rotate-3 border border-[#e6d8c4] bg-[#fff6c9] px-4 py-3 shadow-[0_8px_20px_rgba(28,37,64,0.10)] sm:block">
                  <p
                    className="text-[20px] leading-none text-[#7b6833]"
                    style={{ fontFamily: '"CaveatLocal", cursive' }}
                  >
                    a scent worth remembering ♡
                  </p>
                  <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.18em] text-[#9a8955]">
                    smells from heaven
                  </p>
                </div>
              </div>

              {galleryImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto px-1 pb-1 sm:justify-center">
                  {galleryImages.map((img, i) => (
                    <button
                      key={`${img}-${i}`}
                      onClick={() => setSelectedImage(i)}
                      aria-label={`View image ${i + 1}`}
                      className={`relative h-20 w-20 flex-shrink-0 rotate-[-1deg] overflow-hidden border-[5px] border-[#fffdf7] bg-white shadow-sm transition-all sm:h-24 sm:w-24 ${
                        selectedImage === i
                          ? "ring-2 ring-[#b88932] ring-offset-2"
                          : "opacity-80 hover:opacity-100"
                      }`}
                    >
                      <SafeImage
                        src={img}
                        alt={`${product.name} view ${i + 1}`}
                        fill
                        className="object-contain p-2"
                        sizes="96px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="relative lg:pt-3">
              <div
                className="mb-5 inline-block rotate-[-2deg] border border-[#e5d7c6] bg-[#f7f0e4] px-4 py-2 shadow-sm"
                style={{ fontFamily: '"CaveatLocal", cursive' }}
              >
                <span className="text-[19px] text-[#59677f]">
                  {fragranceFamilies.join(" / ") || product.fragranceFamily} ·{" "}
                  {product.gender}
                </span>
              </div>

              <h1 className="max-w-2xl font-[var(--font-playfair)] text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-[#1c2540] sm:text-5xl xl:text-[4.25rem]">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <StarRating
                  rating={
                    reviewsLoading
                      ? product.rating
                      : liveReviewCount > 0
                        ? liveRating
                        : 0
                  }
                  showNumber
                  reviewCount={
                    reviewsLoading ? product.reviewCount : liveReviewCount
                  }
                />
                <span className="text-[#d7cbbd]">|</span>
                <span className="text-sm text-[#6f7180]">
                  {reviewsLoading
                    ? "Loading reviews..."
                    : `${liveReviewCount} ${
                        liveReviewCount === 1 ? "review" : "reviews"
                      }`}
                </span>
              </div>

              <div className="mb-5 mt-4 flex flex-wrap gap-2">
                {subCategories.map((subCategory) => (
                  <span
                    key={subCategory}
                    className="rounded-full border border-[#ddd1c2] bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#626779]"
                  >
                    {subCategory}
                  </span>
                ))}
              </div>

              <div className="relative mb-6 overflow-hidden border border-[#e4d8c7] bg-[#fff6c9] px-5 py-4 shadow-sm">
                <span
                  className="absolute -right-1 -top-1 text-2xl text-[#b88932]"
                  style={{ fontFamily: '"CaveatLocal", cursive' }}
                >
                  ✦
                </span>
                <p
                  className="text-[22px] leading-tight text-[#5e5746]"
                  style={{ fontFamily: '"CaveatLocal", cursive' }}
                >
                  {product.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6 flex flex-wrap items-baseline gap-3">
                <span className="text-4xl font-bold tracking-tight text-[#1c2540]">
                  {formatPrice(price)}
                </span>

                {product.originalPrice && (
                  <>
                    <span className="text-lg text-[#9c9aa0] line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="rounded-full bg-[#edf7ed] px-3 py-1 text-sm font-semibold text-[#55705a]">
                      Save {product.discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Quick specs */}
              <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { label: "Longevity", value: product.longevity },
                  { label: "Projection", value: product.projection },
                  { label: "Best Season", value: product.season[0] },
                ].map((s, index) => (
                  <div
                    key={s.label}
                    className={`relative overflow-hidden border border-[#e5d9c9] p-3 text-center shadow-sm ${
                      index === 0
                        ? "rotate-[-1deg] bg-[#eef8fa]"
                        : index === 1
                          ? "rotate-[1deg] bg-[#fae9ef]"
                          : "rotate-[-0.5deg] bg-[#f0ebf8]"
                    }`}
                  >
                    <p className="text-sm font-bold text-[#4f5870]">
                      {s.value}
                    </p>
                    <p
                      className="mt-0.5 text-[17px] leading-none text-[#777481]"
                      style={{ fontFamily: '"CaveatLocal", cursive' }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Size selector */}
              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold text-[#31384d]">
                  Size:{" "}
                  <span
                    className="text-[20px] text-[#b88932]"
                    style={{ fontFamily: '"CaveatLocal", cursive' }}
                  >
                    {selectedSize}
                  </span>
                </p>

                <div className="flex flex-wrap gap-2">
                  {bottleSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                      }}
                      aria-label={`Select size ${size} - ${formatPrice(
                        getProductSizePrice(product, size)
                      )}`}
                      aria-pressed={selectedSize === size}
                      className={`rounded-sm border-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                        selectedSize === size
                          ? "border-[#1c2540] bg-[#1c2540] text-white shadow-md"
                          : "border-[#ddd1c2] bg-white text-[#626779] hover:-translate-y-0.5 hover:border-[#b88932]"
                      }`}
                    >
                      {size}
                      <span className="block text-xs font-normal opacity-80">
                        {formatPrice(getProductSizePrice(product, size))}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6 flex items-center gap-4">
                <p className="text-sm font-semibold text-[#31384d]">Quantity:</p>
                <div className="flex items-center overflow-hidden border-2 border-[#ddd1c2] bg-white">
                  <button
                    onClick={() => {
                      setQuantity(Math.max(1, quantity - 1));
                    }}
                    aria-label="Decrease quantity"
                    className="px-4 py-2 font-bold text-[#626779] hover:bg-[#f7f0e4]"
                  >
                    −
                  </button>
                  <span className="min-w-[2.5rem] px-4 py-2 text-center font-semibold text-[#1c2540]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => {
                      setQuantity(quantity + 1);
                    }}
                    aria-label="Increase quantity"
                    className="px-4 py-2 font-bold text-[#626779] hover:bg-[#f7f0e4]"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Bottle Personalization */}
              <div className="mb-6 border border-[#dfd2c1] bg-[#f0ebf8] p-4 shadow-sm">
                <p className="mb-3 text-sm font-semibold text-[#31384d]">
                  Bottle Personalization{" "}
                  <span className="text-[#8d8a93]">(Optional)</span>
                </p>

                <div className="mb-3 grid gap-2 sm:grid-cols-3">
                  {(
                    ["Name", "Initials", "Short Message"] as PersonalizationType[]
                  ).map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setPersonalizationType(type);
                      }}
                      aria-pressed={personalizationType === type}
                      className={`rounded-sm border px-3 py-2 text-xs font-semibold transition-all ${
                        personalizationType === type
                          ? "border-[#1c2540] bg-[#1c2540] text-white"
                          : "border-[#d9cdec] bg-white text-[#626779] hover:border-[#b88932]"
                      }`}
                    >
                      {type} - {formatPrice(orderConfig.personalizationPricing[type])}
                    </button>
                  ))}
                </div>

                <input
                  value={personalizationText}
                  onChange={(event) =>
                    handlePersonalizationChange(event.target.value)
                  }
                  maxLength={20}
                  placeholder="Emma"
                  className="w-full border border-[#d9cdec] bg-white px-4 py-3 text-sm text-[#1c2540] focus:outline-none focus:ring-2 focus:ring-[#b88932]/30"
                  aria-label="Bottle personalization text"
                />

                <p className="mt-2 text-xs text-[#8d8a93]">
                  {personalizationText.length}/20 characters. Text appears live
                  on bottle preview.
                </p>
              </div>

              {/* Order Summary */}
              <div className="mb-6 border border-[#e1d5c4] bg-[#fffdf7] p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <MessageCircle size={16} className="text-[#b88932]" />
                  <p className="text-sm font-semibold text-[#31384d]">
                    Order Summary
                  </p>
                </div>

                {[
                  ["Product Name", product.name],
                  ["Bottle Size", selectedSize],
                  ["Quantity", quantity],
                  [
                    "Bottle Personalization",
                    personalizationText.trim() || "No personalization",
                  ],
                  ["Unit Price", formatPrice(totals.unitPrice ?? 0)],
                  ["Personalization Charge", formatPrice(totals.personalizationCharge)],
                  ["Shipping", formatPrice(totals.shipping)],
                  ["GST", formatPrice(totals.gst)],
                  ["Discount", `-${formatPrice(totals.discount)}`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-4 border-b border-[#ece3d7] py-2 text-sm last:border-0"
                  >
                    <span className="text-[#777481]">{label}</span>
                    <span className="text-right font-semibold text-[#31384d]">
                      {value}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between gap-4 pt-3 text-lg font-bold text-[#1c2540]">
                  <span>Grand Total</span>
                  <span>{formatPrice(totals.grandTotal)}</span>
                </div>
              </div>

              {/* CTAs — scrapbook-style primary action */}
              <div className="relative mb-5">
                <div
                  className="absolute -top-3 left-7 z-10 rotate-[-2deg] bg-[#fff6c9]/90 px-3 py-1 text-[16px] text-[#6f6339] shadow-[2px_3px_8px_rgba(70,50,20,0.08)]"
                  style={{ fontFamily: '"CaveatLocal", cursive' }}
                >
                  ready to come home? ✦
                </div>

                <Button
                  onClick={handleCheckoutNow}
                  variant="primary"
                  size="lg"
                  className="group relative flex min-h-[58px] w-full flex-1 items-center justify-center gap-3 overflow-hidden !rounded-2xl !border-2 !border-[#8f6724] !bg-[#b88932] !px-6 !py-4 !text-white shadow-[0_6px_0_#8f6724,0_12px_22px_rgba(28,37,64,0.12)] transition-all duration-300 hover:-translate-y-1 hover:!bg-[#c7963c] hover:shadow-[0_8px_0_#8f6724,0_16px_28px_rgba(28,37,64,0.15)] active:translate-y-[2px] active:shadow-[0_3px_0_#8f6724,0_7px_14px_rgba(28,37,64,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b88932]/50 focus-visible:ring-offset-2"
                  aria-label="Add to Cart"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 rotate-12 bg-white/20 blur-md transition-transform duration-700 group-hover:translate-x-[430%]"
                  />
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                    <ShoppingBag size={17} strokeWidth={2.2} />
                  </span>
                  <span className="relative text-sm font-extrabold tracking-[0.02em] sm:text-[15px]">
                    Add to Cart
                  </span>
                  <span className="relative hidden rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] sm:inline-flex">
                    {formatPrice(price)}
                  </span>
                </Button>
              </div>

              {/* Wishlist & Share */}
              <div className="mb-6 flex gap-3">
                <button
                  onClick={() => {
                    toggleWishlist(product.id);

                    toast(
                      wishlisted
                        ? "Removed from wishlist"
                        : "❤️ Added to wishlist"
                    );
                  }}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all ${
                    wishlisted
                      ? "border-red-300 bg-red-50 text-red-500"
                      : "border-[#ddd1c2] bg-white text-[#626779] hover:border-red-300 hover:text-red-500"
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
                  {wishlisted ? "Wishlisted" : "Add to Wishlist"}
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied!");
                  }}
                  className="flex items-center gap-2 rounded-full border border-[#ddd1c2] bg-white px-4 py-2.5 text-sm font-medium text-[#626779] transition-colors hover:border-[#b88932]"
                  aria-label="Share product"
                >
                  <Share2 size={16} />
                  Share
                </button>
              </div>

              {/* Delivery info */}
              <div className="border border-[#e3d7c7] bg-[#f7f0e4] p-4">
                {[
                  { icon: Truck, text: "Free delivery on orders above ₹999" },
                  { icon: RotateCcw, text: "7-day hassle-free return policy" },
                  { icon: Shield, text: "100% authentic. Backed by our guarantee." },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2.5 border-b border-[#e5dacb] py-2.5 text-sm text-[#626779] last:border-0"
                  >
                    <Icon size={16} className="flex-shrink-0 text-[#b88932]" />
                    {text}
                  </div>
                ))}
              </div>

              <p
                className="mt-5 text-right text-[20px] text-[#7b6833]"
                style={{ fontFamily: '"CaveatLocal", cursive' }}
              >
                made for the moments you keep. ♡
              </p>
            </div>
          </div>
        </div>
        {/* =====================================================
            POLISHED SCRAPBOOK TABS
        ====================================================== */}
        <section className="relative mt-16 overflow-hidden rounded-[2rem] border border-[#e6dccb] bg-[#f7f0e4] p-3 shadow-[0_18px_50px_rgba(80,60,30,0.07)] sm:p-5 lg:p-7">
          <div className="pointer-events-none absolute -left-20 top-10 h-48 w-48 rounded-full bg-[#f3c7d3]/35 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-[#bfe1ec]/40 blur-3xl" />

          <div className="relative">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p
                  className="text-[19px] leading-none text-[#6d6470]"
                  style={{ fontFamily: '"CaveatLocal", cursive' }}
                >
                  a little more about this scent ✦
                </p>
                <h2 className="mt-2 font-[var(--font-playfair)] text-2xl font-semibold tracking-[-0.035em] text-[#1c2540] sm:text-3xl">
                  Keep the memory going.
                </h2>
              </div>
              <div
                className="hidden rotate-2 rounded-md bg-[#fff6c9] px-3 py-2 text-[15px] text-[#6f6339] shadow-[0_5px_12px_rgba(70,50,20,0.08)] sm:block"
                style={{ fontFamily: '"CaveatLocal", cursive' }}
              >
                flip through ♡
              </div>
            </div>

            <div
              className="relative mb-6 grid grid-cols-3 gap-2 rounded-2xl border border-[#e8dcc8] bg-[#fffdf8]/80 p-2 shadow-sm"
              role="tablist"
              aria-label="Product information"
            >
              {(["reviews", "notes", "details"] as const).map((tab, index) => {
                const isActive = activeTab === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`relative min-h-[58px] rounded-xl px-2 py-2 text-center transition-all duration-300 ${
                      isActive
                        ? "bg-[#1c2540] text-white shadow-[0_8px_18px_rgba(28,37,64,0.16)]"
                        : "text-[#6f6870] hover:bg-white hover:text-[#1c2540]"
                    }`}
                    aria-selected={isActive}
                    role="tab"
                  >
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.18em]">
                      {index === 0 ? "people said" : index === 1 ? "the scent" : "the story"}
                    </span>
                    <span
                      className="mt-0.5 block text-[18px] sm:text-[20px]"
                      style={{ fontFamily: '"CaveatLocal", cursive' }}
                    >
                      {tab === "notes"
                        ? "Fragrance Notes"
                        : tab === "details"
                          ? "Details"
                          : "Reviews"}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* REVIEWS */}
            {activeTab === "reviews" && (
              <div className="relative">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div
                    className="inline-flex w-fit -rotate-1 items-center gap-2 rounded-lg bg-[#fff6c9] px-3 py-2 text-[16px] text-[#6f6339] shadow-[0_5px_12px_rgba(70,50,20,0.07)]"
                    style={{ fontFamily: '"CaveatLocal", cursive' }}
                  >
                    real words from real scent memories ♡
                  </div>

                  {!reviewsLoading && liveReviewCount > 0 && (
                    <div className="flex items-center gap-2 rounded-full border border-[#e4d8c5] bg-white/80 px-3 py-2">
                      <span className="text-sm tracking-wide text-[#b88932]">★★★★★</span>
                      <span className="text-xs font-semibold text-[#5f5961]">
                        {liveRating.toFixed(1)} · {liveReviewCount}{" "}
                        {liveReviewCount === 1 ? "review" : "reviews"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="overflow-hidden rounded-[1.5rem] border border-[#e7dccb] bg-[#fffdf9] p-3 shadow-[0_12px_30px_rgba(80,60,30,0.05)] sm:p-5">
                  <ProductReviews productId={product.id} />
                </div>

                <div className="mt-6 rotate-[0.15deg] rounded-[1.4rem] border border-[#ded3c2] bg-[#fffdf8] p-4 shadow-[0_10px_24px_rgba(80,60,30,0.05)] sm:p-6">
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                      <p
                        className="text-[18px] text-[#6d6470]"
                        style={{ fontFamily: '"CaveatLocal", cursive' }}
                      >
                        before you take it home...
                      </p>
                      <h3 className="mt-1 font-[var(--font-playfair)] text-xl font-semibold text-[#1c2540]">
                        Common Questions
                      </h3>
                    </div>
                    <span className="hidden text-xl sm:block">✦</span>
                  </div>

                  <div className="divide-y divide-[#eee5d8]">
                    {faqItems.map((item, i) => {
                      const isOpen = expandedFaq === i;

                      return (
                        <div key={i} className="py-1">
                          <button
                            type="button"
                            className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-semibold text-[#30374c]"
                            onClick={() => setExpandedFaq(isOpen ? null : i)}
                            aria-expanded={isOpen}
                          >
                            <span>{item.q}</span>
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#e5d8c5] bg-[#f7f0e4]">
                              {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                            </span>
                          </button>

                          {isOpen && (
                            <p className="pb-4 pr-8 text-sm leading-6 text-[#706a72]">
                              {item.a}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* FRAGRANCE NOTES */}
            {activeTab === "notes" && (
              <div className="space-y-5">
                <div className="relative overflow-hidden rounded-[1.35rem] border border-[#e4d8c7] bg-[#fffdf9] p-4 shadow-[0_8px_20px_rgba(80,60,30,0.04)] sm:p-5">
                  <div
                    className="mb-3 text-[18px] text-[#6d6470]"
                    style={{ fontFamily: '"CaveatLocal", cursive' }}
                  >
                    the mood of the fragrance ✦
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {mainAccords.map((accord, index) => (
                      <span
                        key={accord}
                        className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${
                          index % 4 === 0
                            ? "border-[#bfe1ec] bg-[#eef8fa] text-[#456875]"
                            : index % 4 === 1
                              ? "border-[#f3c7d3] bg-[#fae9ef] text-[#765966]"
                              : index % 4 === 2
                                ? "border-[#d9cdec] bg-[#f0ebf8] text-[#665878]"
                                : "border-[#cfe6cf] bg-[#edf7ed] text-[#55705a]"
                        }`}
                      >
                        {accord}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      label: "TOP NOTES",
                      notes: product.notes?.top?.length ? product.notes.top : product.topNotes ?? [],
                      emoji: "🌿",
                      desc: "the first hello",
                      tape: "bg-[#bfe1ec]",
                      paper: "bg-[#f1fafc]",
                      rotate: "-rotate-[1deg]",
                    },
                    {
                      label: "HEART NOTES",
                      notes: product.notes?.heart?.length ? product.notes.heart : product.heartNotes ?? [],
                      emoji: "🌸",
                      desc: "where the story unfolds",
                      tape: "bg-[#f3c7d3]",
                      paper: "bg-[#fff2f5]",
                      rotate: "rotate-[1deg]",
                    },
                    {
                      label: "BASE NOTES",
                      notes: product.notes?.base?.length ? product.notes.base : product.baseNotes ?? [],
                      emoji: "🌳",
                      desc: "the memory that stays",
                      tape: "bg-[#d9cdec]",
                      paper: "bg-[#f5f1fa]",
                      rotate: "-rotate-[0.5deg]",
                    },
                  ].map((group) => (
                    <div
                      key={group.label}
                      className={`relative ${group.rotate} overflow-hidden rounded-[1.25rem] border border-[#e2d7c6] ${group.paper} p-5 shadow-[0_12px_25px_rgba(80,60,30,0.06)] transition-transform duration-300 hover:rotate-0 hover:-translate-y-1`}
                    >
                      <div className={`absolute -top-2 left-1/2 h-7 w-24 -translate-x-1/2 rotate-[-3deg] ${group.tape} opacity-75`} />

                      <div className="pt-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-bold tracking-[0.18em] text-[#8a8185]">
                              {group.label}
                            </p>
                            <h3
                              className="mt-1 text-[21px] text-[#1c2540]"
                              style={{ fontFamily: '"CaveatLocal", cursive' }}
                            >
                              {group.desc}
                            </h3>
                          </div>
                          <span className="text-2xl">{group.emoji}</span>
                        </div>

                        <div className="mt-5 space-y-2">
                          {group.notes.length ? (
                            group.notes.map((note) => (
                              <div
                                key={`${group.label}-${note}`}
                                className="flex items-center gap-2 text-sm text-[#4d5262]"
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-[#b88932]" />
                                <span className="font-medium">{note}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-[#918a90]">
                              Note information coming soon.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="text-right text-[18px] text-[#6d6470]"
                  style={{ fontFamily: '"CaveatLocal", cursive' }}
                >
                  top → heart → base — let the scent tell its story. ♡
                </div>
              </div>
            )}

            {/* DETAILS */}
            {activeTab === "details" && (
              <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="relative rotate-[-0.4deg] rounded-[1.4rem] border border-[#e1d5c2] bg-[#fffdf8] p-5 shadow-[0_12px_28px_rgba(80,60,30,0.06)] sm:p-6">
                  <div className="absolute -top-3 left-10 h-7 w-24 rotate-[-4deg] bg-[#fff6c9]/90" />

                  <p
                    className="text-[20px] text-[#6d6470]"
                    style={{ fontFamily: '"CaveatLocal", cursive' }}
                  >
                    the little facts ✦
                  </p>

                  <div className="mt-4 divide-y divide-[#eee5d8]">
                    {[
                      { label: "Brand", value: product.brand },
                      { label: "Gender", value: product.gender },
                      {
                        label: "Fragrance Family",
                        value: fragranceFamilies.join(" / ") || product.fragranceFamily,
                      },
                      { label: "Longevity", value: product.longevity },
                      { label: "Projection", value: product.projection },
                      { label: "Best Season", value: product.season.join(", ") },
                      { label: "Best Occasion", value: product.occasion.join(", ") },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className="grid grid-cols-[110px_1fr] gap-4 py-3 sm:grid-cols-[135px_1fr]"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9a9194]">
                          {row.label}
                        </span>
                        <span className="text-sm font-semibold leading-5 text-[#353b4e]">
                          {row.value || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative rounded-[1.4rem] border border-[#e5d9c7] bg-[#f0ebf8] p-5 shadow-[0_10px_24px_rgba(80,60,30,0.05)] sm:p-6">
                    <div className="absolute -right-2 -top-3 rotate-3 rounded-sm bg-[#d9cdec] px-3 py-1 text-[15px] text-[#665878]">
                      scent story
                    </div>

                    <h3
                      className="text-[24px] text-[#3f4660]"
                      style={{ fontFamily: '"CaveatLocal", cursive' }}
                    >
                      Why this one?
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-[#5e6070]">
                      {product.description || "A fragrance made to become part of your story."}
                    </p>
                  </div>

                  <div className="relative rounded-[1.4rem] border border-[#e3d8c6] bg-[#fff6c9] p-5 shadow-[0_10px_24px_rgba(80,60,30,0.05)] sm:p-6">
                    <h3
                      className="text-[22px] text-[#6f6339]"
                      style={{ fontFamily: '"CaveatLocal", cursive' }}
                    >
                      What&apos;s inside ♡
                    </h3>

                    <p className="mt-3 text-xs leading-6 text-[#71694e]">
                      {product.ingredients || "Ingredient information will be available soon."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Similar Products */}
        {similar.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold font-[var(--font-playfair)] text-stone-900 mb-8">
              You May Also Like
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {similar.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}