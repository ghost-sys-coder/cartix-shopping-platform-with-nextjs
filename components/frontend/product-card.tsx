"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";
import { WishlistButton } from "@/components/frontend/wishlist-button";

interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  badge?: string;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  imageUrl,
  rating = 0,
  reviewCount = 0,
  badge,
}: ProductCardProps) {
  const { addItem } = useCartStore();
  const discount = compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({ id, name, slug, price, imageUrl });
    toast.success(`${name} added to cart`);
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative rounded-[var(--radius-auth)] overflow-hidden border border-border bg-card hover:shadow-xl transition-shadow"
    >
      <Link href={`/products/${slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {badge && (
              <span
                className="px-2 py-0.5 text-[11px] font-label font-bold rounded text-white"
                style={{ background: "var(--brand-primary)" }}
              >
                {badge}
              </span>
            )}
            {discount > 0 && (
              <span className="px-2 py-0.5 text-[11px] font-label font-bold rounded bg-green-500 text-white">
                -{discount}%
              </span>
            )}
          </div>

          {/* Actions overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          <div className="absolute top-3 right-3 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
            <WishlistButton
              productId={id}
              productName={name}
              iconSize={14}
              stopPropagation
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-foreground hover:text-red-500 shadow-md transition-colors disabled:opacity-60"
            />
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-label font-semibold text-sm leading-tight line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors">
            {name}
          </h3>

          {/* Rating */}
          {reviewCount > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={11}
                    className={i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}
                  />
                ))}
              </div>
              <span className="text-[11px] text-muted-foreground font-body">
                ({reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="font-headline font-bold text-base" style={{ color: "var(--brand-primary)" }}>
              ${price.toFixed(2)}
            </span>
            {compareAtPrice && (
              <span className="text-sm text-muted-foreground line-through font-body">
                ${compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to cart */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-label font-semibold rounded-[var(--radius)] border border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white transition-all duration-200"
        >
          <ShoppingCart size={15} />
          Add to cart
        </button>
      </div>
    </motion.div>
  );
}
