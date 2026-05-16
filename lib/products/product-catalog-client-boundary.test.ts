import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const PRODUCTS_COMPONENT_DIR = join(
  process.cwd(),
  "components",
  "frontend",
  "products"
);

describe("product catalog client boundary", () => {
  it("does not import the server catalog module from client components", () => {
    const violations = readdirSync(PRODUCTS_COMPONENT_DIR)
      .filter((file) => file.endsWith(".tsx"))
      .flatMap((file) => {
        const path = join(PRODUCTS_COMPONENT_DIR, file);
        const source = readFileSync(path, "utf8");
        if (!source.startsWith('"use client";')) return [];

        return source
          .split(/\r?\n/)
          .filter(
            (line) =>
              line.includes('@/lib/products/product-catalog"') &&
              !line.trimStart().startsWith("import type")
          )
          .map((line) => `${file}: ${line.trim()}`);
      });

    assert.deepEqual(violations, []);
  });
});
