"use client";

import { ProductField } from "@/components/admin/products/product-field";
import type { ProductFormState } from "@/components/admin/products/product-form-types";

interface ProductBasicInfoSectionProps {
  form: ProductFormState;
  onChange: (field: keyof ProductFormState, value: string | boolean) => void;
}

export function ProductBasicInfoSection({
  form,
  onChange,
}: ProductBasicInfoSectionProps) {
  return (
    <section className="p-5 rounded-[var(--radius-auth)] border border-border bg-card space-y-4">
      <h2 className="font-headline font-bold">Basic Information</h2>
      <ProductField
        label="Product Name"
        value={form.name}
        onChange={(value) => onChange("name", value)}
        placeholder="Enter product name"
      />
      <ProductField
        label="Slug / URL Handle"
        value={form.slug}
        onChange={(value) => onChange("slug", value)}
        placeholder="product-slug"
      />
      <ProductField
        label="Short Description"
        value={form.shortDescription}
        onChange={(value) => onChange("shortDescription", value)}
        placeholder="One-line summary"
      />
      <div>
        <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(event) => onChange("description", event.target.value)}
          rows={5}
          className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-body resize-none"
        />
      </div>
      <ProductField
        label="Tags (comma separated)"
        value={form.tags}
        onChange={(value) => onChange("tags", value)}
        placeholder="headphones, wireless, audio"
      />
    </section>
  );
}
