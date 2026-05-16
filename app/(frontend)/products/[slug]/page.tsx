"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Share2, Star, ChevronRight, Minus, Plus, Truck, Shield, RefreshCw } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";
import { ProductCard } from "@/components/frontend/product-card";

/* Mock product - in production fetch from DB by slug */
const PRODUCT = {
  id: 1,
  name: "Premium Wireless Headphones",
  slug: "premium-wireless-headphones",
  price: 249.99,
  compareAtPrice: 349.99,
  description: "Experience audio like never before with our Premium Wireless Headphones. Featuring active noise cancellation, 40-hour battery life, and studio-quality sound, these headphones are engineered for those who refuse to compromise.",
  images: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
    "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800",
  ],
  rating: 4.8,
  reviewCount: 124,
  sku: "HP-WL-001",
  variants: [
    { id: 1, name: "Color", value: "Midnight Black", stock: 10 },
    { id: 2, name: "Color", value: "Glacier White", stock: 5 },
    { id: 3, name: "Color", value: "Cobalt Blue", stock: 8 },
  ],
  features: ["40-hour battery life", "Active noise cancellation", "Bluetooth 5.3", "Foldable design", "Built-in microphone"],
  category: "Electronics",
};

const RELATED = [
  { id: 4, name: "Portable Bluetooth Speaker", slug: "portable-bluetooth-speaker", price: 79.99, imageUrl: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600", rating: 4.7, reviewCount: 56 },
  { id: 5, name: "Mechanical Keyboard", slug: "mechanical-keyboard", price: 159.00, imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600", rating: 4.5, reviewCount: 89 },
  { id: 6, name: "Ergonomic Mouse", slug: "ergonomic-mouse", price: 69.99, compareAtPrice: 89.99, imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600", rating: 4.4, reviewCount: 42 },
];

export default function ProductDetailPage() {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  function handleAddToCart() {
    const variant = selectedVariant !== null
      ? { id: PRODUCT.variants[selectedVariant].id, name: PRODUCT.variants[selectedVariant].name, value: PRODUCT.variants[selectedVariant].value }
      : undefined;
    addItem({ id: PRODUCT.id, name: PRODUCT.name, slug: PRODUCT.slug, price: PRODUCT.price, imageUrl: PRODUCT.images[0] }, variant, quantity);
    toast.success("Added to cart!");
  }

  const discount = Math.round(((PRODUCT.compareAtPrice - PRODUCT.price) / PRODUCT.compareAtPrice) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground font-label mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
        <ChevronRight size={14} />
        <span className="text-foreground font-medium truncate">{PRODUCT.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-12 mb-20">
        {/* Images */}
        <div className="space-y-4">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square rounded-[var(--radius-auth)] overflow-hidden bg-muted"
          >
            <Image src={PRODUCT.images[activeImage]} alt={PRODUCT.name} fill className="object-cover" />
            {discount > 0 && (
              <span className="absolute top-4 left-4 px-2.5 py-1 text-xs font-label font-bold rounded text-white bg-green-500">
                -{discount}%
              </span>
            )}
          </motion.div>
          <div className="flex gap-3">
            {PRODUCT.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImage === i ? "border-[var(--brand-primary)]" : "border-border hover:border-muted-foreground"
                }`}
              >
                <Image src={img} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <p className="text-xs font-label font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--brand-primary)" }}>
              {PRODUCT.category}
            </p>
            <h1 className="text-3xl font-headline font-black tracking-tight">{PRODUCT.name}</h1>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(PRODUCT.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"} />
                ))}
              </div>
              <span className="text-sm font-label font-medium">{PRODUCT.rating}</span>
              <span className="text-sm text-muted-foreground font-body">({PRODUCT.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-headline font-black" style={{ color: "var(--brand-primary)" }}>
              ${PRODUCT.price}
            </span>
            {PRODUCT.compareAtPrice && (
              <span className="text-xl text-muted-foreground line-through font-body">${PRODUCT.compareAtPrice}</span>
            )}
          </div>

          {/* Variants */}
          <div>
            <p className="text-sm font-label font-semibold mb-3">
              Color
              {selectedVariant !== null && (
                <span className="text-muted-foreground font-normal ml-2">— {PRODUCT.variants[selectedVariant].value}</span>
              )}
            </p>
            <div className="flex gap-2.5 flex-wrap">
              {PRODUCT.variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(i)}
                  className={`px-4 py-2 rounded-[var(--radius)] text-sm font-label font-medium border-2 transition-all ${
                    selectedVariant === i
                      ? "border-[var(--brand-primary)] text-[var(--brand-primary)]"
                      : "border-border hover:border-muted-foreground text-muted-foreground"
                  }`}
                >
                  {v.value}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <p className="text-sm font-label font-semibold mb-3">Quantity</p>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-[var(--radius)] overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors">
                  <Minus size={14} />
                </button>
                <span className="px-4 font-label font-semibold text-base">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors">
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-xs text-muted-foreground font-body">In stock</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              className="btn-brand flex-1 flex items-center justify-center gap-2 py-3.5 text-sm"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </motion.button>
            <button className="w-12 h-12 flex items-center justify-center rounded-[var(--radius)] border border-border hover:bg-muted transition-colors text-muted-foreground">
              <Heart size={18} />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-[var(--radius)] border border-border hover:bg-muted transition-colors text-muted-foreground">
              <Share2 size={18} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
            {[
              { icon: Truck, label: "Free Shipping", sub: "Orders over $99" },
              { icon: Shield, label: "Secure Pay", sub: "SSL encrypted" },
              { icon: RefreshCw, label: "Free Returns", sub: "30-day policy" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1.5 p-2">
                <Icon size={16} style={{ color: "var(--brand-primary)" }} />
                <span className="text-xs font-label font-semibold">{label}</span>
                <span className="text-[10px] text-muted-foreground font-body">{sub}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Description & Features */}
      <div className="grid md:grid-cols-2 gap-10 mb-20">
        <div>
          <h2 className="text-xl font-headline font-bold mb-4">Description</h2>
          <p className="text-muted-foreground font-body leading-relaxed">{PRODUCT.description}</p>
        </div>
        <div>
          <h2 className="text-xl font-headline font-bold mb-4">Key Features</h2>
          <ul className="space-y-2.5">
            {PRODUCT.features.map((f) => (
              <li key={f} className="flex items-center gap-2.5 text-sm font-body">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] shrink-0" style={{ background: "var(--brand-primary)" }}>✓</span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Related */}
      <div>
        <h2 className="text-2xl font-headline font-black tracking-tight mb-8">You Might Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {RELATED.map((p) => <ProductCard key={p.id} {...p} />)}
        </div>
      </div>
    </div>
  );
}
