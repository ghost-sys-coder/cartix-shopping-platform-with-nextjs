import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { categories, productImages, products, reviews } from "@/db/schema";

const FALLBACK_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600";
const FALLBACK_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600";

export interface HomeProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  badge?: string;
}

export interface HomeCategory {
  id: number;
  name: string;
  slug: string;
  imageUrl: string;
  productCount: number;
}

export interface HomePageData {
  featuredProducts: HomeProduct[];
  categories: HomeCategory[];
}

interface HomeProductRow {
  id: number;
  name: string;
  slug: string;
  price: string;
  compareAtPrice: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  reviewCount: number;
  rating: string | number | null;
}

interface HomeCategoryRow {
  id: number;
  name: string;
  slug: string;
  imageUrl: string | null;
}

type HomeProductQueryRow = Omit<HomeProductRow, "reviewCount" | "rating">;

interface HomeReviewRow {
  productId: number;
  reviewCount: number;
  rating: string | number | null;
}

interface HomeCategoryCountRow {
  categoryId: number | null;
  count: number;
}

interface LoadHomePageQueryRowsOptions<T> {
  label: string;
  load: () => Promise<T[]>;
  fallback: T[];
  retries?: number;
  retryDelayMs?: number;
  onError?: (label: string, error: unknown) => void;
}

function numericValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function loadHomePageQueryRows<T>({
  label,
  load,
  fallback,
  retries = 1,
  retryDelayMs = 150,
  onError = (queryLabel, error) => {
    console.error(`Home page query failed: ${queryLabel}`, error);
  },
}: LoadHomePageQueryRowsOptions<T>): Promise<T[]> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await load();
    } catch (error) {
      lastError = error;
      if (attempt < retries && retryDelayMs > 0) {
        await wait(retryDelayMs);
      }
    }
  }

  onError(label, lastError);
  return fallback;
}

export function mapHomeProductRows(rows: HomeProductRow[]): HomeProduct[] {
  return rows.map((row) => {
    const compareAtPrice = numericValue(row.compareAtPrice);
    const rating = numericValue(row.rating) ?? 0;

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      price: numericValue(row.price) ?? 0,
      compareAtPrice,
      imageUrl: row.imageUrl ?? FALLBACK_PRODUCT_IMAGE,
      rating: Math.round(rating * 10) / 10,
      reviewCount: row.reviewCount,
      badge: row.isFeatured ? "Featured" : undefined,
    };
  });
}

export function mapHomeCategoryRows(
  rows: HomeCategoryRow[],
  productCounts: Map<number, number>
): HomeCategory[] {
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    imageUrl: row.imageUrl ?? FALLBACK_CATEGORY_IMAGE,
    productCount: productCounts.get(row.id) ?? 0,
  }));
}

export async function getHomePageData(): Promise<HomePageData> {
  const [productRows, reviewRows, categoryRows, categoryCountRows] =
    await Promise.all([
      loadHomePageQueryRows<HomeProductQueryRow>({
        label: "featured products",
        fallback: [],
        load: () =>
          db
            .select({
              id: products.id,
              name: products.name,
              slug: products.slug,
              price: products.price,
              compareAtPrice: products.compareAtPrice,
              imageUrl: productImages.url,
              isFeatured: products.isFeatured,
            })
            .from(products)
            .leftJoin(
              productImages,
              and(
                eq(productImages.productId, products.id),
                eq(productImages.isPrimary, true)
              )
            )
            .where(eq(products.status, "active"))
            .orderBy(desc(products.isFeatured), desc(products.createdAt))
            .limit(4),
      }),
      loadHomePageQueryRows<HomeReviewRow>({
        label: "product review summaries",
        fallback: [],
        load: () =>
          db
            .select({
              productId: reviews.productId,
              reviewCount: sql<number>`COUNT(*)::int`,
              rating: sql<string>`ROUND(AVG(${reviews.rating})::numeric, 2)::text`,
            })
            .from(reviews)
            .where(eq(reviews.isApproved, true))
            .groupBy(reviews.productId),
      }),
      loadHomePageQueryRows<HomeCategoryRow>({
        label: "featured categories",
        fallback: [],
        load: () =>
          db
            .select({
              id: categories.id,
              name: categories.name,
              slug: categories.slug,
              imageUrl: categories.imageUrl,
            })
            .from(categories)
            .where(eq(categories.isActive, true))
            .orderBy(asc(categories.sortOrder), asc(categories.name))
            .limit(4),
      }),
      loadHomePageQueryRows<HomeCategoryCountRow>({
        label: "category product counts",
        fallback: [],
        load: () =>
          db
            .select({
              categoryId: products.categoryId,
              count: sql<number>`COUNT(*)::int`,
            })
            .from(products)
            .where(eq(products.status, "active"))
            .groupBy(products.categoryId),
      }),
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
  const productCountsByCategory = new Map(
    categoryCountRows
      .filter((row) => row.categoryId !== null)
      .map((row) => [row.categoryId as number, Number(row.count)])
  );

  return {
    featuredProducts: mapHomeProductRows(
      productRows.map((row) => ({
        ...row,
        reviewCount: reviewsByProduct.get(row.id)?.reviewCount ?? 0,
        rating: reviewsByProduct.get(row.id)?.rating ?? null,
      }))
    ),
    categories: mapHomeCategoryRows(categoryRows, productCountsByCategory),
  };
}
