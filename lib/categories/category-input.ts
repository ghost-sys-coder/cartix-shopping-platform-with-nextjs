export interface CategoryValues {
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: number | null;
  sortOrder: number;
  isActive: boolean;
}

type CategoryPayload = Record<string, unknown>;

type ParseResult =
  | { ok: true; values: CategoryValues }
  | { ok: false; error: string };

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableStringValue(value: unknown) {
  const text = stringValue(value);
  return text || null;
}

function nullableNumberValue(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function numberValue(value: unknown, fallback: number) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isInteger(parsed) ? parsed : fallback;
}

export function slugifyCategoryName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseCategoryPayload(
  payload: CategoryPayload,
  options: { currentCategoryId?: number } = {}
): ParseResult {
  const name = stringValue(payload.name);
  if (!name) return { ok: false, error: "Category name is required" };

  const slug = slugifyCategoryName(stringValue(payload.slug) || name);
  if (!slug) return { ok: false, error: "Category slug is required" };

  const parentId = nullableNumberValue(payload.parentId);
  if (parentId && parentId === options.currentCategoryId) {
    return { ok: false, error: "A category cannot be its own parent" };
  }

  return {
    ok: true,
    values: {
      name,
      slug,
      description: nullableStringValue(payload.description),
      imageUrl: nullableStringValue(payload.imageUrl),
      parentId,
      sortOrder: numberValue(payload.sortOrder, 0),
      isActive: typeof payload.isActive === "boolean" ? payload.isActive : true,
    },
  };
}
