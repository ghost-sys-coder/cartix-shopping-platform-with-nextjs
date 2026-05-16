import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildCategoryHierarchy,
  mapCategoryCatalogRows,
} from "@/lib/categories/category-catalog";

describe("category catalog helpers", () => {
  it("maps database rows into storefront categories with active product counts", () => {
    const catalog = mapCategoryCatalogRows(
      [
        {
          id: 1,
          name: "Electronics",
          slug: "electronics",
          description: "Smart everyday devices",
          imageUrl: null,
          parentId: null,
          sortOrder: 0,
        },
        {
          id: 2,
          name: "Audio",
          slug: "audio",
          description: null,
          imageUrl: "https://example.com/audio.jpg",
          parentId: 1,
          sortOrder: 1,
        },
      ],
      new Map([[1, 4]])
    );

    assert.deepEqual(catalog, [
      {
        id: 1,
        name: "Electronics",
        slug: "electronics",
        description: "Smart everyday devices",
        imageUrl:
          "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900",
        parentId: null,
        productCount: 4,
        sortOrder: 0,
      },
      {
        id: 2,
        name: "Audio",
        slug: "audio",
        description: null,
        imageUrl: "https://example.com/audio.jpg",
        parentId: 1,
        productCount: 0,
        sortOrder: 1,
      },
    ]);
  });

  it("groups child categories under active parents", () => {
    const hierarchy = buildCategoryHierarchy([
      {
        id: 1,
        name: "Electronics",
        slug: "electronics",
        description: null,
        imageUrl: "https://example.com/electronics.jpg",
        parentId: null,
        productCount: 4,
        sortOrder: 0,
      },
      {
        id: 2,
        name: "Audio",
        slug: "audio",
        description: null,
        imageUrl: "https://example.com/audio.jpg",
        parentId: 1,
        productCount: 2,
        sortOrder: 1,
      },
    ]);

    assert.equal(hierarchy.length, 1);
    assert.equal(hierarchy[0].name, "Electronics");
    assert.deepEqual(
      hierarchy[0].children.map((category) => category.slug),
      ["audio"]
    );
  });
});
