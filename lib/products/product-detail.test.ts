import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mapProductDetailData } from "@/lib/products/product-detail";

describe("product detail helpers", () => {
  it("maps database rows into a storefront product detail model", () => {
    const detail = mapProductDetailData({
      product: {
        id: 12,
        name: "Premium Wireless Headphones",
        slug: "premium-wireless-headphones",
        description: "Long description",
        shortDescription: "Short description",
        price: "249.99",
        compareAtPrice: "299.99",
        sku: "HP-WL-001",
        stock: 8,
        isFeatured: true,
        tags: ["audio", "wireless"],
        keyFeatures: ["40-hour battery life", "Noise cancellation"],
        categoryId: 3,
        categoryName: "Audio",
        categorySlug: "audio",
      },
      images: [
        {
          id: 1,
          url: "https://example.com/headphones.jpg",
          altText: null,
          sortOrder: 0,
        },
      ],
      variants: [
        {
          id: 5,
          name: "Color",
          value: "Midnight Black",
          price: null,
          stock: 4,
          imageUrl: null,
        },
      ],
      reviewSummary: { reviewCount: 7, rating: "4.64" },
      relatedProducts: [
        {
          id: 18,
          name: "Portable Speaker",
          slug: "portable-speaker",
          price: "79.99",
          compareAtPrice: null,
          imageUrl: null,
          isFeatured: false,
          reviewCount: 0,
          rating: null,
        },
      ],
    });

    assert.equal(detail.product.price, 249.99);
    assert.equal(detail.product.compareAtPrice, 299.99);
    assert.equal(detail.product.rating, 4.6);
    assert.equal(detail.product.reviewCount, 7);
    assert.equal(detail.product.images[0].altText, "Premium Wireless Headphones");
    assert.deepEqual(detail.product.keyFeatures, [
      "40-hour battery life",
      "Noise cancellation",
    ]);
    assert.deepEqual(detail.product.category, {
      id: 3,
      name: "Audio",
      slug: "audio",
    });
    assert.equal(detail.product.variants[0].value, "Midnight Black");
    assert.equal(detail.relatedProducts[0].imageUrl.includes("unsplash.com"), true);
  });

  it("uses safe defaults for sparse product rows", () => {
    const detail = mapProductDetailData({
      product: {
        id: 9,
        name: "Desk Lamp",
        slug: "desk-lamp",
        description: null,
        shortDescription: null,
        price: "49.50",
        compareAtPrice: null,
        sku: null,
        stock: 0,
        isFeatured: false,
        tags: null,
        keyFeatures: null,
        categoryId: null,
        categoryName: null,
        categorySlug: null,
      },
      images: [],
      variants: [],
      reviewSummary: null,
      relatedProducts: [],
    });

    assert.equal(detail.product.compareAtPrice, undefined);
    assert.equal(detail.product.description, "");
    assert.equal(detail.product.stockLabel, "Out of stock");
    assert.equal(detail.product.images.length, 1);
    assert.equal(detail.product.rating, 0);
    assert.deepEqual(detail.product.tags, []);
    assert.deepEqual(detail.relatedProducts, []);
  });
});
