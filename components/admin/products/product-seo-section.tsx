"use client";

import { ProductField } from "@/components/admin/products/product-field";
import type { ProductFormState } from "@/components/admin/products/product-form-types";

interface ProductSeoSectionProps {
  form: ProductFormState;
  onChange: (field: keyof ProductFormState, value: string | boolean) => void;
}

export function ProductSeoSection({ form, onChange }: ProductSeoSectionProps) {
  return (
    <section className="p-5 rounded-[var(--radius-auth)] border border-border bg-card space-y-4">
      <h2 className="font-headline font-bold">SEO</h2>
      <ProductField
        label="Meta Title"
        value={form.metaTitle}
        onChange={(value) => onChange("metaTitle", value)}
      />
      <div>
        <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">
          Meta Description
        </label>
        <textarea
          value={form.metaDescription}
          onChange={(event) => onChange("metaDescription", event.target.value)}
          rows={3}
          className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-body resize-none"
        />
      </div>
    </section>
  );
}
