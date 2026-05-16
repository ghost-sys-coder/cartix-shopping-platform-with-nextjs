import { ProductCard } from "@/components/frontend/product-card";
import type { ProductSearchResult } from "@/lib/search/product-search-shared";

interface ProductSearchResultsProps {
  products: ProductSearchResult[];
}

export function ProductSearchResults({ products }: ProductSearchResultsProps) {
  return (
    <section className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </section>
  );
}
