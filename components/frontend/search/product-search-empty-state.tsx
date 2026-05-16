import { SearchX } from "lucide-react";
import Link from "next/link";

interface ProductSearchEmptyStateProps {
  hasQuery: boolean;
}

export function ProductSearchEmptyState({
  hasQuery,
}: ProductSearchEmptyStateProps) {
  return (
    <section className="rounded-[var(--radius-auth)] border border-border bg-card px-6 py-16 text-center">
      <div
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          background: "var(--brand-primary-container)",
          color: "var(--brand-primary)",
        }}
      >
        <SearchX size={22} />
      </div>
      <h2 className="mt-5 text-2xl font-headline font-black tracking-tight">
        {hasQuery ? "No matching products" : "Start with a search"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground font-body leading-relaxed">
        {hasQuery
          ? "Try another product name, category, SKU, tag, or feature."
          : "Search the catalog using product names, categories, SKUs, tags, and key features."}
      </p>
      <Link
        href="/products"
        className="btn-brand mt-7 inline-flex px-6 py-3 text-sm"
      >
        Browse Products
      </Link>
    </section>
  );
}
