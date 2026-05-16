import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ProductDetailProduct } from "@/lib/products/product-detail-shared";

interface ProductBreadcrumbsProps {
  product: ProductDetailProduct;
}

export function ProductBreadcrumbs({ product }: ProductBreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground font-label mb-8">
      <Link href="/" className="hover:text-foreground transition-colors">
        Home
      </Link>
      <ChevronRight size={14} />
      <Link href="/products" className="hover:text-foreground transition-colors">
        Products
      </Link>
      {product.category && (
        <>
          <ChevronRight size={14} />
          <Link
            href={`/products?category=${product.category.slug}`}
            className="hover:text-foreground transition-colors"
          >
            {product.category.name}
          </Link>
        </>
      )}
      <ChevronRight size={14} />
      <span className="min-w-0 truncate text-foreground font-medium">
        {product.name}
      </span>
    </nav>
  );
}
