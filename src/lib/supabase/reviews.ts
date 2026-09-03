import { createClient } from "./client";

export const MAX_REVIEW_PHOTOS = 3;
export const MAX_REVIEW_PHOTO_SIZE_BYTES = 5 * 1024 * 1024;
export const REVIEW_PHOTO_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type ReviewPhoto = {
  id: string;
  review_id: string;
  storage_path: string;
  public_url: string;
  display_order: number;
  created_at: string;
};

export type ProductReview = {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  is_verified_purchase: boolean;
  created_at: string;
  photos: ReviewPhoto[];
};

type ProductReviewRow = {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  is_verified_purchase: boolean;
  created_at: string;
};

type ReviewPhotoRow = {
  id: string;
  review_id: string;
  storage_path: string;
  public_url: string;
  display_order: number;
  created_at: string;
};

function mapReviewPhotos(
  rows: ReviewPhotoRow[] | null | undefined
): ReviewPhoto[] {
  return (rows ?? []).map((photo) => ({
    id: photo.id,
    review_id: photo.review_id,
    storage_path: photo.storage_path,
    public_url: photo.public_url,
    display_order: photo.display_order,
    created_at: photo.created_at,
  }));
}

function normalizeReview(
  review: ProductReviewRow,
  photos: ReviewPhoto[] = []
): ProductReview {
  return {
    ...review,
    photos: photos ?? [],
  };
}

export function validateReviewPhotoFile(file: File): string | null {
  if (!REVIEW_PHOTO_TYPES.includes(file.type as (typeof REVIEW_PHOTO_TYPES)[number])) {
    return "Only JPG, PNG, and WEBP images are allowed.";
  }

  if (file.size > MAX_REVIEW_PHOTO_SIZE_BYTES) {
    return "Each photo must be 5 MB or smaller.";
  }

  return null;
}

async function deleteUploadedReviewPhotos(
  storagePaths: string[]
): Promise<void> {
  if (storagePaths.length === 0) {
    return;
  }

  const supabase = createClient();

  const { error } = await supabase.storage
    .from("review-photos")
    .remove(storagePaths);

  if (error) {
    console.error("Error removing uploaded review photos:", error);
  }
}

async function deleteReviewById(reviewId: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("product_reviews")
    .delete()
    .eq("id", reviewId);

  if (error) {
    console.error("Error cleaning up review after photo failure:", error);
  }
}

/**
 * Get all approved reviews for a specific product.
 * The product ID is dynamic, so this works for every product.
 */
export async function getProductReviews(
  productId: string
): Promise<ProductReview[]> {
  const supabase = createClient();

  const { data: reviewRows, error: reviewsError } = await supabase
    .from("product_reviews")
    .select(
      "id, product_id, customer_name, rating, comment, is_approved, is_verified_purchase, created_at"
    )
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (reviewsError) {
    console.error("Error fetching product reviews:", reviewsError);
    return [];
  }

  const reviews = reviewRows ?? [];

  if (reviews.length === 0) {
    return [];
  }

  const reviewIds = reviews.map((review) => review.id);

  const { data: photoRows, error: photosError } = await supabase
    .from("review_photos")
    .select(
      "id, review_id, storage_path, public_url, display_order, created_at"
    )
    .in("review_id", reviewIds)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (photosError) {
    console.error("Error fetching review photos:", photosError);
    return reviews.map((review) => normalizeReview(review));
  }

  const photosByReview = new Map<string, ReviewPhoto[]>();

  for (const photo of mapReviewPhotos(photoRows as ReviewPhotoRow[] | null)) {
    const currentPhotos = photosByReview.get(photo.review_id) ?? [];
    currentPhotos.push(photo);
    photosByReview.set(photo.review_id, currentPhotos);
  }

  return reviews.map((review) =>
    normalizeReview(review, photosByReview.get(review.id) ?? [])
  );
}

/**
 * Submit a new review for a product.
 */
