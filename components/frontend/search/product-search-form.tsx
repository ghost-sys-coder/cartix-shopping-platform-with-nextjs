import { Search } from "lucide-react";

interface ProductSearchFormProps {
  query: string;
}

export function ProductSearchForm({ query }: ProductSearchFormProps) {
  return (
    <form action="/search" className="mb-8 max-w-2xl">
      <label htmlFor="storefront-search" className="sr-only">
        Search products
      </label>
      <div className="flex overflow-hidden rounded-[var(--radius-auth)] border border-border bg-card shadow-sm">
        <div className="flex w-12 items-center justify-center text-muted-foreground">
          <Search size={18} />
        </div>
        <input
          id="storefront-search"
          name="q"
          defaultValue={query}
          placeholder="Search products"
          className="min-w-0 flex-1 bg-transparent py-3 pr-4 text-sm font-body outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="px-5 text-sm font-label font-semibold text-white transition-colors"
          style={{ background: "var(--brand-primary)" }}
        >
          Search
        </button>
      </div>
    </form>
  );
}
