import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapWishlistRows, resolveWishlistUserId } from "@/lib/wishlist/wishlist";

describe("wishlist helpers", () => {
  it("uses an existing local user without calling Clerk sync", async () => {
    let syncCalls = 0;

    const userId = await resolveWishlistUserId({
      clerkUserId: "user_123",
      findUserIdByClerkId: async () => 42,
      syncCurrentUserToDb: async () => {
        syncCalls += 1;
      },
    });

    assert.equal(userId, 42);
    assert.equal(syncCalls, 0);
  });

  it("does not throw when fallback Clerk sync fails", async () => {
    const userId = await resolveWishlistUserId({
      clerkUserId: "user_missing",
      findUserIdByClerkId: async () => null,
      syncCurrentUserToDb: async () => {
        throw new Error("Clerk unavailable");
      },
    });

    assert.equal(userId, null);
  });

  it("maps wishlist rows into storefront wishlist items", () => {
    const items = mapWishlistRows([
      {
        wishlistId: 4,
        createdAt: new Date("2026-05-16T10:00:00.000Z"),
        productId: 12,
        name: "Premium Wireless Headphones",
        slug: "premium-wireless-headphones",
        price: "249.99",
        compareAtPrice: "299.99",
        imageUrl: null,
        isFeatured: true,
        stock: 8,
        categoryName: "Audio",
      },
    ]);

    assert.deepEqual(items, [
      {
        wishlistId: 4,
        addedAt: new Date("2026-05-16T10:00:00.000Z"),
        product: {
          id: 12,
          name: "Premium Wireless Headphones",
          slug: "premium-wireless-headphones",
          price: 249.99,
          compareAtPrice: 299.99,
          imageUrl:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
          badge: "Featured",
          stock: 8,
          categoryName: "Audio",
        },
      },
    ]);
  });

  it("marks sale products when compare-at price is higher", () => {
    const [item] = mapWishlistRows([
      {
        wishlistId: 8,
        createdAt: new Date("2026-05-16T10:00:00.000Z"),
        productId: 22,
        name: "Desk Lamp",
        slug: "desk-lamp",
        price: "49.99",
        compareAtPrice: "79.99",
        imageUrl: "https://example.com/lamp.jpg",
        isFeatured: false,
        stock: 0,
        categoryName: null,
      },
    ]);

    assert.equal(item.product.badge, "Sale");
    assert.equal(item.product.imageUrl, "https://example.com/lamp.jpg");
  });
});
