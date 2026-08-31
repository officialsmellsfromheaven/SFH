"use client";
import { Star } from "lucide-react";

type Props = {
  rating: number;
  size?: number;
  showNumber?: boolean;
  reviewCount?: number;
};

export default function StarRating({
  rating,
  size = 16,
  showNumber = false,
  reviewCount,
}: Props) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : star - 0.5 <= rating
              ? "fill-amber-200 text-amber-400"
              : "fill-gray-200 text-gray-300"
          }
        />
      ))}
      {showNumber && (
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="text-gray-400 ml-1">({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
}
