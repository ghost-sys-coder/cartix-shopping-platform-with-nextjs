import type { ProductSearchData } from "@/lib/search/product-search-shared";
import { ProductSearchEmptyState } from "@/components/frontend/search/product-search-empty-state";
import { ProductSearchForm } from "@/components/frontend/search/product-search-form";
import { ProductSearchResults } from "@/components/frontend/search/product-search-results";

interface ProductSearchPageProps {
  search: ProductSearchData;
}

export function ProductSearchPage({ search }: ProductSearchPageProps) {
  const hasQuery = search.query.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-black tracking-tight">
          Search
        </h1>
        <p className="mt-1 text-sm text-muted-foreground font-body">
          {hasQuery
            ? `${search.resultCount} ${search.resultCount === 1 ? "result" : "results"} for "${search.query}"`
            : "Find products by name, category, SKU, tags, or features."}
        </p>
      </div>

      <ProductSearchForm query={search.query} />

      {!hasQuery || search.results.length === 0 ? (
        <ProductSearchEmptyState hasQuery={hasQuery} />
      ) : (
        <ProductSearchResults products={search.results} />
      )}
    </div>
  );
}
