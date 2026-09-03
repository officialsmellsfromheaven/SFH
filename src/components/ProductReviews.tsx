"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Check, ImagePlus, Loader2, Star, X } from "lucide-react";
import toast from "react-hot-toast";

import StarRating from "@/components/ui/StarRating";
import {
  calculateAverageRating,
  getProductReviews,
  submitProductReview,
  validateReviewPhotoFile,
  type ProductReview,
} from "@/lib/supabase/reviews";

type ProductReviewsProps = {
  productId: string;
};

type SelectedReviewPhoto = {
  id: string;
  file: File;
  url: string;
};

export default function ProductReviews({
  productId,
}: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lightbox, setLightbox] = useState<{
    reviewId: string;
    index: number;
  } | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState<SelectedReviewPhoto[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const selectedPhotosRef = useRef<SelectedReviewPhoto[]>([]);

  const averageRating = useMemo(
    () => calculateAverageRating(reviews),
    [reviews]
  );

  useEffect(() => {
    selectedPhotosRef.current = selectedPhotos;
  }, [selectedPhotos]);

  useEffect(() => {
    return () => {
      selectedPhotosRef.current.forEach((photo) =>
        URL.revokeObjectURL(photo.url)
      );
    };
  }, []);

  useEffect(() => {
    if (!lightbox) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightbox(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [lightbox]);

  const loadReviews = useCallback(async () => {
    setLoading(true);

    const data = await getProductReviews(productId);

    setReviews(data);
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadReviews();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadReviews]);

  const clearSelectedPhotos = () => {
    setSelectedPhotos((currentPhotos) => {
      currentPhotos.forEach((photo) => URL.revokeObjectURL(photo.url));
      return [];
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePhotoSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const incomingFiles = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (incomingFiles.length === 0) {
      return;
    }

    const validFiles: File[] = [];

    for (const file of incomingFiles) {
      const validationError = validateReviewPhotoFile(file);

      if (validationError) {
        if (validationError === "Only JPG, PNG, and WEBP images are allowed.") {
          toast.error("Only JPG, PNG, and WEBP images are allowed.");
        } else {
          toast.error("Each photo must be 5 MB or smaller.");
        }
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      return;
    }

    const currentCount = selectedPhotosRef.current.length;
    const availableSlots = 3 - currentCount;

    if (availableSlots <= 0) {
      toast.error("You can upload up to 3 photos.");
      return;
    }

    const filesToAdd = validFiles.slice(0, availableSlots);

    if (filesToAdd.length < validFiles.length) {
      toast.error("You can upload up to 3 photos.");
    }

    const nextPhotos = filesToAdd.map((file) => ({
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setSelectedPhotos((currentPhotos) => [...currentPhotos, ...nextPhotos]);
  };

  const handleRemovePhoto = (id: string) => {
    setSelectedPhotos((currentPhotos) => {
      const photoToRemove = currentPhotos.find((photo) => photo.id === id);

      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.url);
      }

      return currentPhotos.filter((photo) => photo.id !== id);
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!customerName.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a review.");
      return;
    }

    setSubmitting(true);

    const result = await submitProductReview({
      productId,
      customerName,
      rating,
      comment,
      photos: selectedPhotos.map((photo) => photo.file),
    });

    setSubmitting(false);

    if (!result.success || !result.review) {
      toast.error(result.error || "Unable to submit review.");
      return;
    }

    setReviews((current) => [result.review!, ...current]);

    setCustomerName("");
    setRating(0);
    setHoverRating(0);
    setComment("");
    clearSelectedPhotos();

    toast.success("Thank you! Your review has been added.");
  };

  const activeLightboxReview = lightbox
    ? reviews.find((review) => review.id === lightbox.reviewId) ?? null
    : null;
  const activeLightboxPhotos = activeLightboxReview?.photos ?? [];
  const activeLightboxIndex = lightbox ? lightbox.index : 0;
  const activeLightboxPhoto =
    activeLightboxPhotos[activeLightboxIndex] ?? activeLightboxPhotos[0] ?? null;

  const showPreviousLightboxPhoto = () => {
    if (!activeLightboxReview || activeLightboxPhotos.length <= 1) {
      return;
    }

    const nextIndex =
      activeLightboxIndex === 0
        ? activeLightboxPhotos.length - 1
        : activeLightboxIndex - 1;

    setLightbox({ reviewId: activeLightboxReview.id, index: nextIndex });
  };

  const showNextLightboxPhoto = () => {
    if (!activeLightboxReview || activeLightboxPhotos.length <= 1) {
      return;
    }

    const nextIndex =
      activeLightboxIndex === activeLightboxPhotos.length - 1
        ? 0
        : activeLightboxIndex + 1;

    setLightbox({ reviewId: activeLightboxReview.id, index: nextIndex });
  };

  return (
    <div className="space-y-10">
      {/* Review Summary */}
      <div className="rounded-3xl border border-stone-200 bg-stone-50 p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
          <div className="text-center sm:border-r sm:border-stone-200 sm:pr-6">
            <p className="text-4xl font-bold text-stone-900">
              {reviews.length > 0 ? averageRating.toFixed(1) : "—"}
            </p>

            {reviews.length > 0 ? (
              <div className="mt-2 flex justify-center">
                <StarRating rating={averageRating} size={18} />
              </div>
            ) : (
              <p className="mt-2 text-sm text-stone-400">
                No ratings yet
              </p>
            )}

            <p className="mt-2 text-sm text-stone-500">
              {reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"}
            </p>
          </div>

          <div>
            <h3 className="font-[var(--font-playfair)] text-2xl font-bold text-stone-900">
              What fragrance lovers say
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone-500">
              Real feedback from customers who have shared their experience
              with this fragrance.
            </p>
          </div>
        </div>
      </div>

      {/* Write Review */}
      <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h3 className="font-[var(--font-playfair)] text-2xl font-bold text-stone-900">
            Share your experience
          </h3>

          <p className="mt-1 text-sm text-stone-500">
            Tell others what you think about this fragrance.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label
              htmlFor="review-name"
              className="mb-2 block text-sm font-semibold text-stone-700"
            >
              Your Name
            </label>

            <input
              id="review-name"
              type="text"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              maxLength={60}
              placeholder="Enter your name"
              disabled={submitting}
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Rating */}
          <div>
            <p className="mb-2 text-sm font-semibold text-stone-700">
              Your Rating
            </p>

            <div
              className="flex items-center gap-1"
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((value) => {
                const active = value <= (hoverRating || rating);

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    onMouseEnter={() => setHoverRating(value)}
                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    disabled={submitting}
                    className="rounded-md p-1 transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Star
                      size={25}
                      className={
                        active
                          ? "fill-amber-500 text-amber-500"
                          : "text-stone-300"
                      }
                    />
                  </button>
                );
              })}

              {rating > 0 && (
                <span className="ml-2 text-sm font-medium text-stone-500">
                  {rating}/5
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label
              htmlFor="review-comment"
              className="mb-2 block text-sm font-semibold text-stone-700"
            >
              Your Review
            </label>

            <textarea
              id="review-comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              maxLength={1000}
              rows={5}
              placeholder="How does the fragrance feel, smell, or perform?"
              disabled={submitting}
              className="w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <p className="mt-1 text-right text-xs text-stone-400">
              {comment.length}/1000
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label
                htmlFor="review-photo-upload"
                className="block text-sm font-semibold text-stone-700"
              >
                Add Photos (Optional)
              </label>

              <span className="text-xs text-stone-500">
                {selectedPhotos.length} / 3 photos
              </span>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="review-photo-upload"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-300 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ImagePlus size={16} />
                + Add Photos
              </label>

              <input
                ref={fileInputRef}
                id="review-photo-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={submitting}
                onChange={handlePhotoSelection}
                className="sr-only"
              />

              {selectedPhotos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 sm:max-w-md">
                  {selectedPhotos.map((photo, index) => (
                    <div key={photo.id} className="relative">
                      <img
                        src={photo.url}
                        alt={`Selected review photo ${index + 1}`}
                        className="h-20 w-full rounded-lg border border-stone-200 object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo.id)}
                        disabled={submitting}
                        aria-label={`Remove selected photo ${index + 1}`}
                        className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-stone-900 text-white shadow-sm transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {selectedPhotos.length > 0 ? "Uploading..." : "Submitting..."}
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-[var(--font-playfair)] text-2xl font-bold text-stone-900">
            Customer Reviews
          </h3>

          {!loading && reviews.length > 0 && (
            <span className="text-sm text-stone-400">
              {reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-stone-400">
            <Loader2 size={24} className="animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-200 py-14 text-center">
            <Star size={38} className="mx-auto mb-3 text-amber-400" />

            <p className="font-semibold text-stone-700">
              No reviews yet
            </p>

            <p className="mt-1 text-sm text-stone-400">
              Be the first to share your experience.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-2xl bg-stone-50 p-5 sm:p-6"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-700">
                      {review.customer_name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold text-stone-800">
                        {review.customer_name}
                      </p>

                      <p className="text-xs text-stone-400">
                        {new Date(
                          review.created_at
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {review.is_verified_purchase && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                      <Check size={13} />
                      Verified Purchase
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <StarRating rating={review.rating} size={15} />
                </div>

                <p className="mt-3 text-sm leading-relaxed text-stone-600">
                  {review.comment}
                </p>

                {review.photos.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {review.photos.map((photo, index) => (
                      <button
                        key={photo.id}
                        type="button"
                        onClick={() => setLightbox({ reviewId: review.id, index })}
                        aria-label={`Open photo ${index + 1} for ${review.customer_name}`}
                        className="group relative overflow-hidden rounded-xl border border-stone-200 bg-stone-100 text-left focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <img
                          src={photo.public_url}
                          alt={`${review.customer_name} review photo ${index + 1}`}
                          loading="lazy"
                          className="h-28 w-full object-cover transition duration-200 group-hover:scale-[1.02] sm:h-32"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      {lightbox && activeLightboxReview && activeLightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/75 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Review photo viewer"
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Close image viewer"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-stone-900/80 text-white transition hover:bg-stone-900"
            >
              <X size={16} />
            </button>

            <div className="max-h-[80vh] overflow-hidden bg-stone-100 p-3 sm:p-4">
              <img
                src={activeLightboxPhoto.public_url}
                alt={`${activeLightboxReview.customer_name} review photo ${activeLightboxIndex + 1}`}
                className="max-h-[70vh] w-full rounded-xl object-contain"
              />
            </div>

            {activeLightboxPhotos.length > 1 && (
              <div className="flex items-center justify-between gap-3 border-t border-stone-200 bg-white px-4 py-3">
                <button
                  type="button"
                  onClick={showPreviousLightboxPhoto}
                  aria-label="Previous photo"
                  className="rounded-full border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                >
                  Previous
                </button>

                <span className="text-xs font-medium text-stone-500">
                  {activeLightboxIndex + 1} / {activeLightboxPhotos.length}
                </span>

                <button
                  type="button"
                  onClick={showNextLightboxPhoto}
                  aria-label="Next photo"
                  className="rounded-full border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}