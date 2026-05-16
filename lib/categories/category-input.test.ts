import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  parseCategoryPayload,
  slugifyCategoryName,
} from "@/lib/categories/category-input";

describe("category input helpers", () => {
  it("creates URL-safe slugs from category names", () => {
    assert.equal(slugifyCategoryName("Home & Living"), "home-living");
    assert.equal(slugifyCategoryName("  Summer   Deals!!! "), "summer-deals");
  });

  it("requires a category name", () => {
    const result = parseCategoryPayload({ name: " " });

    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.error, "Category name is required");
    }
  });

  it("normalizes create payloads", () => {
    const result = parseCategoryPayload({
      name: "Home & Living",
      slug: "",
      description: "Decor and furniture",
      parentId: "4",
      sortOrder: "2",
      isActive: false,
    });

    assert.deepEqual(result, {
      ok: true,
      values: {
        name: "Home & Living",
        slug: "home-living",
        description: "Decor and furniture",
        imageUrl: null,
        parentId: 4,
        sortOrder: 2,
        isActive: false,
      },
    });
  });

  it("prevents a category from being its own parent", () => {
    const result = parseCategoryPayload(
      { name: "Electronics", parentId: "7" },
      { currentCategoryId: 7 }
    );

    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.equal(result.error, "A category cannot be its own parent");
    }
  });
});
