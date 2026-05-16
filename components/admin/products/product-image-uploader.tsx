"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import type { ProductFormImage } from "@/components/admin/products/product-form-types";

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

export function ProductImageUploader({
  images,
  disabled = false,
  onChange,
  onError,
}: ProductImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      onError("Please choose an image file");
      return;
    }

    setIsUploading(true);
    try {
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

      onChange([
        ...images,
        {
          url: result.url,
          publicId: result.publicId,
          altText: "",
        },
      ]);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="grid grid-cols-4 gap-3">
      {images.map((image, index) => (
        <div
          key={image.publicId}
          className="relative aspect-square rounded-lg overflow-hidden group bg-muted"
        >
          <Image src={image.url} alt={image.altText || "Product image"} fill className="object-cover" />
          {index === 0 && (
            <span
              className="absolute top-1 left-1 text-[9px] font-label font-bold px-1.5 py-0.5 rounded text-white"
              style={{ background: "var(--brand-primary)" }}
            >
              Primary
            </span>
          )}
          <button
            type="button"
            onClick={() =>
              onChange(images.filter((item) => item.publicId !== image.publicId))
            }
            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove product image"
          >
            <X size={12} />
          </button>
        </div>
      ))}

      <label
        className={`relative aspect-square rounded-lg border-2 border-dashed border-border hover:border-[var(--brand-primary)] flex flex-col items-center justify-center gap-1.5 transition-colors text-muted-foreground hover:text-[var(--brand-primary)] ${
          disabled || isUploading ? "pointer-events-none opacity-60" : "cursor-pointer"
        }`}
      >
        {isUploading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : images.length === 0 ? (
          <ImageIcon size={20} />
        ) : (
          <Upload size={20} />
        )}
        <span className="text-[10px] font-label">
          {isUploading ? "Uploading" : "Upload"}
        </span>
        <input
          type="file"
          accept="image/*"
          disabled={disabled || isUploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void uploadFile(file);
          }}
          className="absolute inset-0 opacity-0"
          aria-label="Upload product image"
        />
      </label>
    </div>
  );
}
