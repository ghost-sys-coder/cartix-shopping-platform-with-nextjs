import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  mapProductSearchRows,
  normalizeSearchQuery,
} from "@/lib/search/product-search";

describe("product search helpers", () => {
  it("normalizes search query params", () => {
    assert.equal(normalizeSearchQuery("  Wireless   Headphones  "), "Wireless Headphones");
    assert.equal(normalizeSearchQuery(["first", "second"]), "first");
    assert.equal(normalizeSearchQuery(undefined), "");
  });

  it("maps database rows into searchable product cards", () => {
    const results = mapProductSearchRows([
      {
        id: 7,
        name: "Premium Wireless Headphones",
        slug: "premium-wireless-headphones",
        price: "249.99",
        compareAtPrice: "299.99",
        imageUrl: null,
        isFeatured: false,
        categoryName: "Audio",
        reviewCount: 12,
        rating: "4.64",
      },
    ]);

    assert.deepEqual(results, [
      {
        id: 7,
        name: "Premium Wireless Headphones",
        slug: "premium-wireless-headphones",
        price: 249.99,
        compareAtPrice: 299.99,
        imageUrl:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
        rating: 4.6,
        reviewCount: 12,
        badge: "Sale",
        categoryName: "Audio",
      },
    ]);
  });
});
