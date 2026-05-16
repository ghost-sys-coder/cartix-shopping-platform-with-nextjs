import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  parseProductPayload,
  slugifyProductName,
} from "@/lib/products/product-input";

describe("product input helpers", () => {
  it("creates URL-safe product slugs", () => {
    assert.equal(
      slugifyProductName("Premium Wireless Headphones!"),
      "premium-wireless-headphones"
    );
  });

  it("requires a product name", () => {
    const result = parseProductPayload({ name: "", price: "10" });

    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.error, "Product name is required");
    }
  });

  it("requires a positive product price", () => {
    const result = parseProductPayload({ name: "Headphones", price: "0" });

    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.error, "Product price must be greater than 0");
    }
  });

  it("normalizes product create payloads", () => {
    const result = parseProductPayload({
      name: "Premium Wireless Headphones",
      slug: "",
      description: "Detailed copy",
      shortDescription: "Short copy",
      price: "249.99",
      compareAtPrice: "",
      costPrice: "89",
      sku: " HP-WL-001 ",
      stock: "42",
      lowStockThreshold: "4",
      categoryId: "2",
      status: "active",
      isFeatured: true,
      tags: "headphones, wireless, audio",
      images: [
        {
          url: "https://res.cloudinary.com/demo/image/upload/product.jpg",
          publicId: "cartix/products/product",
          altText: "Main image",
        },
      ],
    });

    assert.deepEqual(result, {
      ok: true,
      values: {
        product: {
          name: "Premium Wireless Headphones",
          slug: "premium-wireless-headphones",
          description: "Detailed copy",
          shortDescription: "Short copy",
          price: "249.99",
          compareAtPrice: null,
          costPrice: "89.00",
          sku: "HP-WL-001",
          barcode: null,
          stock: 42,
          lowStockThreshold: 4,
          weight: null,
          categoryId: 2,
          status: "active",
          isFeatured: true,
          tags: ["headphones", "wireless", "audio"],
          metaTitle: null,
          metaDescription: null,
        },
        images: [
          {
            url: "https://res.cloudinary.com/demo/image/upload/product.jpg",
            publicId: "cartix/products/product",
            altText: "Main image",
            sortOrder: 0,
            isPrimary: true,
          },
        ],
      },
    });
  });
});
