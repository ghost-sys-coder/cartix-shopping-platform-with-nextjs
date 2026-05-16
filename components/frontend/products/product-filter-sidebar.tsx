"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type {
  CatalogCategoryOption,
  CatalogFilters,
} from "@/lib/products/product-catalog-shared";

interface ProductFilterSidebarProps {
  categories: CatalogCategoryOption[];
  filters: CatalogFilters;
  maxPrice: number;
  isOpen: boolean;
}

const RATING_OPTIONS = [4, 3, 2];

export function ProductFilterSidebar({
  categories,
  filters,
  maxPrice,
  isOpen,
}: ProductFilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParams(
    updater: (params: URLSearchParams) => void,
    options: { scroll?: boolean } = { scroll: false }
  ) {
    const params = new URLSearchParams(searchParams.toString());
    updater(params);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, options);
  }

  function toggleCategory(slug: string, checked: boolean) {
    const nextCategories = new Set(filters.categories);
    if (checked) {
      nextCategories.add(slug);
    } else {
      nextCategories.delete(slug);
    }

    updateParams((params) => {
      params.delete("category");
      Array.from(nextCategories)
        .sort()
        .forEach((category) => params.append("category", category));
    });
  }

  function updateSingleParam(key: string, value: string | null) {
    updateParams((params) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
  }

  return (
    <aside className={`${isOpen ? "block" : "hidden"} md:block w-64 shrink-0`}>
      <div className="sticky top-24 space-y-6">
        <div>
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="font-label font-semibold text-sm uppercase tracking-widest text-muted-foreground">
              Categories
            </h2>
            <button
              type="button"
              onClick={() => router.push(pathname, { scroll: false })}
              className="text-xs font-label font-semibold text-[var(--brand-primary)] hover:underline"
            >
              Clear
            </button>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                className="rounded accent-[var(--brand-primary)]"
                checked={filters.categories.length === 0}
                onChange={() =>
                  updateParams((params) => params.delete("category"))
                }
              />
              <span className="text-sm font-body group-hover:text-foreground text-muted-foreground transition-colors">
                All
              </span>
            </label>
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center justify-between gap-2.5 cursor-pointer group"
              >
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    className="rounded accent-[var(--brand-primary)]"
                    checked={filters.categories.includes(category.slug)}
                    onChange={(event) =>
                      toggleCategory(category.slug, event.target.checked)
                    }
                  />
                  <span className="text-sm font-body group-hover:text-foreground text-muted-foreground transition-colors">
                    {category.name}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {category.productCount}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="h-px bg-border" />

        <div>
          <h2 className="font-label font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-3">
            Price Range
          </h2>
          <div className="flex items-center gap-2 text-sm font-label">
            <span>$0</span>
            <span className="text-muted-foreground">to</span>
            <span>${filters.priceMax}</span>
          </div>
          <input
            type="range"
            min={0}
            max={maxPrice}
            step={10}
            value={Math.min(filters.priceMax, maxPrice)}
            onChange={(event) =>
              updateSingleParam("priceMax", event.target.value)
            }
            className="w-full mt-3 accent-[var(--brand-primary)]"
          />
        </div>

        <div className="h-px bg-border" />

        <div>
          <h2 className="font-label font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-3">
            Minimum Rating
          </h2>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                className="accent-[var(--brand-primary)]"
                checked={filters.minRating === 0}
                onChange={() => updateSingleParam("rating", null)}
              />
              <span className="text-sm font-body text-muted-foreground">
                Any rating
              </span>
            </label>
            {RATING_OPTIONS.map((rating) => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="rating"
                  className="accent-[var(--brand-primary)]"
                  checked={filters.minRating === rating}
                  onChange={() => updateSingleParam("rating", rating.toString())}
                />
                <span className="text-sm font-body text-muted-foreground">
                  {rating}+ stars
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="h-px bg-border" />

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            className="rounded accent-[var(--brand-primary)]"
            checked={filters.saleOnly}
            onChange={(event) =>
              updateSingleParam("sale", event.target.checked ? "true" : null)
            }
          />
          <span className="text-sm font-body text-muted-foreground">
            Sale items only
          </span>
        </label>
      </div>
    </aside>
  );
}
