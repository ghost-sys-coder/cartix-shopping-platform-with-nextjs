"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { HomeCategory } from "@/lib/home/home-data";
import { fadeUp, stagger } from "@/components/frontend/home/home-motion";

interface HomeCategoryShowcaseProps {
  categories: HomeCategory[];
}

export function HomeCategoryShowcase({
  categories,
}: HomeCategoryShowcaseProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="text-center mb-12"
        >
          <motion.p
            variants={fadeUp}
            className="text-xs font-label font-bold uppercase tracking-widest mb-3"
            style={{ color: "var(--brand-primary)" }}
          >
            Browse by Category
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-4xl font-headline font-black tracking-tight"
          >
            Shop What You Love
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {categories.map(({ id, name, slug, imageUrl, productCount }) => (
            <motion.div key={id} variants={fadeUp}>
              <Link
                href={`/categories/${slug}`}
                className="group relative block rounded-[var(--radius-auth)] overflow-hidden aspect-square"
              >
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <h3 className="font-headline font-bold text-white text-lg leading-tight">
                    {name}
                  </h3>
                  <p className="text-white/70 text-xs font-label mt-0.5">
                    {productCount} products
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
