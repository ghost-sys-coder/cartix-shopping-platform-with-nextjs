"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { WishlistItem } from "@/lib/wishlist/wishlist-shared";
import { useCartStore } from "@/store/cart";

interface WishlistItemCardProps {
  item: WishlistItem;
}

export function WishlistItemCard({ item }: WishlistItemCardProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const [isPending, startTransition] = useTransition();
  const { product } = item;

  function handleAddToCart() {
    if (product.stock <= 0) {
      toast.error("This product is currently out of stock");
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    toast.success(`${product.name} added to cart`);
  }

  function handleRemove() {
    startTransition(async () => {
      const response = await fetch(`/api/wishlist?productId=${product.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        toast.error(data?.error ?? "Could not remove wishlist item");
        return;
      }

      toast.success(`${product.name} removed from wishlist`);
      router.refresh();
    });
  }

  return (
    <article className="grid gap-4 rounded-[var(--radius-auth)] border border-border bg-card p-4 sm:grid-cols-[120px_1fr_auto] sm:items-center">
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square overflow-hidden rounded-[var(--radius)] bg-muted sm:h-[120px] sm:w-[120px]"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="120px"
        />
      </Link>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {product.categoryName && (
            <span className="text-xs font-label font-semibold text-muted-foreground">
              {product.categoryName}
            </span>
          )}
          {product.badge && (
            <span
              className="rounded px-2 py-0.5 text-[11px] font-label font-bold text-white"
              style={{ background: "var(--brand-primary)" }}
            >
              {product.badge}
            </span>
          )}
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="mt-1 block font-label font-semibold leading-tight hover:text-[var(--brand-primary)] transition-colors"
        >
          {product.name}
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className="font-headline font-bold text-lg"
            style={{ color: "var(--brand-primary)" }}
          >
            ${product.price.toFixed(2)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through font-body">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
          <span className="text-xs text-muted-foreground font-body">
            {product.stock > 0 ? "In stock" : "Out of stock"}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="btn-brand inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
        <button
          type="button"
          onClick={handleRemove}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-[var(--radius)] border border-border px-4 py-2.5 text-sm font-label font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
        >
          <Trash2 size={16} />
          Remove
        </button>
      </div>
    </article>
  );
}
