import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  mapProductPayloadToFormValues,
  mapProductToFormValues,
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
      keyFeatures: [
        "Active noise cancellation",
        "40-hour battery life",
        "",
      ],
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
          keyFeatures: [
            "Active noise cancellation",
            "40-hour battery life",
          ],
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

  it("deduplicates product images by Cloudinary public ID", () => {
    const result = parseProductPayload({
      name: "Premium Wireless Headphones",
      price: "249.99",
      images: [
        {
          url: "https://res.cloudinary.com/demo/image/upload/product.jpg",
          publicId: "cartix/products/product",
          altText: "Main image",
        },
        {
          url: "https://res.cloudinary.com/demo/image/upload/product-copy.jpg",
          publicId: "cartix/products/product",
          altText: "Duplicate image",
        },
      ],
    });

    assert.equal(result.ok, true);
    if (result.ok) {
      assert.deepEqual(result.values.images, [
        {
          url: "https://res.cloudinary.com/demo/image/upload/product.jpg",
          publicId: "cartix/products/product",
          altText: "Main image",
          sortOrder: 0,
          isPrimary: true,
        },
      ]);
    }
  });

  it("maps existing database product values into editable form values", () => {
    const values = mapProductToFormValues({
      product: {
        id: 12,
        name: "Premium Wireless Headphones",
        slug: "premium-wireless-headphones",
        description: "Detailed copy",
        shortDescription: null,
        price: "249.99",
        compareAtPrice: null,
        costPrice: "89.00",
        sku: "HP-WL-001",
        barcode: null,
        stock: 42,
        lowStockThreshold: 5,
        weight: null,
        categoryId: 2,
        status: "active",
        isFeatured: true,
        tags: ["headphones", "wireless"],
        keyFeatures: ["Active noise cancellation", "40-hour battery life"],
        metaTitle: null,
        metaDescription: "Meta copy",
      },
      images: [
        {
          id: 5,
          url: "https://res.cloudinary.com/demo/image/upload/product.jpg",
          publicId: "cartix/products/product",
          altText: null,
        },
      ],
    });

    assert.deepEqual(values, {
      form: {
        name: "Premium Wireless Headphones",
        slug: "premium-wireless-headphones",
        description: "Detailed copy",
        shortDescription: "",
        price: "249.99",
        compareAtPrice: "",
        costPrice: "89.00",
        sku: "HP-WL-001",
        barcode: "",
        stock: "42",
        lowStockThreshold: "5",
        weight: "",
        categoryId: "2",
        status: "active",
        isFeatured: true,
        tags: "headphones, wireless",
        keyFeatures: "Active noise cancellation\n40-hour battery life",
        metaTitle: "",
        metaDescription: "Meta copy",
      },
      images: [
        {
          url: "https://res.cloudinary.com/demo/image/upload/product.jpg",
          publicId: "cartix/products/product",
          altText: "",
        },
      ],
    });
  });

  it("maps imported product JSON into create form values", () => {
    const result = mapProductPayloadToFormValues({
      name: "Premium Wireless Headphones",
      price: 249.99,
      stock: 42,
      lowStockThreshold: 4,
      isFeatured: true,
      tags: ["headphones", "wireless"],
      keyFeatures: ["Active noise cancellation", "40-hour battery life"],
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
        form: {
          name: "Premium Wireless Headphones",
          slug: "premium-wireless-headphones",
          description: "",
          shortDescription: "",
          price: "249.99",
          compareAtPrice: "",
          costPrice: "",
          sku: "",
          barcode: "",
          stock: "42",
          lowStockThreshold: "4",
          weight: "",
          categoryId: "",
          status: "draft",
          isFeatured: true,
          tags: "headphones, wireless",
          keyFeatures: "Active noise cancellation\n40-hour battery life",
          metaTitle: "",
          metaDescription: "",
        },
        images: [
          {
            url: "https://res.cloudinary.com/demo/image/upload/product.jpg",
            publicId: "cartix/products/product",
            altText: "Main image",
          },
        ],
      },
    });
  });
});
