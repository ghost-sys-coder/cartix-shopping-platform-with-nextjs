"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { ProductDetailImage } from "@/lib/products/product-detail-shared";

interface ProductImageGalleryProps {
  images: ProductDetailImage[];
  productName: string;
}

export function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="space-y-4">
      <motion.div
        key={activeImage.url}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="relative aspect-square overflow-hidden rounded-[var(--radius-auth)] bg-muted"
      >
        <Image
          src={activeImage.url}
          alt={activeImage.altText || productName}
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.id || image.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-[var(--radius)] border-2 transition-colors ${
                activeIndex === index
                  ? "border-[var(--brand-primary)]"
                  : "border-border hover:border-muted-foreground"
              }`}
              aria-label={`View ${productName} image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
