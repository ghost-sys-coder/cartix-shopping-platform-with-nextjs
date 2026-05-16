import { ProductCard } from "@/components/frontend/product-card";
import type { RelatedProduct } from "@/lib/products/product-detail-shared";

interface ProductRelatedProductsProps {
  products: RelatedProduct[];
}

export function ProductRelatedProducts({
  products,
}: ProductRelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section>
      <h2 className="mb-8 text-2xl font-headline font-black tracking-tight">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
}
