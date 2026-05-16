"use client";

import { ProductField } from "@/components/admin/products/product-field";
import type { ProductFormState } from "@/components/admin/products/product-form-types";

interface ProductInventorySectionProps {
  form: ProductFormState;
  onChange: (field: keyof ProductFormState, value: string | boolean) => void;
}

export function ProductInventorySection({
  form,
  onChange,
}: ProductInventorySectionProps) {
  return (
    <section className="p-5 rounded-[var(--radius-auth)] border border-border bg-card space-y-4">
      <h2 className="font-headline font-bold">Inventory</h2>
      <ProductField
        label="SKU"
        value={form.sku}
        onChange={(value) => onChange("sku", value)}
      />
      <ProductField
        label="Barcode"
        value={form.barcode}
        onChange={(value) => onChange("barcode", value)}
      />
      <ProductField
        label="Stock Quantity"
        value={form.stock}
        onChange={(value) => onChange("stock", value)}
        type="number"
      />
      <ProductField
        label="Low Stock Threshold"
        value={form.lowStockThreshold}
        onChange={(value) => onChange("lowStockThreshold", value)}
        type="number"
      />
      <ProductField
        label="Weight"
        value={form.weight}
        onChange={(value) => onChange("weight", value)}
        type="number"
      />
    </section>
  );
}
