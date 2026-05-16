"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { fadeUp, stagger } from "@/components/frontend/home/home-motion";

const HERO_STATS = [
  { value: "50K+", label: "Customers" },
  { value: "4.9", label: "Rating" },
  { value: "200+", label: "Brands" },
];

export function HomeHeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 auth-bg -z-10" />
      <div
        className="absolute inset-y-0 right-0 w-1/2 -z-10 opacity-30"
        style={{ background: "var(--brand-gradient)" }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid md:grid-cols-2 gap-12 items-center py-20">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="space-y-6"
        >
          <motion.div variants={fadeUp}>
            <span
              className="inline-flex items-center gap-2 text-xs font-label font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
              style={{
                background: "var(--brand-primary-container)",
                color: "var(--brand-primary)",
              }}
            >
              <Zap size={12} />
              New Season Collection
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-7xl font-headline font-black leading-[0.95] tracking-tight"
          >
            Velocity
            <br />
            <span style={{ color: "var(--brand-primary)" }}>Meets</span>
            <br />
            Vision.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-lg text-muted-foreground font-body max-w-md leading-relaxed"
          >
            Discover the finest products curated for those who move fast and
            think bold. Premium quality, delivered to your door.
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center gap-4">
            <Link
              href="/products"
              className="btn-brand px-7 py-3.5 text-base flex items-center gap-2"
            >
              Shop Now
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/categories"
              className="px-7 py-3.5 text-base font-label font-semibold rounded-[var(--radius)] border border-border hover:bg-muted transition-colors"
            >
              Browse Categories
            </Link>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="flex items-center gap-6 pt-2"
          >
            {HERO_STATS.map(({ value, label }) => (
              <div key={label}>
                <div
                  className="font-headline font-black text-2xl"
                  style={{ color: "var(--brand-primary)" }}
                >
                  {value}
                </div>
                <div className="text-xs font-label text-muted-foreground">
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" as const, delay: 0.2 }}
          className="hidden md:block relative"
        >
          <div className="relative aspect-square max-w-lg ml-auto">
            <div
              className="absolute inset-0 rounded-[var(--radius-auth)] opacity-20"
              style={{ background: "var(--brand-gradient)" }}
            />
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700"
              alt="Curated retail collection"
              fill
              className="object-cover rounded-[var(--radius-auth)]"
              priority
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut" as const,
              }}
              className="absolute -bottom-6 -left-6 glass-panel rounded-2xl px-5 py-3.5 shadow-xl border border-border"
            >
              <div className="text-xs font-label text-muted-foreground">
                Today&apos;s Deal
              </div>
              <div
                className="font-headline font-bold text-lg"
                style={{ color: "var(--brand-primary)" }}
              >
                Up to 40% OFF
              </div>
              <div className="text-xs font-body text-muted-foreground">
                on selected items
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
