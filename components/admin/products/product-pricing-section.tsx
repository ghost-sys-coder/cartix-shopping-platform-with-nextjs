"use client";

import { ProductField } from "@/components/admin/products/product-field";
import type { ProductFormState } from "@/components/admin/products/product-form-types";

interface ProductPricingSectionProps {
  form: ProductFormState;
  onChange: (field: keyof ProductFormState, value: string | boolean) => void;
}

export function ProductPricingSection({
  form,
  onChange,
}: ProductPricingSectionProps) {
  const price = Number(form.price);
  const cost = Number(form.costPrice);
  const margin =
    Number.isFinite(price) && price > 0 && Number.isFinite(cost)
      ? (((price - cost) / price) * 100).toFixed(1)
      : null;

  return (
    <section className="p-5 rounded-[var(--radius-auth)] border border-border bg-card">
      <h2 className="font-headline font-bold mb-4">Pricing</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <ProductField
          label="Sale Price ($)"
          value={form.price}
          onChange={(value) => onChange("price", value)}
          type="number"
        />
        <ProductField
          label="Compare At Price ($)"
          value={form.compareAtPrice}
          onChange={(value) => onChange("compareAtPrice", value)}
          type="number"
        />
        <ProductField
          label="Cost Per Item ($)"
          value={form.costPrice}
          onChange={(value) => onChange("costPrice", value)}
          type="number"
        />
      </div>
      {margin && (
        <div className="mt-3 text-xs font-label text-muted-foreground">
          Margin: <span className="font-bold text-green-600">{margin}%</span>
        </div>
      )}
    </section>
  );
}
