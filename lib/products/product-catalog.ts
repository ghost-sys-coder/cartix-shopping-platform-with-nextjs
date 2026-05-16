import { and, asc, eq, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import {
  categories,
  orderItems,
  productImages,
  products,
  reviews,
} from "@/db/schema";
import {
  CATALOG_SORT_OPTIONS,
  type CatalogFilters,
  type CatalogProduct,
  type CatalogSort,
  type ProductCatalogData,
} from "@/lib/products/product-catalog-shared";

export type {
  CatalogCategoryOption,
  CatalogFilters,
  CatalogProduct,
  CatalogSort,
  ProductCatalogData,
} from "@/lib/products/product-catalog-shared";

const FALLBACK_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600";
const DEFAULT_PRICE_MAX = 1000;

type SearchParamValue = string | string[] | undefined;
type SearchParams = Record<string, SearchParamValue>;

interface CatalogProductRow {
  id: number;
  name: string;
  slug: string;
  price: string;
  compareAtPrice: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  createdAt: Date;
  categorySlug: string | null;
  reviewCount: number;
  rating: string | number | null;
  sales: number;
}

function firstParam(value: SearchParamValue) {
  return Array.isArray(value) ? value[0] : value;
}

function arrayParam(value: SearchParamValue) {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return values
    .flatMap((item) => item.split(","))
    .map((item) => item.trim())
    .filter(Boolean);
}

function boundedNumber(
  value: SearchParamValue,
  fallback: number,
  minimum: number,
  maximum: number
) {
  const parsed = Number(firstParam(value));
  if (!Number.isFinite(parsed)) return fallback;
  if (parsed < minimum || parsed > maximum) return fallback;
  return parsed;
}

function numericValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function sortValue(value: SearchParamValue): CatalogSort {
  const sort = firstParam(value);
  return CATALOG_SORT_OPTIONS.some((option) => option.value === sort)
    ? (sort as CatalogSort)
    : "newest";
}

export function parseCatalogFilters(params: SearchParams): CatalogFilters {
  return {
    categories: arrayParam(params.category),
    priceMax: boundedNumber(params.priceMax, DEFAULT_PRICE_MAX, 0, 100000),
    minRating: boundedNumber(params.rating, 0, 0, 5),
    saleOnly: firstParam(params.sale) === "true",
    sort: sortValue(params.sort),
  };
}

export function mapCatalogProductRows(
  rows: CatalogProductRow[]
): CatalogProduct[] {
  return rows.map((row) => {
    const price = numericValue(row.price) ?? 0;
    const compareAtPrice = numericValue(row.compareAtPrice);
    const rating = numericValue(row.rating) ?? 0;
    const isSale =
      compareAtPrice !== undefined && compareAtPrice > price && price > 0;

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      price,
      compareAtPrice,
      imageUrl: row.imageUrl ?? FALLBACK_PRODUCT_IMAGE,
      rating: Math.round(rating * 10) / 10,
      reviewCount: row.reviewCount,
      badge: row.isFeatured ? "Featured" : isSale ? "Sale" : undefined,
      categorySlug: row.categorySlug,
      createdAt: row.createdAt,
      sales: row.sales,
    };
  });
}

function applyCatalogFilters(
  products: CatalogProduct[],
  filters: CatalogFilters
) {
  const categorySet = new Set(filters.categories);

  return products
    .filter((product) =>
      categorySet.size === 0
        ? true
        : product.categorySlug !== null && categorySet.has(product.categorySlug)
    )
    .filter((product) => product.price <= filters.priceMax)
    .filter((product) => product.rating >= filters.minRating)
    .filter((product) =>
      filters.saleOnly
        ? product.compareAtPrice !== undefined &&
          product.compareAtPrice > product.price
        : true
    )
    .sort((first, second) => {
      if (filters.sort === "price-asc") return first.price - second.price;
      if (filters.sort === "price-desc") return second.price - first.price;
      if (filters.sort === "bestsellers") return second.sales - first.sales;
      if (filters.sort === "rating") return second.rating - first.rating;
      return second.createdAt.getTime() - first.createdAt.getTime();
    });
}

export async function getProductCatalogData(
  filters: CatalogFilters
): Promise<ProductCatalogData> {
  const [productRows, reviewRows, salesRows, categoryRows, categoryCountRows] =
    await Promise.all([
      db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          price: products.price,
          compareAtPrice: products.compareAtPrice,
          imageUrl: productImages.url,
          isFeatured: products.isFeatured,
          createdAt: products.createdAt,
          categorySlug: categories.slug,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .leftJoin(
          productImages,
          and(
            eq(productImages.productId, products.id),
            eq(productImages.isPrimary, true)
          )
        )
        .where(eq(products.status, "active")),
      db
        .select({
          productId: reviews.productId,
          reviewCount: sql<number>`COUNT(*)::int`,
          rating: sql<string>`ROUND(AVG(${reviews.rating})::numeric, 2)::text`,
        })
        .from(reviews)
        .where(eq(reviews.isApproved, true))
        .groupBy(reviews.productId),
      db
        .select({
          productId: orderItems.productId,
          sales: sql<number>`COALESCE(SUM(${orderItems.quantity}), 0)::int`,
        })
        .from(orderItems)
        .groupBy(orderItems.productId),
      db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        })
        .from(categories)
        .where(eq(categories.isActive, true))
        .orderBy(asc(categories.sortOrder), asc(categories.name)),
      db
        .select({
          categoryId: products.categoryId,
          count: sql<number>`COUNT(*)::int`,
        })
        .from(products)
        .where(eq(products.status, "active"))
        .groupBy(products.categoryId),
    ]);

  const reviewsByProduct = new Map(
    reviewRows.map((row) => [
      row.productId,
      {
        reviewCount: Number(row.reviewCount),
        rating: row.rating,
      },
    ])
  );
  const salesByProduct = new Map(
    salesRows.map((row) => [row.productId, Number(row.sales)])
  );
  const productCountsByCategory = new Map(
    categoryCountRows
      .filter((row) => row.categoryId !== null)
      .map((row) => [row.categoryId as number, Number(row.count)])
  );
  const allProducts = mapCatalogProductRows(
    productRows.map((row) => ({
      ...row,
      reviewCount: reviewsByProduct.get(row.id)?.reviewCount ?? 0,
      rating: reviewsByProduct.get(row.id)?.rating ?? null,
      sales: salesByProduct.get(row.id) ?? 0,
    }))
  );
  const filteredProducts = applyCatalogFilters(allProducts, filters);
  const maxCatalogPrice = Math.max(
    DEFAULT_PRICE_MAX,
    ...allProducts.map((product) => Math.ceil(product.price))
  );

  return {
    products: filteredProducts,
    categories: categoryRows.map((category) => ({
      ...category,
      productCount: productCountsByCategory.get(category.id) ?? 0,
    })),
    productCount: filteredProducts.length,
    maxPrice: maxCatalogPrice,
  };
}
