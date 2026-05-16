import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const CLIENT_COMPONENT_DIRS = [
  join(process.cwd(), "components", "frontend", "wishlist"),
  join(process.cwd(), "components", "frontend"),
];

describe("wishlist client boundary", () => {
  it("does not import the server wishlist module from client components", () => {
    const violations = CLIENT_COMPONENT_DIRS.flatMap((directory) =>
      readdirSync(directory)
        .filter((file) => file.endsWith(".tsx"))
        .flatMap((file) => {
          const path = join(directory, file);
          const source = readFileSync(path, "utf8");
          if (!source.startsWith('"use client";')) return [];

          return source
            .split(/\r?\n/)
            .filter(
              (line) =>
                line.includes('@/lib/wishlist/wishlist"') &&
                !line.trimStart().startsWith("import type")
            )
            .map((line) => `${file}: ${line.trim()}`);
        })
    );

    assert.deepEqual(violations, []);
  });
});
