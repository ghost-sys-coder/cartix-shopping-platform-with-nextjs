import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { categories, productImages, products, reviews } from "@/db/schema";
import type {
  ProductSearchData,
  ProductSearchResult,
} from "@/lib/search/product-search-shared";

export type {
  ProductSearchData,
  ProductSearchResult,
} from "@/lib/search/product-search-shared";

const FALLBACK_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600";
const SEARCH_LIMIT = 24;

type SearchParamValue = string | string[] | undefined;

interface ProductSearchRow {
  id: number;
  name: string;
  slug: string;
  price: string;
  compareAtPrice: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  categoryName: string | null;
  reviewCount: number;
  rating: string | number | null;
}

function numericValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function normalizeSearchQuery(value: SearchParamValue) {
  const query = Array.isArray(value) ? value[0] : value;
  return (query ?? "").trim().replace(/\s+/g, " ").slice(0, 120);
}

export function mapProductSearchRows(
  rows: ProductSearchRow[]
): ProductSearchResult[] {
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
      categoryName: row.categoryName,
    };
  });
}

export async function getProductSearchData(
  query: string
): Promise<ProductSearchData> {
  const normalizedQuery = normalizeSearchQuery(query);
  if (!normalizedQuery) {
    return { query: "", results: [], resultCount: 0 };
  }

  const likeQuery = `%${normalizedQuery}%`;

  const [productRows, reviewRows] = await Promise.all([
    db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        compareAtPrice: products.compareAtPrice,
        imageUrl: productImages.url,
        isFeatured: products.isFeatured,
        categoryName: categories.name,
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
      .where(
        and(
          eq(products.status, "active"),
          or(
            ilike(products.name, likeQuery),
            ilike(products.slug, likeQuery),
            sql`COALESCE(${products.sku}, '') ILIKE ${likeQuery}`,
            sql`COALESCE(${products.description}, '') ILIKE ${likeQuery}`,
            sql`COALESCE(${products.shortDescription}, '') ILIKE ${likeQuery}`,
            sql`COALESCE(${categories.name}, '') ILIKE ${likeQuery}`,
            sql`COALESCE(array_to_string(${products.tags}, ' '), '') ILIKE ${likeQuery}`,
            sql`COALESCE(array_to_string(${products.keyFeatures}, ' '), '') ILIKE ${likeQuery}`
          )
        )
      )
      .orderBy(desc(products.isFeatured), desc(products.createdAt))
      .limit(SEARCH_LIMIT),
    db
      .select({
        productId: reviews.productId,
        reviewCount: sql<number>`COUNT(*)::int`,
        rating: sql<string>`ROUND(AVG(${reviews.rating})::numeric, 2)::text`,
      })
      .from(reviews)
      .where(eq(reviews.isApproved, true))
      .groupBy(reviews.productId),
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
  const results = mapProductSearchRows(
    productRows.map((row) => ({
      ...row,
      reviewCount: reviewsByProduct.get(row.id)?.reviewCount ?? 0,
      rating: reviewsByProduct.get(row.id)?.rating ?? null,
    }))
  );

  return {
    query: normalizedQuery,
    results,
    resultCount: results.length,
  };
}