export async function submitProductReview({
  productId,
  customerName,
  rating,
  comment,
  photos = [],
}: {
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  photos?: File[];
}): Promise<{
  success: boolean;
  review?: ProductReview;
  error?: string;
}> {
  const supabase = createClient();

  const cleanName = customerName.trim();
  const cleanComment = comment.trim();

  if (!productId) {
    return {
      success: false,
      error: "Product ID is required.",
    };
  }

  if (cleanName.length < 2 || cleanName.length > 60) {
    return {
      success: false,
      error: "Name must be between 2 and 60 characters.",
    };
  }

  if (rating < 1 || rating > 5) {
    return {
      success: false,
      error: "Rating must be between 1 and 5.",
    };
  }

  if (cleanComment.length < 5 || cleanComment.length > 1000) {
    return {
      success: false,
      error: "Review must be between 5 and 1000 characters.",
    };
  }

  if (photos.length > MAX_REVIEW_PHOTOS) {
    return {
      success: false,
      error: "You can upload up to 3 photos.",
    };
  }

  for (const file of photos) {
    const validationError = validateReviewPhotoFile(file);

    if (validationError) {
      return {
        success: false,
        error: validationError,
      };
    }
  }

  const { data: insertedReview, error: reviewInsertError } = await supabase
    .from("product_reviews")
    .insert({
      product_id: productId,
      customer_name: cleanName,
      rating,
      comment: cleanComment,
      is_verified_purchase: false,
      is_approved: true,
    })
    .select(
      "id, product_id, customer_name, rating, comment, is_approved, is_verified_purchase, created_at"
    )
    .single();

  if (reviewInsertError || !insertedReview) {
    console.error("Error submitting product review:", reviewInsertError);

    return {
      success: false,
      error: reviewInsertError?.message || "Unable to submit review.",
    };
  }

  const reviewId = insertedReview.id;
  const uploadedStoragePaths: string[] = [];

  try {
    if (photos.length > 0) {
      const photoRows: Array<{
        review_id: string;
        storage_path: string;
        public_url: string;
        display_order: number;
      }> = [];

      for (let index = 0; index < photos.length; index += 1) {
        const file = photos[index];
        const safeFileName = (file.name || `photo-${index + 1}`)
          .normalize("NFKD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9._-]/g, "-")
          .replace(/-+/g, "-")
          .slice(0, 80)
          .replace(/^-+|-+$/g, "") || `photo-${index + 1}`;
        const uniqueId =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${index}`;
        const storagePath = `review-photos/${reviewId}/${uniqueId}-${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from("review-photos")
          .upload(storagePath, file, {
            contentType: file.type || "application/octet-stream",
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`photo_upload_failed:${uploadError.message}`);
        }

        uploadedStoragePaths.push(storagePath);

        const { data: publicUrlData } = supabase.storage
          .from("review-photos")
          .getPublicUrl(storagePath);

        if (!publicUrlData?.publicUrl) {
          throw new Error("photo_public_url_failed");
        }

        photoRows.push({
          review_id: reviewId,
          storage_path: storagePath,
          public_url: publicUrlData.publicUrl,
          display_order: index,
        });
      }

      const { error: photoInsertError } = await supabase
        .from("review_photos")
        .insert(photoRows);

      if (photoInsertError) {
        throw new Error(`photo_metadata_failed:${photoInsertError.message}`);
      }
    }

    const { data: savedPhotos, error: fetchPhotosError } = await supabase
      .from("review_photos")
      .select(
        "id, review_id, storage_path, public_url, display_order, created_at"
      )
      .eq("review_id", reviewId)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (fetchPhotosError) {
      throw new Error(`photo_fetch_failed:${fetchPhotosError.message}`);
    }

    return {
      success: true,
      review: normalizeReview(insertedReview, mapReviewPhotos(savedPhotos)),
    };
  } catch (photoError) {
    console.error("Error uploading review photos:", photoError);

    await deleteUploadedReviewPhotos(uploadedStoragePaths);
    await deleteReviewById(reviewId);

    return {
      success: false,
      error: "Unable to upload photos. Please try again.",
    };
  }
}

/**
 * Calculate the average rating from reviews.
 */
export function calculateAverageRating(
  reviews: ProductReview[]
): number {
  if (reviews.length === 0) {
    return 0;
  }

  const total = reviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );

  return Number((total / reviews.length).toFixed(1));
}
/**
 * Get the live rating summary for a product.
 * Rating and review count are calculated from approved Supabase reviews.
 */
export async function getProductReviewSummary(
  productId: string
): Promise<{
  averageRating: number;
  reviewCount: number;
}> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("product_reviews")
    .select("rating")
    .eq("product_id", productId)
    .eq("is_approved", true);

  if (error) {
    console.error(
      "Error fetching product review summary:",
      error
    );

    return {
      averageRating: 0,
      reviewCount: 0,
    };
  }

  const ratings = data ?? [];

  if (ratings.length === 0) {
    return {
      averageRating: 0,
      reviewCount: 0,
    };
  }

  const totalRating = ratings.reduce(
    (sum, review) => sum + Number(review.rating),
    0
  );

  const averageRating = Number(
    (totalRating / ratings.length).toFixed(1)
  );

  return {
    averageRating,
    reviewCount: ratings.length,
  };
}