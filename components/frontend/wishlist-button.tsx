"use client";

import { useEffect, useState, useTransition } from "react";
import { useUser } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface WishlistButtonProps {
  productId: number;
  productName: string;
  initialWishlisted?: boolean;
  className?: string;
  iconSize?: number;
  stopPropagation?: boolean;
}

export function WishlistButton({
  productId,
  productName,
  initialWishlisted = false,
  className,
  iconSize = 18,
  stopPropagation = false,
}: WishlistButtonProps) {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    let cancelled = false;
    fetch(`/api/wishlist?productId=${productId}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { wishlisted?: boolean } | null) => {
        if (!cancelled && typeof data?.wishlisted === "boolean") {
          setWishlisted(data.wishlisted);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, productId]);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (stopPropagation) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!isLoaded) return;

    if (!isSignedIn) {
      const redirect = encodeURIComponent(window.location.pathname);
      router.push(`/sign-in?redirect_url=${redirect}`);
      return;
    }

    startTransition(async () => {
      const nextWishlisted = !wishlisted;
      const response = await fetch(
        nextWishlisted ? "/api/wishlist" : `/api/wishlist?productId=${productId}`,
        {
          method: nextWishlisted ? "POST" : "DELETE",
          headers: nextWishlisted
            ? { "Content-Type": "application/json" }
            : undefined,
          body: nextWishlisted ? JSON.stringify({ productId }) : undefined,
        }
      );

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        toast.error(data?.error ?? "Wishlist update failed");
        return;
      }

      setWishlisted(nextWishlisted);
      toast.success(
        nextWishlisted
          ? `${productName} added to wishlist`
          : `${productName} removed from wishlist`
      );
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={className}
      aria-pressed={wishlisted}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        size={iconSize}
        className={wishlisted ? "fill-red-500 text-red-500" : undefined}
      />
    </button>
  );
}
