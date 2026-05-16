import { Check } from "lucide-react";
import type { ProductDetailProduct } from "@/lib/products/product-detail-shared";

interface ProductDescriptionSectionProps {
  product: ProductDetailProduct;
}

export function ProductDescriptionSection({
  product,
}: ProductDescriptionSectionProps) {
  const hasFeatures = product.keyFeatures.length > 0;
  const hasTags = product.tags.length > 0;

  if (!product.description && !hasFeatures && !hasTags) return null;

  return (
    <section className="mb-16 grid gap-10 lg:grid-cols-[1fr_0.8fr]">
      <div>
        <h2 className="mb-4 text-xl font-headline font-bold">Description</h2>
        <p className="text-muted-foreground font-body leading-relaxed">
          {product.description ||
            product.shortDescription ||
            "Product details will be available soon."}
        </p>
      </div>

      <div className="space-y-8">
        {hasFeatures && (
          <div>
            <h2 className="mb-4 text-xl font-headline font-bold">
              Key Features
            </h2>
            <ul className="space-y-2.5">
              {product.keyFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 text-sm font-body"
                >
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ background: "var(--brand-primary)" }}
                  >
                    <Check size={12} />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasTags && (
          <div>
            <h2 className="mb-4 text-xl font-headline font-bold">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[var(--radius)] bg-muted px-3 py-1.5 text-xs font-label font-semibold text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
