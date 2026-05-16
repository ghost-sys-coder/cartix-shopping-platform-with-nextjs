import type { WishlistData } from "@/lib/wishlist/wishlist-shared";
import { WishlistEmptyState } from "@/components/frontend/wishlist/wishlist-empty-state";
import { WishlistItemCard } from "@/components/frontend/wishlist/wishlist-item-card";

interface WishlistPageProps {
  wishlist: WishlistData;
}

export function WishlistPage({ wishlist }: WishlistPageProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-headline font-black tracking-tight">
          Wishlist
        </h1>
        <p className="mt-1 text-sm text-muted-foreground font-body">
          {wishlist.itemCount}{" "}
          {wishlist.itemCount === 1 ? "saved product" : "saved products"}
        </p>
      </div>

      {wishlist.items.length === 0 ? (
        <WishlistEmptyState />
      ) : (
        <div className="grid gap-4">
          {wishlist.items.map((item) => (
            <WishlistItemCard key={item.wishlistId} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
