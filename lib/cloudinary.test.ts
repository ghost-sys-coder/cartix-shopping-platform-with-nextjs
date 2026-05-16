import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  getCloudinaryFolder,
  normalizeCloudinaryFolderSegment,
} from "@/lib/cloudinary";

const originalFolderName = process.env.CLOUDINARY_FOLDER_NAME;

afterEach(() => {
  if (originalFolderName === undefined) {
    delete process.env.CLOUDINARY_FOLDER_NAME;
  } else {
    process.env.CLOUDINARY_FOLDER_NAME = originalFolderName;
  }
});

describe("Cloudinary folder helpers", () => {
  it("normalizes folder path segments", () => {
    assert.equal(
      normalizeCloudinaryFolderSegment(" Category Images "),
      "category-images"
    );
  });

  it("creates category uploads under the configured base folder", () => {
    process.env.CLOUDINARY_FOLDER_NAME = "cartix";

    assert.equal(getCloudinaryFolder("categories"), "cartix/categories");
  });

  it("does not duplicate the configured base folder", () => {
    process.env.CLOUDINARY_FOLDER_NAME = "cartix";

    assert.equal(
      getCloudinaryFolder("cartix/categories"),
      "cartix/categories"
    );
  });
});
