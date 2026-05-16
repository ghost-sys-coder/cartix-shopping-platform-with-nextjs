import { mergeUniqueProductImages } from "@/lib/products/product-images";

export type ProductStatus = "draft" | "active" | "archived";

export interface ProductImageInput {
  url: string;
  publicId: string;
  altText?: string | null;
}

export interface ProductValues {
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: string;
  compareAtPrice: string | null;
  costPrice: string | null;
  sku: string | null;
  barcode: string | null;
  stock: number;
  lowStockThreshold: number;
  weight: string | null;
  categoryId: number | null;
  status: ProductStatus;
  isFeatured: boolean;
  tags: string[] | null;
  keyFeatures: string[] | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

export interface ProductImageValues {
  url: string;
  publicId: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
}

export interface EditableProductRecord {
  product: ProductValues & { id: number };
  images: Array<{
    id: number;
    url: string;
    publicId: string;
    altText: string | null;
  }>;
}

type ProductPayload = Record<string, unknown>;

type ParseResult =
  | {
      ok: true;
      values: { product: ProductValues; images: ProductImageValues[] };
    }
  | { ok: false; error: string };

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableStringValue(value: unknown) {
  const text = stringValue(value);
  return text || null;
}

function integerValue(value: unknown, fallback: number) {
  if (value === null || value === undefined || value === "") return fallback;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isInteger(parsed) ? parsed : fallback;
}

function nullablePositiveInteger(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function decimalString(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) return null;
  return parsed.toFixed(2);
}

function tagsValue(value: unknown) {
  const tags = Array.isArray(value)
    ? value
    : stringValue(value)
        .split(",")
        .map((tag) => tag.trim());
  const normalized = tags
    .filter((tag): tag is string => typeof tag === "string" && tag.length > 0)
    .map((tag) => tag.toLowerCase());
  return normalized.length > 0 ? normalized : null;
}

function keyFeaturesValue(value: unknown) {
  const features = Array.isArray(value)
    ? value
    : stringValue(value)
        .split(/\r?\n/)
        .map((feature) => feature.trim());
  const normalized = features
    .filter(
      (feature): feature is string =>
        typeof feature === "string" && feature.trim().length > 0
    )
    .map((feature) => feature.trim());
  return normalized.length > 0 ? normalized : null;
}

function statusValue(value: unknown): ProductStatus {
  return value === "active" || value === "archived" ? value : "draft";
}

function imageValues(value: unknown): ProductImageValues[] {
  if (!Array.isArray(value)) return [];

  const images = value
    .map((image, index) => {
      if (typeof image !== "object" || image === null) return null;
      const record = image as Record<string, unknown>;
      const url = stringValue(record.url);
      const publicId = stringValue(record.publicId);
      if (!url || !publicId) return null;

      return {
        url,
        publicId,
        altText: nullableStringValue(record.altText),
        sortOrder: index,
        isPrimary: index === 0,
      };
    })
    .filter((image): image is ProductImageValues => image !== null);

  return mergeUniqueProductImages([], images).map((image, index) => ({
    ...image,
    sortOrder: index,
    isPrimary: index === 0,
  }));
}

export function slugifyProductName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseProductPayload(payload: ProductPayload): ParseResult {
  const name = stringValue(payload.name);
  if (!name) return { ok: false, error: "Product name is required" };

  const price = decimalString(payload.price);
  if (!price || Number(price) <= 0) {
    return { ok: false, error: "Product price must be greater than 0" };
  }

  const slug = slugifyProductName(stringValue(payload.slug) || name);
  if (!slug) return { ok: false, error: "Product slug is required" };

  return {
    ok: true,
    values: {
      product: {
        name,
        slug,
        description: nullableStringValue(payload.description),
        shortDescription: nullableStringValue(payload.shortDescription),
        price,
        compareAtPrice: decimalString(payload.compareAtPrice),
        costPrice: decimalString(payload.costPrice),
        sku: nullableStringValue(payload.sku),
        barcode: nullableStringValue(payload.barcode),
        stock: Math.max(0, integerValue(payload.stock, 0)),
        lowStockThreshold: Math.max(
          0,
          integerValue(payload.lowStockThreshold, 5)
        ),
        weight: decimalString(payload.weight),
        categoryId: nullablePositiveInteger(payload.categoryId),
        status: statusValue(payload.status),
        isFeatured:
          typeof payload.isFeatured === "boolean" ? payload.isFeatured : false,
        tags: tagsValue(payload.tags),
        keyFeatures: keyFeaturesValue(payload.keyFeatures),
        metaTitle: nullableStringValue(payload.metaTitle),
        metaDescription: nullableStringValue(payload.metaDescription),
      },
      images: imageValues(payload.images),
    },
  };
}

export function mapProductToFormValues(record: EditableProductRecord) {
  return {
    form: {
      name: record.product.name,
      slug: record.product.slug,
      description: record.product.description ?? "",
      shortDescription: record.product.shortDescription ?? "",
      price: record.product.price,
      compareAtPrice: record.product.compareAtPrice ?? "",
      costPrice: record.product.costPrice ?? "",
      sku: record.product.sku ?? "",
      barcode: record.product.barcode ?? "",
      stock: record.product.stock.toString(),
      lowStockThreshold: record.product.lowStockThreshold.toString(),
      weight: record.product.weight ?? "",
      categoryId: record.product.categoryId?.toString() ?? "",
      status: record.product.status,
      isFeatured: record.product.isFeatured,
      tags: record.product.tags?.join(", ") ?? "",
      keyFeatures: record.product.keyFeatures?.join("\n") ?? "",
      metaTitle: record.product.metaTitle ?? "",
      metaDescription: record.product.metaDescription ?? "",
    },
    images: record.images.map((image) => ({
      url: image.url,
      publicId: image.publicId,
      altText: image.altText ?? "",
    })),
  };
}

export function mapProductPayloadToFormValues(payload: ProductPayload) {
  const parsed = parseProductPayload(payload);
  if (!parsed.ok) return parsed;

  return {
    ok: true as const,
    values: {
      form: {
        name: parsed.values.product.name,
        slug: parsed.values.product.slug,
        description: parsed.values.product.description ?? "",
        shortDescription: parsed.values.product.shortDescription ?? "",
        price: parsed.values.product.price,
        compareAtPrice: parsed.values.product.compareAtPrice ?? "",
        costPrice: parsed.values.product.costPrice ?? "",
        sku: parsed.values.product.sku ?? "",
        barcode: parsed.values.product.barcode ?? "",
        stock: parsed.values.product.stock.toString(),
        lowStockThreshold: parsed.values.product.lowStockThreshold.toString(),
        weight: parsed.values.product.weight ?? "",
        categoryId: parsed.values.product.categoryId?.toString() ?? "",
        status: parsed.values.product.status,
        isFeatured: parsed.values.product.isFeatured,
        tags: parsed.values.product.tags?.join(", ") ?? "",
        keyFeatures: parsed.values.product.keyFeatures?.join("\n") ?? "",
        metaTitle: parsed.values.product.metaTitle ?? "",
        metaDescription: parsed.values.product.metaDescription ?? "",
      },
      images: parsed.values.images.map((image) => ({
        url: image.url,
        publicId: image.publicId,
        altText: image.altText ?? "",
      })),
    },
  };
}
