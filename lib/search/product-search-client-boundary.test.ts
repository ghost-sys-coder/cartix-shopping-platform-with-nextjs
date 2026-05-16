import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SEARCH_COMPONENT_DIR = join(
  process.cwd(),
  "components",
  "frontend",
  "search"
);

describe("product search client boundary", () => {
  it("does not import the server search module from client components", () => {
    const violations = readdirSync(SEARCH_COMPONENT_DIR)
      .filter((file) => file.endsWith(".tsx"))
      .flatMap((file) => {
        const path = join(SEARCH_COMPONENT_DIR, file);
        const source = readFileSync(path, "utf8");
        if (!source.startsWith('"use client";')) return [];

        return source
          .split(/\r?\n/)
          .filter(
            (line) =>
              line.includes('@/lib/search/product-search"') &&
              !line.trimStart().startsWith("import type")
          )
          .map((line) => `${file}: ${line.trim()}`);
      });

    assert.deepEqual(violations, []);
  });
});
