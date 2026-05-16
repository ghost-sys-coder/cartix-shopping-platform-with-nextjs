"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { StorefrontCategoryGroup } from "@/lib/categories/category-catalog-shared";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

interface CategoryCardProps {
  category: StorefrontCategoryGroup;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <motion.article
      variants={cardVariants}
      className="group overflow-hidden rounded-[var(--radius-auth)] border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <Link href={`/products?category=${category.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <h3 className="text-xl font-headline font-black leading-tight">
              {category.name}
            </h3>
            <p className="mt-1 text-xs font-label text-white/75">
              {category.productCount}{" "}
              {category.productCount === 1 ? "product" : "products"}
            </p>
          </div>
        </div>

        <div className="p-5">
          <p className="min-h-10 text-sm text-muted-foreground font-body leading-relaxed line-clamp-2">
            {category.description ??
              "Explore curated products selected for this category."}
          </p>

          {category.children.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {category.children.slice(0, 4).map((child) => (
                <span
                  key={child.id}
                  className="rounded-[var(--radius)] bg-muted px-2.5 py-1 text-xs font-label font-semibold text-muted-foreground"
                >
                  {child.name}
                </span>
              ))}
              {category.children.length > 4 && (
                <span className="rounded-[var(--radius)] bg-muted px-2.5 py-1 text-xs font-label font-semibold text-muted-foreground">
                  +{category.children.length - 4} more
                </span>
              )}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between text-sm font-label font-semibold">
            <span style={{ color: "var(--brand-primary)" }}>
              Shop category
            </span>
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
              style={{ color: "var(--brand-primary)" }}
            />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
