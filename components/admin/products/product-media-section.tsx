"use client";

import { ProductImageUploader } from "@/components/admin/products/product-image-uploader";
import type { ProductFormImage } from "@/components/admin/products/product-form-types";

interface ProductMediaSectionProps {
  images: ProductFormImage[];
  isSaving: boolean;
  onChange: (images: ProductFormImage[]) => void;
  onError: (message: string) => void;
}

export function ProductMediaSection({
  images,
  isSaving,
  onChange,
  onError,
}: ProductMediaSectionProps) {
  return (
    <section className="p-5 rounded-[var(--radius-auth)] border border-border bg-card">
      <h2 className="font-headline font-bold mb-4">Product Images</h2>
      <ProductImageUploader
        images={images}
        disabled={isSaving}
        onChange={onChange}
        onError={onError}
      />
      <p className="text-xs text-muted-foreground font-body mt-3">
        Images are uploaded to Cloudinary and saved with this product.
      </p>
    </section>
  );
}
