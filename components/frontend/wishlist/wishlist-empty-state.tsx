import { Heart } from "lucide-react";
import Link from "next/link";

export function WishlistEmptyState() {
  return (
    <section className="rounded-[var(--radius-auth)] border border-border bg-card px-6 py-16 text-center">
      <div
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          background: "var(--brand-primary-container)",
          color: "var(--brand-primary)",
        }}
      >
        <Heart size={22} />
      </div>
      <h2 className="mt-5 text-2xl font-headline font-black tracking-tight">
        No saved products yet
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground font-body leading-relaxed">
        Save products from the shop and come back when you are ready to buy.
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
