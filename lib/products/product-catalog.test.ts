import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  mapCatalogProductRows,
  parseCatalogFilters,
} from "@/lib/products/product-catalog";

describe("product catalog helpers", () => {
  it("parses URL search params into catalog filters", () => {
    const filters = parseCatalogFilters({
      category: ["audio", "accessories"],
      priceMax: "250",
      rating: "4",
      sort: "price-desc",
      sale: "true",
    });

    assert.deepEqual(filters, {
      categories: ["audio", "accessories"],
      priceMax: 250,
      minRating: 4,
      saleOnly: true,
      sort: "price-desc",
    });
  });

  it("falls back to safe filter defaults", () => {
    const filters = parseCatalogFilters({
      category: "",
      priceMax: "not-a-number",
      rating: "8",
      sort: "unknown",
    });

    assert.deepEqual(filters, {
      categories: [],
      priceMax: 1000,
      minRating: 0,
      saleOnly: false,
      sort: "newest",
    });
  });

  it("maps database product rows into catalog product cards", () => {
    const products = mapCatalogProductRows([
      {
        id: 7,
        name: "Premium Wireless Headphones",
        slug: "premium-wireless-headphones",
        price: "249.99",
        compareAtPrice: "299.99",
        imageUrl: null,
        isFeatured: true,
        createdAt: new Date("2026-05-15T10:00:00.000Z"),
        categorySlug: "audio",
        reviewCount: 12,
        rating: "4.64",
        sales: 18,
      },
    ]);

    assert.deepEqual(products, [
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
        badge: "Featured",
        categorySlug: "audio",
        createdAt: new Date("2026-05-15T10:00:00.000Z"),
        sales: 18,
      },
    ]);
  });
});
