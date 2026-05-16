"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type {
  CatalogFilters,
  ProductCatalogData,
} from "@/lib/products/product-catalog-shared";
import { ProductFilterSidebar } from "@/components/frontend/products/product-filter-sidebar";
import { ProductResultsGrid } from "@/components/frontend/products/product-results-grid";
import { ProductShopToolbar } from "@/components/frontend/products/product-shop-toolbar";

export type ProductViewMode = "grid" | "list";

interface ProductShopPageProps {
  catalog: ProductCatalogData;
  filters: CatalogFilters;
}

export function ProductShopPage({ catalog, filters }: ProductShopPageProps) {
  const [view, setView] = useState<ProductViewMode>("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-headline font-black tracking-tight">
          All Products
        </h1>
        <p className="text-muted-foreground font-body mt-1">
          {catalog.productCount}{" "}
          {catalog.productCount === 1 ? "product" : "products"} found
        </p>
      </motion.div>

      <div className="flex gap-8">
        <ProductFilterSidebar
          categories={catalog.categories}
          filters={filters}
          maxPrice={catalog.maxPrice}
          isOpen={filtersOpen}
        />

        <div className="flex-1 min-w-0">
          <ProductShopToolbar
            filters={filters}
            view={view}
            filtersOpen={filtersOpen}
            onViewChange={setView}
            onToggleFilters={() => setFiltersOpen((current) => !current)}
          />
          <ProductResultsGrid products={catalog.products} view={view} />
        </div>
      </div>
    </div>
  );
}
