import { Layers3 } from "lucide-react";
import Link from "next/link";

export function CategoriesEmptyState() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="rounded-[var(--radius-auth)] border border-border bg-card px-6 py-16 text-center">
        <div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
          style={{
            background: "var(--brand-primary-container)",
            color: "var(--brand-primary)",
          }}
        >
          <Layers3 size={22} />
        </div>
        <h1 className="mt-5 text-3xl font-headline font-black tracking-tight">
          No categories yet
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground font-body leading-relaxed">
          Active categories will appear here once they are added in the admin
          catalog.
        </p>
        <Link
          href="/products"
          className="btn-brand mt-7 inline-flex px-6 py-3 text-sm"
        >
          Browse Products
        </Link>
      </div>
    </section>
  );
}
