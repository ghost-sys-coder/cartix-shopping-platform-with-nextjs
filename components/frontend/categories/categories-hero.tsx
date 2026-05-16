"use client";

import { motion } from "framer-motion";
import { ArrowRight, Layers3, PackageSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { StorefrontCategory } from "@/lib/categories/category-catalog-shared";

interface CategoriesHeroProps {
  featuredCategories: StorefrontCategory[];
  totalCategories: number;
  totalProducts: number;
}

export function CategoriesHero({
  featuredCategories,
  totalCategories,
  totalProducts,
}: CategoriesHeroProps) {
  const heroCategory = featuredCategories[0];
  const supportingCategories = featuredCategories.slice(1, 3);

  return (
    <section className="border-b border-border bg-[var(--brand-surface-container-low)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl"
          >
            <h1 className="text-4xl sm:text-5xl font-headline font-black tracking-tight leading-tight">
              Browse Categories
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground font-body leading-relaxed">
              Start with a collection, then narrow the shop by category,
              pricing, ratings, and sale items.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-[var(--radius)] border border-border bg-card px-4 py-2.5">
                <Layers3 size={17} style={{ color: "var(--brand-primary)" }} />
                <span className="text-sm font-label font-semibold">
                  {totalCategories} categories
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-[var(--radius)] border border-border bg-card px-4 py-2.5">
                <PackageSearch
                  size={17}
                  style={{ color: "var(--brand-primary)" }}
                />
                <span className="text-sm font-label font-semibold">
                  {totalProducts} active products
                </span>
              </div>
            </div>

            <Link
              href="/products"
              className="btn-brand mt-8 inline-flex items-center gap-2 px-6 py-3 text-sm"
            >
              View All Products
              <ArrowRight size={17} />
            </Link>
          </motion.div>

          {heroCategory && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid sm:grid-cols-[1.3fr_0.8fr] gap-4"
            >
              <Link
                href={`/products?category=${heroCategory.slug}`}
                className="group relative min-h-[340px] overflow-hidden rounded-[var(--radius-auth)] bg-muted"
              >
                <Image
                  src={heroCategory.imageUrl}
                  alt={heroCategory.name}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs font-label font-semibold uppercase tracking-widest text-white/75">
                    Featured
                  </p>
                  <h2 className="mt-1 text-2xl font-headline font-black">
                    {heroCategory.name}
                  </h2>
                  <p className="mt-1 text-sm font-body text-white/75">
                    {heroCategory.productCount}{" "}
                    {heroCategory.productCount === 1 ? "product" : "products"}
                  </p>
                </div>
              </Link>

              <div className="grid gap-4">
                {supportingCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="group relative min-h-[160px] overflow-hidden rounded-[var(--radius-auth)] bg-muted"
                  >
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                      <h3 className="font-headline font-bold leading-tight">
                        {category.name}
                      </h3>
                      <p className="mt-0.5 text-xs font-body text-white/75">
                        {category.productCount} products
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
