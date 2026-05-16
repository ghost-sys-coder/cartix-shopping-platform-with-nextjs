"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/frontend/product-card";
import type { CatalogProduct } from "@/lib/products/product-catalog-shared";
import type { ProductViewMode } from "@/components/frontend/products/product-shop-page";

interface ProductResultsGridProps {
  products: CatalogProduct[];
  view: ProductViewMode;
}

export function ProductResultsGrid({ products, view }: ProductResultsGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-[var(--radius-auth)] border border-border bg-card px-5 py-12 text-center">
        <h2 className="font-headline font-bold text-xl">No products found</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Adjust the filters to see more products.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className={`grid gap-5 ${
        view === "grid" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"
      }`}
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04 }}
        >
          <ProductCard {...product} />
        </motion.div>
      ))}
    </motion.div>
  );
}
