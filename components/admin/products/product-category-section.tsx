"use client";

import type {
  ProductCategoryOption,
  ProductFormState,
} from "@/components/admin/products/product-form-types";

interface ProductCategorySectionProps {
  categories: ProductCategoryOption[];
  form: ProductFormState;
  onChange: (field: keyof ProductFormState, value: string | boolean) => void;
}

export function ProductCategorySection({
  categories,
  form,
  onChange,
}: ProductCategorySectionProps) {
  return (
    <section className="p-5 rounded-[var(--radius-auth)] border border-border bg-card">
      <h2 className="font-headline font-bold mb-4">Category</h2>
      <select
        value={form.categoryId}
        onChange={(event) => onChange("categoryId", event.target.value)}
        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none"
      >
        <option value="">No category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.parentId ? "- " : ""}
            {category.name}
          </option>
        ))}
      </select>
    </section>
  );
}
