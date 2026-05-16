"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HomePromoBanner() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[var(--radius-auth)] overflow-hidden p-12 md:p-16 text-center"
          style={{ background: "var(--brand-gradient)" }}
        >
          <div className="relative">
            <p className="text-white/80 text-sm font-label font-semibold uppercase tracking-widest mb-3">
              Limited Time Offer
            </p>
            <h2 className="text-5xl font-headline font-black text-white mb-4">
              Get 20% OFF
            </h2>
            <p className="text-white/80 font-body text-lg mb-8 max-w-lg mx-auto">
              Use code{" "}
              <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded font-label">
                CARTIX20
              </span>{" "}
              at checkout
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white rounded-[var(--radius)] text-sm font-label font-bold hover:bg-white/90 transition-colors"
              style={{ color: "var(--brand-primary)" }}
            >
              Shop the Sale
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
