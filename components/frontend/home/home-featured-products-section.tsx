"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/frontend/product-card";
import type { HomeProduct } from "@/lib/home/home-data";
import { fadeUp, stagger } from "@/components/frontend/home/home-motion";

interface HomeFeaturedProductsSectionProps {
  products: HomeProduct[];
}

export function HomeFeaturedProductsSection({
  products,
}: HomeFeaturedProductsSectionProps) {
  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <motion.p
              variants={fadeUp}
              className="text-xs font-label font-bold uppercase tracking-widest mb-3"
              style={{ color: "var(--brand-primary)" }}
            >
              Featured
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-headline font-black tracking-tight"
            >
              Best Sellers
            </motion.h2>
          </div>
          <motion.div variants={fadeUp}>
            <Link
              href="/products"
              className="flex items-center gap-1.5 text-sm font-label font-semibold hover:gap-3 transition-all"
              style={{ color: "var(--brand-primary)" }}
            >
              View all <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>

        {products.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-5"
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={fadeUp}>
                <ProductCard {...product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="rounded-[var(--radius-auth)] border border-border bg-background px-5 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              No active products are ready for the storefront yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
