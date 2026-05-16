"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Filter, MoreHorizontal, Plus, Search } from "lucide-react";
import { ProductTableRow } from "@/components/admin/products/product-table-row";
import type { AdminProductListItem } from "@/components/admin/products/product-list-types";

interface ProductListProps {
  products: AdminProductListItem[];
}

const STATUS_FILTERS = ["all", "active", "draft", "archived"] as const;

export function ProductList({ products }: ProductListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_FILTERS)[number]>("all");

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim();

    return products.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.sku?.toLowerCase().includes(normalizedSearch);
      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-headline font-black tracking-tight">
            Products
          </h1>
          <p className="text-muted-foreground text-sm font-body mt-1">
            {products.length} total products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-brand flex items-center gap-2 px-4 py-2.5 text-sm"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products or SKU..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-body"
          />
        </div>
        <div className="flex items-center gap-2">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-label font-semibold rounded-lg capitalize transition-colors ${
                statusFilter === status
                  ? "text-white"
                  : "border border-border text-muted-foreground hover:bg-muted"
              }`}
              style={
                statusFilter === status
                  ? { background: "var(--brand-primary)" }
                  : {}
              }
            >
              {status}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 h-9 px-3 text-sm font-label border border-border rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <Filter size={14} />
          Filters
        </button>
      </div>

      <div className="rounded-[var(--radius-auth)] border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {[
                  "Product",
                  "SKU",
                  "Category",
                  "Price",
                  "Stock",
                  "Sales",
                  "Status",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left text-[11px] font-label font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <ProductTableRow key={product.id} product={product} />
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
            <MoreHorizontal size={32} className="text-muted-foreground/40" />
            <p className="font-label font-semibold text-muted-foreground">
              No products found
            </p>
            <p className="text-xs text-muted-foreground font-body">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
