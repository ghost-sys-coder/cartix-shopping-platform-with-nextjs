"use client";

import Image from "next/image";
import { X } from "lucide-react";
import type { ProductFormImage } from "@/components/admin/products/product-form-types";

interface ProductImagePreviewModalProps {
  image: ProductFormImage | null;
  onClose: () => void;
}

export function ProductImagePreviewModal({
  image,
  onClose,
}: ProductImagePreviewModalProps) {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Product image preview"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-[var(--radius-auth)] bg-card shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
          aria-label="Close image preview"
        >
          <X size={18} />
        </button>
        <div className="relative h-[78vh] min-h-[360px] bg-black">
          <Image
            src={image.url}
            alt={image.altText || "Product image preview"}
            fill
            className="object-contain"
            sizes="90vw"
          />
        </div>
        <div className="border-t border-border px-4 py-3">
          <p className="truncate text-sm font-label font-semibold">
            {image.altText || image.publicId}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground font-body">
            {image.publicId}
          </p>
        </div>
      </div>
    </div>
  );
}
