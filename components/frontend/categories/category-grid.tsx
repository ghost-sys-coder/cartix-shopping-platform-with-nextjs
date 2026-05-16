"use client";

import { motion } from "framer-motion";
import type { StorefrontCategoryGroup } from "@/lib/categories/category-catalog-shared";
import { CategoryCard } from "@/components/frontend/categories/category-card";

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

interface CategoryGridProps {
  categories: StorefrontCategoryGroup[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-headline font-black tracking-tight">
            All Categories
          </h2>
          <p className="mt-1 text-sm text-muted-foreground font-body">
            Choose a category to open the shop with matching filters applied.
          </p>
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={gridVariants}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </motion.div>
    </section>
  );
}
