"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, Grid3X3, List, X } from "lucide-react";
import { ProductCard } from "@/components/frontend/product-card";

const MOCK_PRODUCTS = [
  { id: 1, name: "Premium Wireless Headphones", slug: "premium-wireless-headphones", price: 249.99, compareAtPrice: 349.99, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", rating: 4.8, reviewCount: 124, badge: "Best Seller" },
  { id: 2, name: "Minimalist Leather Watch", slug: "minimalist-leather-watch", price: 189.00, imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600", rating: 4.9, reviewCount: 87 },
  { id: 3, name: "Smart Fitness Tracker", slug: "smart-fitness-tracker", price: 99.00, compareAtPrice: 149.00, imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600", rating: 4.6, reviewCount: 203, badge: "Sale" },
  { id: 4, name: "Portable Bluetooth Speaker", slug: "portable-bluetooth-speaker", price: 79.99, imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600", rating: 4.7, reviewCount: 56 },
  { id: 5, name: "Mechanical Keyboard", slug: "mechanical-keyboard", price: 159.00, imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600", rating: 4.5, reviewCount: 89 },
  { id: 6, name: "Ergonomic Mouse", slug: "ergonomic-mouse", price: 69.99, compareAtPrice: 89.99, imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600", rating: 4.4, reviewCount: 42 },
  { id: 7, name: "USB-C Hub", slug: "usbc-hub", price: 49.99, imageUrl: "https://images.unsplash.com/photo-1593640408182-31c228b3b30e?w=600", rating: 4.3, reviewCount: 67 },
  { id: 8, name: "Laptop Stand", slug: "laptop-stand", price: 39.99, imageUrl: "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=600", rating: 4.6, reviewCount: 31 },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "bestsellers", label: "Best Sellers" },
  { value: "rating", label: "Top Rated" },
];

export default function ProductsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-headline font-black tracking-tight">All Products</h1>
        <p className="text-muted-foreground font-body mt-1">{MOCK_PRODUCTS.length} products found</p>
      </motion.div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className={`${filtersOpen ? "block" : "hidden"} md:block w-64 shrink-0`}>
          <div className="sticky top-24 space-y-6">
            {/* Categories filter */}
            <div>
              <h3 className="font-label font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-3">Categories</h3>
              <div className="space-y-2">
                {["All", "Electronics", "Fashion", "Home & Living", "Sports"].map((cat) => (
                  <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" className="rounded accent-[var(--brand-primary)]" defaultChecked={cat === "All"} />
                    <span className="text-sm font-body group-hover:text-foreground text-muted-foreground transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-border" />

            {/* Price filter */}
            <div>
              <h3 className="font-label font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-3">Price Range</h3>
              <div className="flex items-center gap-2 text-sm font-label">
                <span>${priceRange[0]}</span>
                <span className="text-muted-foreground">—</span>
                <span>${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1000}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full mt-3 accent-[var(--brand-primary)]"
              />
            </div>

            <div className="h-px bg-border" />

            {/* Rating filter */}
            <div>
              <h3 className="font-label font-semibold text-sm uppercase tracking-widest text-muted-foreground mb-3">Minimum Rating</h3>
              <div className="space-y-2">
                {[4, 3, 2].map((r) => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="rating" className="accent-[var(--brand-primary)]" />
                    <span className="text-sm font-body text-muted-foreground">{r}★ & above</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="md:hidden flex items-center gap-2 text-sm font-label font-medium px-3 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              {filtersOpen ? <X size={15} /> : <SlidersHorizontal size={15} />}
              Filters
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-sm font-label border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {SORT_OPTIONS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>

              <div className="flex border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 transition-colors ${view === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
                >
                  <Grid3X3 size={15} />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 transition-colors ${view === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Grid */}
          <motion.div
            layout
            className={`grid gap-5 ${view === "grid" ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"}`}
          >
            {MOCK_PRODUCTS.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-12">
            {[1, 2, 3, "...", 8].map((page, i) => (
              <button
                key={i}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-label font-medium transition-colors ${
                  page === 1
                    ? "text-white"
                    : "border border-border hover:bg-muted text-muted-foreground"
                }`}
                style={page === 1 ? { background: "var(--brand-primary)" } : {}}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
