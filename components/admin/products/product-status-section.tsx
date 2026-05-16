"use client";

import type { ProductStatus } from "@/lib/products/product-input";
import type { ProductFormState } from "@/components/admin/products/product-form-types";

interface ProductStatusSectionProps {
  form: ProductFormState;
  onChange: (field: keyof ProductFormState, value: string | boolean) => void;
}

const PRODUCT_STATUSES: ProductStatus[] = ["draft", "active", "archived"];

export function ProductStatusSection({
  form,
  onChange,
}: ProductStatusSectionProps) {
  return (
    <section className="p-5 rounded-[var(--radius-auth)] border border-border bg-card">
      <h2 className="font-headline font-bold mb-4">Product Status</h2>
      <select
        value={form.status}
        onChange={(event) => onChange("status", event.target.value)}
        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none"
      >
        {PRODUCT_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-2.5 mt-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isFeatured}
          onChange={(event) => onChange("isFeatured", event.target.checked)}
          className="rounded accent-[var(--brand-primary)]"
        />
        <span className="text-sm font-label font-medium">Featured product</span>
      </label>
    </section>
  );
}
