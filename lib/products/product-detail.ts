import { and, asc, desc, eq, inArray, ne, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import {
  categories,
  productImages,
  products,
  productVariants,
  reviews,
} from "@/db/schema";
import type {
  ProductDetailData,
  ProductDetailProduct,
  RelatedProduct,
} from "@/lib/products/product-detail-shared";

export type {
  ProductDetailData,
  ProductDetailImage,
  ProductDetailProduct,
  ProductDetailVariant,
  RelatedProduct,
} from "@/lib/products/product-detail-shared";

const FALLBACK_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900";

interface ProductDetailRow {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: string;
  compareAtPrice: string | null;
  sku: string | null;
  stock: number;
  isFeatured: boolean;
  tags: string[] | null;
  keyFeatures: string[] | null;
  categoryId: number | null;
  categoryName: string | null;
  categorySlug: string | null;
}

interface ProductDetailImageRow {
  id: number;
  url: string;
  altText: string | null;
  sortOrder: number;
}

interface ProductDetailVariantRow {
  id: number;
  name: string;
  value: string;
  price: string | null;
  stock: number;
  imageUrl: string | null;
}

interface ProductReviewSummaryRow {
  reviewCount: number;
  rating: string | number | null;
}

interface RelatedProductRow {
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

interface ProductDetailMapperInput {
  product: ProductDetailRow;
  images: ProductDetailImageRow[];
  variants: ProductDetailVariantRow[];
  reviewSummary: ProductReviewSummaryRow | null;
  relatedProducts: RelatedProductRow[];
}

function numericValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function roundedRating(value: string | number | null | undefined) {
  const rating = numericValue(value) ?? 0;
  return Math.round(rating * 10) / 10;
}

function stockLabel(stock: number) {
  if (stock <= 0) return "Out of stock";
  if (stock <= 5) return `Only ${stock} left`;
  return "In stock";
}

function saleBadge(price: number, compareAtPrice: number | undefined) {
  return compareAtPrice !== undefined && compareAtPrice > price
    ? "Sale"
    : undefined;
}

function mapRelatedProductRows(rows: RelatedProductRow[]): RelatedProduct[] {
  return rows.map((row) => {
    const price = numericValue(row.price) ?? 0;
    const compareAtPrice = numericValue(row.compareAtPrice);

    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      price,
      compareAtPrice,
      imageUrl: row.imageUrl ?? FALLBACK_PRODUCT_IMAGE,
      rating: roundedRating(row.rating),
      reviewCount: row.reviewCount,
      badge: row.isFeatured ? "Featured" : saleBadge(price, compareAtPrice),
    };
  });
}

export function mapProductDetailData(
  input: ProductDetailMapperInput
): ProductDetailData {
  const price = numericValue(input.product.price) ?? 0;
  const compareAtPrice = numericValue(input.product.compareAtPrice);
  const images =
    input.images.length > 0
      ? input.images
      : [
          {
            id: 0,
            url: FALLBACK_PRODUCT_IMAGE,
            altText: input.product.name,
            sortOrder: 0,
          },
        ];

  const product: ProductDetailProduct = {
    id: input.product.id,
    name: input.product.name,
    slug: input.product.slug,
    description: input.product.description ?? "",
    shortDescription: input.product.shortDescription ?? "",
    price,
    compareAtPrice,
    sku: input.product.sku ?? undefined,
    stock: input.product.stock,
    stockLabel: stockLabel(input.product.stock),
    isFeatured: input.product.isFeatured,
    tags: input.product.tags ?? [],
    keyFeatures: input.product.keyFeatures ?? [],
    category:
      input.product.categoryId &&
      input.product.categoryName &&
      input.product.categorySlug
        ? {
            id: input.product.categoryId,
            name: input.product.categoryName,
            slug: input.product.categorySlug,
          }
        : null,
    images: images.map((image) => ({
      id: image.id,
      url: image.url,
      altText: image.altText ?? input.product.name,
    })),
    variants: input.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      value: variant.value,
      price: numericValue(variant.price),
      stock: variant.stock,
      imageUrl: variant.imageUrl ?? undefined,
    })),
    rating: roundedRating(input.reviewSummary?.rating),
    reviewCount: input.reviewSummary?.reviewCount ?? 0,
    badge: input.product.isFeatured ? "Featured" : saleBadge(price, compareAtPrice),
  };

  return {
    product,
    relatedProducts: mapRelatedProductRows(input.relatedProducts),
  };
}

export async function getProductDetailData(
  slug: string
): Promise<ProductDetailData | null> {
  const [product] = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      shortDescription: products.shortDescription,
      price: products.price,
      compareAtPrice: products.compareAtPrice,
      sku: products.sku,
      stock: products.stock,
      isFeatured: products.isFeatured,
      tags: products.tags,
      keyFeatures: products.keyFeatures,
      categoryId: categories.id,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.slug, slug), eq(products.status, "active")))
    .limit(1);

  if (!product) return null;

  const [images, variants, reviewRows, relatedRows] = await Promise.all([
    db
      .select({
        id: productImages.id,
        url: productImages.url,
        altText: productImages.altText,
        sortOrder: productImages.sortOrder,
      })
      .from(productImages)
      .where(eq(productImages.productId, product.id))
      .orderBy(asc(productImages.sortOrder), asc(productImages.id)),
    db
      .select({
        id: productVariants.id,
        name: productVariants.name,
        value: productVariants.value,
        price: productVariants.price,
        stock: productVariants.stock,
        imageUrl: productVariants.imageUrl,
      })
      .from(productVariants)
      .where(eq(productVariants.productId, product.id))
      .orderBy(asc(productVariants.id)),
    db
      .select({
        reviewCount: sql<number>`COUNT(*)::int`,
        rating: sql<string>`ROUND(AVG(${reviews.rating})::numeric, 2)::text`,
      })
      .from(reviews)
      .where(and(eq(reviews.productId, product.id), eq(reviews.isApproved, true))),
    product.categoryId
      ? db
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
          .where(
            and(
              eq(products.status, "active"),
              eq(products.categoryId, product.categoryId),
              ne(products.id, product.id)
            )
          )
          .orderBy(desc(products.isFeatured), desc(products.createdAt))
          .limit(3)
      : Promise.resolve([]),
  ]);

  const relatedReviewRows =
    relatedRows.length > 0
      ? await db
          .select({
            productId: reviews.productId,
            reviewCount: sql<number>`COUNT(*)::int`,
            rating: sql<string>`ROUND(AVG(${reviews.rating})::numeric, 2)::text`,
          })
          .from(reviews)
          .where(
            and(
              inArray(
                reviews.productId,
                relatedRows.map((row) => row.id)
              ),
              eq(reviews.isApproved, true)
            )
          )
          .groupBy(reviews.productId)
      : [];

  const relatedReviewsByProduct = new Map(
    relatedReviewRows.map((row) => [
      row.productId,
      {
        reviewCount: Number(row.reviewCount),
        rating: row.rating,
      },
    ])
  );

  return mapProductDetailData({
    product,
    images,
    variants,
    reviewSummary: reviewRows[0]
      ? {
          reviewCount: Number(reviewRows[0].reviewCount),
          rating: reviewRows[0].rating,
        }
      : null,
    relatedProducts: relatedRows.map((row) => ({
      ...row,
      reviewCount: relatedReviewsByProduct.get(row.id)?.reviewCount ?? 0,
      rating: relatedReviewsByProduct.get(row.id)?.rating ?? null,
    })),
  });
}
