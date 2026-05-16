import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getRemovedCloudinaryPublicIds,
  mergeUniqueProductImages,
} from "@/lib/products/product-images";

describe("product image helpers", () => {
  it("merges image lists without duplicate public IDs", () => {
    const images = mergeUniqueProductImages(
      [
        {
          url: "https://example.com/a.jpg",
          publicId: "products/a",
          altText: "",
        },
      ],
      [
        {
          url: "https://example.com/a-new.jpg",
          publicId: "products/a",
          altText: "Duplicate",
        },
        {
          url: "https://example.com/b.jpg",
          publicId: "products/b",
          altText: "Second",
        },
      ]
    );

    assert.deepEqual(images, [
      {
        url: "https://example.com/a.jpg",
        publicId: "products/a",
        altText: "",
      },
      {
        url: "https://example.com/b.jpg",
        publicId: "products/b",
        altText: "Second",
      },
    ]);
  });

  it("returns public IDs removed from a product image set", () => {
    const removed = getRemovedCloudinaryPublicIds(
      [
        { publicId: "products/a" },
        { publicId: "products/b" },
        { publicId: "products/b" },
      ],
      [{ publicId: "products/a" }]
    );

    assert.deepEqual(removed, ["products/b"]);
  });
});
