"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductBasicInfoSection } from "@/components/admin/products/product-basic-info-section";
import { ProductCategorySection } from "@/components/admin/products/product-category-section";
import {
  EMPTY_PRODUCT_FORM,
  type ProductCategoryOption,
  type ProductFormImage,
  type ProductFormState,
} from "@/components/admin/products/product-form-types";
import { ProductInventorySection } from "@/components/admin/products/product-inventory-section";
import { ProductJsonImportSection } from "@/components/admin/products/product-json-import-section";
import { ProductMediaSection } from "@/components/admin/products/product-media-section";
import { ProductPricingSection } from "@/components/admin/products/product-pricing-section";
import { ProductSeoSection } from "@/components/admin/products/product-seo-section";
import { ProductStatusSection } from "@/components/admin/products/product-status-section";
import { slugifyProductName } from "@/lib/products/product-input";

interface ProductCreateFormProps {
  categories: ProductCategoryOption[];
  productId?: number;
  initialForm?: ProductFormState;
  initialImages?: ProductFormImage[];
}

function productPayloadFromForm(
  form: ProductFormState,
  images: ProductFormImage[]
) {
  return {
    ...form,
    images,
  };
}

export function ProductCreateForm({
  categories,
  productId,
  initialForm = EMPTY_PRODUCT_FORM,
  initialImages = [],
}: ProductCreateFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormState>(initialForm);
  const [images, setImages] = useState<ProductFormImage[]>(initialImages);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(Boolean(productId));
  const isEditing = Boolean(productId);

  function updateForm(field: keyof ProductFormState, value: string | boolean) {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "name" && typeof value === "string" && !slugEdited) {
        next.slug = slugifyProductName(value);
      }
      return next;
    });

    if (field === "slug") {
      setSlugEdited(true);
    }
  }

  async function saveProduct() {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(
        isEditing ? `/api/products/${productId}` : "/api/products",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productPayloadFromForm(form, images)),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
            (isEditing ? "Failed to update product" : "Failed to create product")
        );
      }

      toast.success(isEditing ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : isEditing
            ? "Failed to update product"
            : "Failed to create product"
      );
    } finally {
      setIsSaving(false);
    }
  }

  function importProduct(values: {
    form: ProductFormState;
    images: ProductFormImage[];
  }) {
    setForm(values.form);
    setImages(values.images);
    setSlugEdited(Boolean(values.form.slug));
    setError(null);
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground"
          >
            <ChevronLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-headline font-black tracking-tight">
              {isEditing ? "Edit Product" : "Create Product"}
            </h1>
            <p className="text-muted-foreground text-sm font-body mt-0.5">
              {isEditing
                ? "Update product details"
                : "Add a product to your catalog"}
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={saveProduct}
          disabled={isSaving}
          className="btn-brand flex items-center gap-2 px-5 py-2 text-sm disabled:opacity-60"
        >
          {isSaving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          {isEditing ? "Save Changes" : "Create Product"}
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {!isEditing && (
            <ProductJsonImportSection
              onImport={importProduct}
              onError={setError}
            />
          )}
          <ProductBasicInfoSection form={form} onChange={updateForm} />
          <ProductMediaSection
            images={images}
            isSaving={isSaving}
            onChange={setImages}
            onError={setError}
          />
          <ProductPricingSection form={form} onChange={updateForm} />
          <ProductSeoSection form={form} onChange={updateForm} />
        </div>

        <div className="space-y-5">
          <ProductStatusSection form={form} onChange={updateForm} />
          <ProductCategorySection
            categories={categories}
            form={form}
            onChange={updateForm}
          />
          <ProductInventorySection form={form} onChange={updateForm} />
        </div>
      </div>
    </div>
  );
}
