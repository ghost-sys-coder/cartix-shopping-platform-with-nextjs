import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
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
});
