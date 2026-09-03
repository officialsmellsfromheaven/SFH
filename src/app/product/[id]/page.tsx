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
  >("notes");

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
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-stone-100 to-amber-50">
              <SafeImage
                src={activeImage}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {personalizationText.trim() && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="mt-24 rounded-full bg-white/35 px-5 py-2 text-sm font-bold tracking-[0.2em] text-amber-900 shadow-sm backdrop-blur-sm">
                    {personalizationText}
                  </span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.isNew && (
                  <Badge variant="green">New</Badge>
                )}

                {product.isBestSeller && (
                  <Badge variant="gold">Bestseller</Badge>
                )}

                {product.isLimited && (
                  <Badge variant="red">Limited Edition</Badge>
                )}

                {product.discount && (
                  <Badge variant="red">
                    -{product.discount}% OFF
                  </Badge>
                )}
              </div>
            </div>

            {galleryImages.length > 1 && (
              <div className="flex gap-3">
                {galleryImages.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    onClick={() => setSelectedImage(i)}
                    aria-label={`View image ${i + 1}`}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === i
                        ? "border-amber-600"
                        : "border-stone-200 hover:border-amber-300"
                    }`}
                  >
                    <SafeImage
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-amber-600 text-sm font-semibold uppercase tracking-wider mb-1">
              {fragranceFamilies.join(" / ") ||
                product.fragranceFamily}{" "}
              · {product.gender}
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold font-[var(--font-playfair)] text-stone-900 mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-4">
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
                  reviewsLoading
                    ? product.reviewCount
                    : liveReviewCount
                }
              />

              <span className="text-stone-300">|</span>

              <span className="text-sm text-stone-500">
                {reviewsLoading
                  ? "Loading reviews..."
                  : `${liveReviewCount} ${
                      liveReviewCount === 1 ? "review" : "reviews"
                    }`}
              </span>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {subCategories.map((subCategory) => (
                <span
                  key={subCategory}
                  className="rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-600"
                >
                  {subCategory}
                </span>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-stone-900">
                {formatPrice(price)}
              </span>

              {product.originalPrice && (
                <>
                  <span className="text-lg text-stone-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>

                  <span className="text-emerald-600 font-semibold text-sm bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Save {product.discount}%
                  </span>
                </>
              )}
            </div>

            {/* Quick specs */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                {
                  label: "Longevity",
                  value: product.longevity,
                },
                {
                  label: "Projection",
                  value: product.projection,
                },
                {
                  label: "Best Season",
                  value: product.season[0],
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-amber-50 rounded-xl p-3 text-center"
                >
                  <p className="text-amber-600 font-bold text-sm">
                    {s.value}
                  </p>

                  <p className="text-stone-400 text-xs mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Size selector */}
            <div className="mb-6">
              <p className="font-semibold text-stone-800 mb-3 text-sm">
                Size:{" "}
                <span className="text-amber-600">
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
                    className={`px-4 py-2.5 rounded-full border-2 text-sm font-semibold transition-all ${
                      selectedSize === size
                        ? "border-amber-600 bg-amber-600 text-white shadow-md"
                        : "border-stone-200 text-stone-600 hover:border-amber-400"
                    }`}
                  >
                    {size}

                    <span className="block text-xs font-normal opacity-80">
                      {formatPrice(
                        getProductSizePrice(product, size)
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <p className="font-semibold text-stone-800 text-sm">
                Quantity:
              </p>

              <div className="flex items-center border border-stone-200 rounded-full overflow-hidden">
                <button
                  onClick={() => {
                    setQuantity(Math.max(1, quantity - 1));
                  }}
                  aria-label="Decrease quantity"
                  className="px-4 py-2 text-stone-500 hover:bg-stone-100 font-bold"
                >
                  −
                </button>

                <span className="px-4 py-2 font-semibold text-stone-800 min-w-[2.5rem] text-center">
                  {quantity}
                </span>

                <button
                  onClick={() => {
                    setQuantity(quantity + 1);
                  }}
                  aria-label="Increase quantity"
                  className="px-4 py-2 text-stone-500 hover:bg-stone-100 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Bottle Personalization */}
            <div className="mb-6 rounded-2xl border border-stone-100 bg-stone-50 p-4">
              <p className="font-semibold text-stone-800 mb-3 text-sm">
                Bottle Personalization{" "}
                <span className="text-stone-400">
                  (Optional)
                </span>
              </p>

              <div className="grid sm:grid-cols-3 gap-2 mb-3">
                {(
                  ["Name", "Initials", "Short Message"] as PersonalizationType[]
                ).map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setPersonalizationType(type);
                    }}
                    aria-pressed={personalizationType === type}
                    className={`px-3 py-2 rounded-full border text-xs font-semibold transition-all ${
                      personalizationType === type
                        ? "border-amber-600 bg-amber-600 text-white"
                        : "border-stone-200 bg-white text-stone-600 hover:border-amber-400"
                    }`}
                  >
                    {type} - {formatPrice(orderConfig.personalizationPricing[type])}
                  </button>
                ))}
              </div>

              <input
                value={personalizationText}
                onChange={(event) =>
                  handlePersonalizationChange(
                    event.target.value
                  )
                }
                maxLength={20}
                placeholder="Emma"
                className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 bg-white"
                aria-label="Bottle personalization text"
              />

              <p className="text-xs text-stone-400 mt-2">
                {personalizationText.length}/20 characters.
                Text appears live on bottle preview.
              </p>
            </div>

            {/* Order Summary */}
            <div className="mb-6 rounded-2xl border border-stone-100 bg-stone-50 p-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle
                  size={16}
                  className="text-amber-600"
                />

                <p className="font-semibold text-stone-800 text-sm">
                  Order Summary
                </p>
              </div>

              {[
                ["Product Name", product.name],
                ["Bottle Size", selectedSize],
                ["Quantity", quantity],
                [
                  "Bottle Personalization",
                  personalizationText.trim() ||
                    "No personalization",
                ],
                [
                  "Unit Price",
                  formatPrice(totals.unitPrice ?? 0),
                ],
                [
                  "Personalization Charge",
                  formatPrice(totals.personalizationCharge),
                ],
                [
                  "Shipping",
                  formatPrice(totals.shipping),
                ],
                ["GST", formatPrice(totals.gst)],
                [
                  "Discount",
                  `-${formatPrice(totals.discount)}`,
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-4 border-b border-stone-200/70 py-2 text-sm last:border-0"
                >
                  <span className="text-stone-500">
                    {label}
                  </span>

                  <span className="text-right font-semibold text-stone-800">
                    {value}
                  </span>
                </div>
              ))}

              <div className="flex justify-between gap-4 pt-3 text-lg font-bold text-stone-900">
                <span>Grand Total</span>

                <span>
                  {formatPrice(totals.grandTotal)}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <Button
                onClick={handleCheckoutNow}
                variant="primary"
                size="lg"
                className="flex-1"
                aria-label="Add to Cart"
              >
                <ShoppingBag size={18} />
                <span>Add to Cart</span>
              </Button>

            </div>

            {/* Wishlist & Share */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => {
                  toggleWishlist(product.id);

                  toast(
                    wishlisted
                      ? "Removed from wishlist"
                      : "❤️ Added to wishlist"
                  );
                }}
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-full border transition-all ${
                  wishlisted
                    ? "border-red-300 text-red-500 bg-red-50"
                    : "border-stone-200 text-stone-600 hover:border-red-300 hover:text-red-500"
                }`}
                aria-label="Add to wishlist"
              >
                <Heart
                  size={16}
                  fill={
                    wishlisted ? "currentColor" : "none"
                  }
                />

                {wishlisted
                  ? "Wishlisted"
                  : "Add to Wishlist"}
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    window.location.href
                  );

                  toast.success("Link copied!");
                }}
                className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-full border border-stone-200 text-stone-600 hover:border-amber-300 transition-colors"
                aria-label="Share product"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>

            {/* Delivery info */}
            <div className="bg-stone-50 rounded-2xl p-4 space-y-2.5">
              {[
                {
                  icon: Truck,
                  text: "Free delivery on orders above ₹999",
                },
                {
                  icon: RotateCcw,
                  text: "7-day hassle-free return policy",
                },
                {
                  icon: Shield,
                  text: "100% authentic. Backed by our guarantee.",
                },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2.5 text-sm text-stone-600"
                >
                  <Icon
                    size={16}
                    className="text-amber-600 flex-shrink-0"
                  />

                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-1 border-b border-stone-200 mb-8">
            {(["notes", "details", "reviews"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-amber-600 text-amber-600"
                      : "border-transparent text-stone-500 hover:text-stone-800"
                  }`}
                  aria-selected={activeTab === tab}
                  role="tab"
                >
                  {tab === "notes"
                    ? "Fragrance Notes"
                    : tab === "details"
                      ? "Details"
                      : "Reviews"}
                </button>
              )
            )}
          </div>

          {/* Fragrance Notes */}
          {activeTab === "notes" && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {mainAccords.map((accord) => (
                  <span
                    key={accord}
                    className="rounded-full bg-[#fff7ed] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#bf4800]"
                  >
                    {accord}
                  </span>
                ))}
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  {
                    label: "TOP NOTES",
                    notes:
                      product.notes?.top ??
                      product.topNotes,
                    emoji: "🌿",
                    desc: "First impression (0–30 min)",
                  },
                  {
                    label: "HEART NOTES",
                    notes:
                      product.notes?.heart ??
                      product.heartNotes,
                    emoji: "🌸",
                    desc: "The soul (30 min – 4 hrs)",
                  },
                  {
                    label: "BASE NOTES",
                    notes:
                      product.notes?.base ??
                      product.baseNotes,
                    emoji: "🌳",
                    desc: "Long-lasting signature",
                  },
                ].map((group) => (
                  <div
                    key={group.label}
                    className="note-badge rounded-2xl p-5"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">
                        {group.emoji}
                      </span>

                      <div>
                        <h3 className="font-bold text-stone-800">
                          {group.label}
                        </h3>

                        <p className="text-xs text-stone-400">
                          {group.desc}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {group.notes.map((note) => (
                        <span
                          key={note}
                          className="bg-white border border-stone-200 text-stone-700 text-xs font-medium px-3 py-1 rounded-full"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Details */}
          {activeTab === "details" && (
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                {[
                  {
                    label: "Brand",
                    value: product.brand,
                  },
                  {
                    label: "Gender",
                    value: product.gender,
                  },
                  {
                    label: "Fragrance Family",
                    value:
                      fragranceFamilies.join(" / ") ||
                      product.fragranceFamily,
                  },
                  {
                    label: "Longevity",
                    value: product.longevity,
                  },
                  {
                    label: "Projection",
                    value: product.projection,
                  },
                  {
                    label: "Best Season",
                    value: product.season.join(", "),
                  },
                  {
                    label: "Best Occasion",
                    value: product.occasion.join(", "),
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex gap-3"
                  >
                    <span className="text-stone-400 text-sm w-36 flex-shrink-0">
                      {row.label}
                    </span>

                    <span className="text-stone-800 text-sm font-medium">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-bold text-stone-800 mb-3">
                  Description
                </h3>

                <p className="text-stone-600 leading-relaxed text-sm">
                  {product.description}
                </p>

                <h3 className="font-bold text-stone-800 mt-5 mb-3">
                  Ingredients
                </h3>

                <p className="text-stone-500 text-xs leading-relaxed">
                  {product.ingredients}
                </p>
              </div>
            </div>
          )}

          {/* Dynamic Supabase Reviews */}
          {activeTab === "reviews" && (
            <div>
              <ProductReviews productId={product.id} />

              {/* FAQ */}
              <div className="mt-10">
                <h3 className="font-bold text-stone-800 text-lg mb-4">
                  Common Questions
                </h3>

                {faqItems.map((item, i) => (
                  <div
                    key={i}
                    className="border-b border-stone-100 py-4"
                  >
                    <button
                      className="flex items-center justify-between w-full text-left font-semibold text-stone-800 text-sm"
                      onClick={() =>
                        setExpandedFaq(
                          expandedFaq === i ? null : i
                        )
                      }
                      aria-expanded={expandedFaq === i}
                    >
                      {item.q}

                      {expandedFaq === i ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>

                    {expandedFaq === i && (
                      <p className="text-stone-500 text-sm mt-2 leading-relaxed">
                        {item.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

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