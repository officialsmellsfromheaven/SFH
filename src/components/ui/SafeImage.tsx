"use client";

import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/data";

type Props = ImageProps & { fallback?: string };

export default function SafeImage({ fallback = FALLBACK_PRODUCT_IMAGE, src, onError, ...props }: Props) {
  const [currentSrc, setCurrentSrc] = useState<ImageProps["src"]>(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const nextSrc = typeof currentSrc === "string" ? currentSrc : "";

    if (nextSrc === fallback) {
      onError?.(event as never);
      return;
    }

    const failedUrl = event.currentTarget.currentSrc || event.currentTarget.src || nextSrc;
    if (failedUrl) {
      console.warn("Product image failed to load. Falling back to placeholder.", failedUrl);
    }

    setCurrentSrc(fallback);
    onError?.(event as never);
  };

  return <Image {...props} src={currentSrc} alt={props.alt ?? ""} onError={handleError} />;
}
