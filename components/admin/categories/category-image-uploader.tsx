"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryImageUploaderProps {
  imageUrl: string;
  disabled?: boolean;
  onChange: (imageUrl: string) => void;
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

export function CategoryImageUploader({
  imageUrl,
  disabled = false,
  onChange,
  onError,
}: CategoryImageUploaderProps) {
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
        body: JSON.stringify({ data, folder: "categories" }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Image upload failed");
      }

      onChange(result.url);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-label font-semibold text-muted-foreground">
        Category Image
      </label>

      <div className="relative h-32 overflow-hidden rounded-lg border border-border bg-muted">
        {imageUrl ? (
          <Image src={imageUrl} alt="Category preview" fill className="object-cover" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon size={22} />
            <span className="text-xs font-label">No image selected</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <label
          className={`relative inline-flex h-8 flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-secondary px-2.5 text-sm font-medium text-secondary-foreground transition-all hover:bg-secondary/80 ${
            disabled || isUploading ? "pointer-events-none opacity-50" : ""
          }`}
        >
          {isUploading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Upload size={14} />
          )}
          {isUploading ? "Uploading" : "Upload image"}
          <input
            type="file"
            accept="image/*"
            disabled={disabled || isUploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void uploadFile(file);
            }}
            className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
            aria-label="Upload category image"
          />
        </label>

        {imageUrl && (
          <Button
            type="button"
            variant="secondary"
            size="icon"
            disabled={disabled || isUploading}
            onClick={() => onChange("")}
            aria-label="Remove category image"
          >
            <X size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
