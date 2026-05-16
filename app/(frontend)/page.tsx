"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Shield, RefreshCw, Headphones } from "lucide-react";
import { ProductCard } from "@/components/frontend/product-card";

/* ── Mock data (replace with real DB queries) ─────────────────────── */
const FEATURED_PRODUCTS = [
  {
    id: 1, name: "Premium Wireless Headphones", slug: "premium-wireless-headphones",
    price: 249.99, compareAtPrice: 349.99,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    rating: 4.8, reviewCount: 124, badge: "Best Seller",
  },
  {
    id: 2, name: "Minimalist Leather Watch", slug: "minimalist-leather-watch",
    price: 189.00, compareAtPrice: undefined,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    rating: 4.9, reviewCount: 87,
  },
  {
    id: 3, name: "Smart Fitness Tracker", slug: "smart-fitness-tracker",
    price: 99.00, compareAtPrice: 149.00,
    imageUrl: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600",
    rating: 4.6, reviewCount: 203, badge: "Sale",
  },
  {
    id: 4, name: "Portable Bluetooth Speaker", slug: "portable-bluetooth-speaker",
    price: 79.99, compareAtPrice: undefined,
    imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600",
    rating: 4.7, reviewCount: 56,
  },
];

const CATEGORIES = [
  { name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400", count: 145 },
  { name: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400", count: 230 },
  { name: "Home & Living", slug: "home-living", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", count: 98 },
  { name: "Sports", slug: "sports", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400", count: 76 },
];

const FEATURES = [
  { icon: Zap, title: "Fast Delivery", desc: "Express shipping in 24–48 hours" },
  { icon: Shield, title: "Secure Payment", desc: "256-bit SSL encryption on all orders" },
  { icon: RefreshCw, title: "Free Returns", desc: "30-day hassle-free return policy" },
  { icon: Headphones, title: "24/7 Support", desc: "Round-the-clock customer service" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
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
              <Link href="/products" className="btn-brand px-7 py-3.5 text-base flex items-center gap-2">
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

            <motion.div variants={fadeUp} className="flex items-center gap-6 pt-2">
              {[
                { value: "50K+", label: "Customers" },
                { value: "4.9★", label: "Rating" },
                { value: "200+", label: "Brands" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="font-headline font-black text-2xl" style={{ color: "var(--brand-primary)" }}>{value}</div>
                  <div className="text-xs font-label text-muted-foreground">{label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero image */}
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
                alt="Hero"
                fill
                className="object-cover rounded-[var(--radius-auth)]"
                priority
              />
              {/* Floating card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" as const }}
                className="absolute -bottom-6 -left-6 glass-panel rounded-2xl px-5 py-3.5 shadow-xl border border-border"
              >
                <div className="text-xs font-label text-muted-foreground">Today&apos;s Deal</div>
                <div className="font-headline font-bold text-lg" style={{ color: "var(--brand-primary)" }}>Up to 40% OFF</div>
                <div className="text-xs font-body text-muted-foreground">on selected items</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center gap-3 p-4"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--brand-primary-container)" }}
                >
                  <Icon size={22} style={{ color: "var(--brand-primary)" }} />
                </div>
                <div>
                  <h3 className="font-label font-semibold text-sm">{title}</h3>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} className="text-xs font-label font-bold uppercase tracking-widest mb-3" style={{ color: "var(--brand-primary)" }}>
              Browse by Category
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-headline font-black tracking-tight">
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
            {CATEGORIES.map(({ name, slug, image, count }) => (
              <motion.div key={slug} variants={fadeUp}>
                <Link
                  href={`/categories/${slug}`}
                  className="group relative block rounded-[var(--radius-auth)] overflow-hidden aspect-square"
                >
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="font-headline font-bold text-white text-lg leading-tight">{name}</h3>
                    <p className="text-white/70 text-xs font-label mt-0.5">{count} products</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ─────────────────────────────────────────── */}
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
              <motion.p variants={fadeUp} className="text-xs font-label font-bold uppercase tracking-widest mb-3" style={{ color: "var(--brand-primary)" }}>
                Featured
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl font-headline font-black tracking-tight">
                Best Sellers
              </motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link href="/products" className="flex items-center gap-1.5 text-sm font-label font-semibold hover:gap-3 transition-all" style={{ color: "var(--brand-primary)" }}>
                View all <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-5"
          >
            {FEATURED_PRODUCTS.map((product) => (
              <motion.div key={product.id} variants={fadeUp}>
                <ProductCard {...product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROMO BANNER ──────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-[var(--radius-auth)] overflow-hidden p-12 md:p-16 text-center"
            style={{ background: "var(--brand-gradient)" }}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/30" />
              <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-white/20" />
            </div>
            <div className="relative">
              <p className="text-white/80 text-sm font-label font-semibold uppercase tracking-widest mb-3">
                Limited Time Offer
              </p>
              <h2 className="text-5xl font-headline font-black text-white mb-4">
                Get 20% OFF
              </h2>
              <p className="text-white/80 font-body text-lg mb-8 max-w-lg mx-auto">
                Use code <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded font-label">CARTIX20</span> at checkout
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
    </div>
  );
}
