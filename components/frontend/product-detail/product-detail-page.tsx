import type { ProductDetailData } from "@/lib/products/product-detail-shared";
import { ProductBreadcrumbs } from "@/components/frontend/product-detail/product-breadcrumbs";
import { ProductDescriptionSection } from "@/components/frontend/product-detail/product-description-section";
import { ProductImageGallery } from "@/components/frontend/product-detail/product-image-gallery";
import { ProductRelatedProducts } from "@/components/frontend/product-detail/product-related-products";
import { ProductSummaryPanel } from "@/components/frontend/product-detail/product-summary-panel";

interface ProductDetailPageProps {
  detail: ProductDetailData;
}

export function ProductDetailPage({ detail }: ProductDetailPageProps) {
  const { product, relatedProducts } = detail;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <ProductBreadcrumbs product={product} />

      <section className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-12 mb-16">
        <ProductImageGallery images={product.images} productName={product.name} />
        <ProductSummaryPanel product={product} />
      </section>

      <ProductDescriptionSection product={product} />
      <ProductRelatedProducts products={relatedProducts} />
    </div>
  );
}
