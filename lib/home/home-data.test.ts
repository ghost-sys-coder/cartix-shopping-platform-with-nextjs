import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  loadHomePageQueryRows,
  mapHomeCategoryRows,
  mapHomeProductRows,
} from "@/lib/home/home-data";

describe("home data mappers", () => {
  it("maps database product rows into product card data", () => {
    const products = mapHomeProductRows([
      {
        id: 12,
        name: "Premium Wireless Headphones",
        slug: "premium-wireless-headphones",
        price: "249.99",
        compareAtPrice: "299.99",
        imageUrl: null,
        isFeatured: true,
        reviewCount: 8,
        rating: "4.75",
      },
    ]);

    assert.deepEqual(products, [
      {
        id: 12,
        name: "Premium Wireless Headphones",
        slug: "premium-wireless-headphones",
        price: 249.99,
        compareAtPrice: 299.99,
        imageUrl:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
        rating: 4.8,
        reviewCount: 8,
        badge: "Featured",
      },
    ]);
  });

  it("maps database categories with active product counts", () => {
    const categories = mapHomeCategoryRows(
      [
        {
          id: 1,
          name: "Electronics",
          slug: "electronics",
          imageUrl: null,
        },
      ],
      new Map([[1, 4]])
    );

    assert.deepEqual(categories, [
      {
        id: 1,
        name: "Electronics",
        slug: "electronics",
        imageUrl:
          "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600",
        productCount: 4,
      },
    ]);
  });

  it("retries a failed home page query before returning rows", async () => {
    let attempts = 0;

    const rows = await loadHomePageQueryRows({
      label: "featured products",
      fallback: [],
      retryDelayMs: 0,
      load: async () => {
        attempts += 1;
        if (attempts === 1) throw new Error("temporary database failure");
        return [{ id: 1 }];
      },
    });

    assert.equal(attempts, 2);
    assert.deepEqual(rows, [{ id: 1 }]);
  });

  it("returns fallback rows when a home page query keeps failing", async () => {
    const errors: unknown[] = [];

    const rows = await loadHomePageQueryRows({
      label: "featured products",
      fallback: [{ id: 99 }],
      retryDelayMs: 0,
      onError: (_label, error) => errors.push(error),
      load: async () => {
        throw new Error("database unavailable");
      },
    });

    assert.deepEqual(rows, [{ id: 99 }]);
    assert.equal(errors.length, 1);
  });
});
