"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, ImageIcon, Loader2, Upload, X } from "lucide-react";
import { ProductImagePreviewModal } from "@/components/admin/products/product-image-preview-modal";
import type { ProductFormImage } from "@/components/admin/products/product-form-types";
import { mergeUniqueProductImages } from "@/lib/products/product-images";

interface ProductImageUploaderProps {
  images: ProductFormImage[];
  disabled?: boolean;
  onChange: (images: ProductFormImage[]) => void;
  onError: (message: string) => void;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read image file"));
      }
    };
    reader.onerror = () => reject(new Error("Could not read image file"));
    reader.readAsDataURL(file);
  });
}

async function deleteUploadedImage(publicId: string) {
  await fetch("/api/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publicId }),
  });
}

function isFulfilledResult<T>(
  result: PromiseSettledResult<T>
): result is PromiseFulfilledResult<T> {
  return result.status === "fulfilled";
}

function isRejectedResult<T>(
  result: PromiseSettledResult<T>
): result is PromiseRejectedResult {
  return result.status === "rejected";
}

export function ProductImageUploader({
  images,
  disabled = false,
  onChange,
  onError,
}: ProductImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [deletingPublicId, setDeletingPublicId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<ProductFormImage | null>(
    null
  );

  async function uploadFile(file: File): Promise<ProductFormImage> {
    if (!file.type.startsWith("image/")) {
      throw new Error(`${file.name} is not an image file`);
    }

    const data = await readFileAsDataUrl(file);
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, folder: "products" }),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error ?? "Image upload failed");
    }

    return {
      url: result.url,
      publicId: result.publicId,
      altText: "",
    };
  }

  async function uploadFiles(files: File[]) {
    if (files.length === 0) return;

    const invalidFile = files.find((file) => !file.type.startsWith("image/"));
    if (invalidFile) {
      onError(`${invalidFile.name} is not an image file`);
      return;
    }

    setIsUploading(true);
    try {
      const results = await Promise.allSettled(files.map(uploadFile));
      const uploadedImages = results
        .filter(isFulfilledResult)
        .map((result) => result.value);
      const failedResult = results.find(isRejectedResult);

      if (failedResult) {
        await Promise.all(
          uploadedImages.map((image) => deleteUploadedImage(image.publicId))
        );
        throw failedResult.reason;
      }

      const seenPublicIds = new Set(images.map((image) => image.publicId));
      const duplicateUploads = uploadedImages.filter((image) => {
        if (seenPublicIds.has(image.publicId)) return true;
        seenPublicIds.add(image.publicId);
        return false;
      });
      const nextImages = mergeUniqueProductImages(images, uploadedImages);

      await Promise.all(
        duplicateUploads.map((image) => deleteUploadedImage(image.publicId))
      );
      onChange(nextImages);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  async function removeImage(image: ProductFormImage) {
    setDeletingPublicId(image.publicId);
    try {
      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId: image.publicId }),
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.error ?? "Image delete failed");
      }

      onChange(images.filter((item) => item.publicId !== image.publicId));
      if (previewImage?.publicId === image.publicId) setPreviewImage(null);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Image delete failed");
    } finally {
      setDeletingPublicId(null);
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={image.publicId}
            className="group relative aspect-square overflow-hidden rounded-lg bg-muted"
          >
            <Image
              src={image.url}
              alt={image.altText || "Product image"}
              fill
              className="object-cover"
            />
            {index === 0 && (
              <span
                className="absolute left-1 top-1 rounded px-1.5 py-0.5 text-[9px] font-label font-bold text-white"
                style={{ background: "var(--brand-primary)" }}
              >
                Primary
              </span>
            )}
            <div className="absolute right-1 top-1 flex gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => setPreviewImage(image)}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Preview product image"
              >
                <Eye size={12} />
              </button>
              <button
                type="button"
                onClick={() => void removeImage(image)}
                disabled={disabled || deletingPublicId === image.publicId}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-60"
                aria-label="Remove product image"
              >
                {deletingPublicId === image.publicId ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <X size={12} />
                )}
              </button>
            </div>
          </div>
        ))}

        <label
          className={`relative flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] ${
            disabled || isUploading
              ? "pointer-events-none opacity-60"
              : "cursor-pointer"
          }`}
        >
          {isUploading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : images.length === 0 ? (
            <ImageIcon size={20} />
          ) : (
            <Upload size={20} />
          )}
          <span className="text-center text-[10px] font-label">
            {isUploading ? "Uploading" : "Upload images"}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={disabled || isUploading}
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              event.target.value = "";
              void uploadFiles(files);
            }}
            className="absolute inset-0 opacity-0"
            aria-label="Upload product images"
          />
        </label>
      </div>

      {images.length > 0 && (
        <p className="mt-2 text-xs text-muted-foreground font-body">
          Use the preview icon to inspect images. The first image is used as the
          primary storefront image.
        </p>
      )}

      <ProductImagePreviewModal
        image={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </>
  );
}
