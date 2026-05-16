"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  RefreshCw,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import type {
  ProductDetailProduct,
  ProductDetailVariant,
} from "@/lib/products/product-detail-shared";
import { useCartStore } from "@/store/cart";
import { toast } from "sonner";
import { WishlistButton } from "@/components/frontend/wishlist-button";

const trustItems = [
  { icon: Truck, label: "Free Shipping", sub: "Orders over $99" },
  { icon: Shield, label: "Secure Pay", sub: "SSL encrypted" },
  { icon: RefreshCw, label: "Free Returns", sub: "30-day policy" },
] as const;

interface ProductSummaryPanelProps {
  product: ProductDetailProduct;
}

export function ProductSummaryPanel({ product }: ProductSummaryPanelProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    product.variants[0]?.id ?? null
  );
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const selectedVariant = product.variants.find(
    (variant) => variant.id === selectedVariantId
  );
  const effectiveStock = selectedVariant?.stock ?? product.stock;
  const canAddToCart = effectiveStock > 0;
  const displayPrice = selectedVariant?.price ?? product.price;
  const discount =
    product.compareAtPrice && product.compareAtPrice > displayPrice
      ? Math.round(
          ((product.compareAtPrice - displayPrice) / product.compareAtPrice) *
            100
        )
      : 0;

  function handleAddToCart() {
    if (!canAddToCart) return;

    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        imageUrl: product.images[0].url,
        sku: product.sku,
      },
      toCartVariant(selectedVariant),
      quantity
    );
    toast.success(`${product.name} added to cart`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        {product.category && (
          <p
            className="text-xs font-label font-semibold uppercase tracking-widest mb-2"
            style={{ color: "var(--brand-primary)" }}
          >
            {product.category.name}
          </p>
        )}
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="text-3xl sm:text-4xl font-headline font-black tracking-tight">
            {product.name}
          </h1>
          {product.badge && (
            <span
              className="rounded px-2.5 py-1 text-xs font-label font-bold text-white"
              style={{ background: "var(--brand-primary)" }}
            >
              {product.badge}
            </span>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={15}
                className={
                  index < Math.round(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground/30"
                }
              />
            ))}
          </div>
          <span className="text-sm font-label font-medium">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground font-body">
            ({product.reviewCount} reviews)
          </span>
          {product.sku && (
            <span className="text-xs text-muted-foreground font-label">
              SKU: {product.sku}
            </span>
          )}
        </div>
      </div>

      {product.shortDescription && (
        <p className="text-base text-muted-foreground font-body leading-relaxed">
          {product.shortDescription}
        </p>
      )}

      <div className="flex flex-wrap items-baseline gap-3">
        <span
          className="text-4xl font-headline font-black"
          style={{ color: "var(--brand-primary)" }}
        >
          ${displayPrice.toFixed(2)}
        </span>
        {product.compareAtPrice && (
          <span className="text-xl text-muted-foreground line-through font-body">
            ${product.compareAtPrice.toFixed(2)}
          </span>
        )}
        {discount > 0 && (
          <span className="rounded bg-green-500 px-2 py-1 text-xs font-label font-bold text-white">
            -{discount}%
          </span>
        )}
      </div>

      {product.variants.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-label font-semibold">
            Options
            {selectedVariant && (
              <span className="ml-2 font-normal text-muted-foreground">
                {selectedVariant.name}: {selectedVariant.value}
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {product.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariantId(variant.id)}
                disabled={variant.stock <= 0}
                className={`rounded-[var(--radius)] border-2 px-4 py-2 text-sm font-label font-medium transition-all disabled:cursor-not-allowed disabled:opacity-45 ${
                  selectedVariantId === variant.id
                    ? "border-[var(--brand-primary)] text-[var(--brand-primary)]"
                    : "border-border text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                {variant.value}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-3 text-sm font-label font-semibold">Quantity</p>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center overflow-hidden rounded-[var(--radius)] border border-border">
            <button
              type="button"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              className="flex h-10 w-10 items-center justify-center hover:bg-muted transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="min-w-11 px-3 text-center font-label font-semibold text-base">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                setQuantity((value) => Math.min(effectiveStock || 1, value + 1))
              }
              className="flex h-10 w-10 items-center justify-center hover:bg-muted transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="text-xs text-muted-foreground font-body">
            {selectedVariant ? stockText(selectedVariant.stock) : product.stockLabel}
          </span>
        </div>
      </div>

      <div className="flex gap-3">
        <motion.button
          whileTap={canAddToCart ? { scale: 0.97 } : undefined}
          type="button"
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          className="btn-brand flex-1 flex items-center justify-center gap-2 py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart size={18} />
          {canAddToCart ? "Add to Cart" : "Out of Stock"}
        </motion.button>
        <WishlistButton
          productId={product.id}
          productName={product.name}
          className="flex h-12 w-12 items-center justify-center rounded-[var(--radius)] border border-border text-muted-foreground hover:bg-muted transition-colors disabled:opacity-60"
        />
        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-[var(--radius)] border border-border text-muted-foreground hover:bg-muted transition-colors"
          aria-label="Share product"
        >
          <Share2 size={18} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 border-t border-border pt-4">
        {trustItems.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 p-2 text-center">
            <Icon size={16} style={{ color: "var(--brand-primary)" }} />
            <span className="text-xs font-label font-semibold">{label}</span>
            <span className="text-[10px] text-muted-foreground font-body">
              {sub}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function toCartVariant(variant: ProductDetailVariant | undefined) {
  if (!variant) return undefined;

  return {
    id: variant.id,
    name: variant.name,
    value: variant.value,
    price: variant.price,
  };
}

function stockText(stock: number) {
  if (stock <= 0) return "Out of stock";
  if (stock <= 5) return `Only ${stock} left`;
  return "In stock";
}
