"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Grid3X3, List, SlidersHorizontal, X } from "lucide-react";
import {
  CATALOG_SORT_OPTIONS,
  type CatalogFilters,
  type CatalogSort,
} from "@/lib/products/product-catalog-shared";
import type { ProductViewMode } from "@/components/frontend/products/product-shop-page";

interface ProductShopToolbarProps {
  filters: CatalogFilters;
  view: ProductViewMode;
  filtersOpen: boolean;
  onViewChange: (view: ProductViewMode) => void;
  onToggleFilters: () => void;
}

export function ProductShopToolbar({
  filters,
  view,
  filtersOpen,
  onViewChange,
  onToggleFilters,
}: ProductShopToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateSort(sort: CatalogSort) {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
      <button
        type="button"
        onClick={onToggleFilters}
        className="md:hidden flex items-center gap-2 text-sm font-label font-medium px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
      >
        {filtersOpen ? <X size={15} /> : <SlidersHorizontal size={15} />}
        Filters
      </button>

      <div className="flex items-center gap-2 ml-auto">
        <select
          value={filters.sort}
          onChange={(event) => updateSort(event.target.value as CatalogSort)}
          className="text-sm font-label border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          aria-label="Sort products"
        >
          {CATALOG_SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        <div className="flex border border-border rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            className={`p-2 transition-colors ${
              view === "grid"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground"
            }`}
            aria-label="Grid view"
          >
            <Grid3X3 size={15} />
          </button>
          <button
            type="button"
            onClick={() => onViewChange("list")}
            className={`p-2 transition-colors ${
              view === "list"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-muted-foreground"
            }`}
            aria-label="List view"
          >
            <List size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
