import { auth } from "@clerk/nextjs/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import {
  categories,
  productImages,
  products,
  users,
  wishlists,
} from "@/db/schema";
import { syncCurrentClerkUserToDb } from "@/lib/auth/user-sync";
import type { WishlistData, WishlistItem } from "@/lib/wishlist/wishlist-shared";

export type {
  WishlistData,
  WishlistItem,
  WishlistProduct,
} from "@/lib/wishlist/wishlist-shared";

const FALLBACK_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600";

interface WishlistRow {
  wishlistId: number;
  createdAt: Date;
  productId: number;
  name: string;
  slug: string;
  price: string;
  compareAtPrice: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  stock: number;
  categoryName: string | null;
}

interface ResolveWishlistUserIdInput {
  clerkUserId: string | null;
  findUserIdByClerkId: (clerkUserId: string) => Promise<number | null>;
  syncCurrentUserToDb: () => Promise<unknown>;
  onSyncError?: (error: unknown) => void;
}

function numericValue(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function productBadge({
  isFeatured,
  price,
  compareAtPrice,
}: {
  isFeatured: boolean;
  price: number;
  compareAtPrice?: number;
}) {
  if (isFeatured) return "Featured";
  return compareAtPrice !== undefined && compareAtPrice > price ? "Sale" : undefined;
}

export function mapWishlistRows(rows: WishlistRow[]): WishlistItem[] {
  return rows.map((row) => {
    const price = numericValue(row.price) ?? 0;
    const compareAtPrice = numericValue(row.compareAtPrice);

    return {
      wishlistId: row.wishlistId,
      addedAt: row.createdAt,
      product: {
        id: row.productId,
        name: row.name,
        slug: row.slug,
        price,
        compareAtPrice,
        imageUrl: row.imageUrl ?? FALLBACK_PRODUCT_IMAGE,
        badge: productBadge({
          isFeatured: row.isFeatured,
          price,
          compareAtPrice,
        }),
        stock: row.stock,
        categoryName: row.categoryName,
      },
    };
  });
}

async function findDbUserIdByClerkId(clerkUserId: string) {
  const [dbUser] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.clerkId, clerkUserId))
    .limit(1);

  return dbUser?.id ?? null;
}

export async function resolveWishlistUserId({
  clerkUserId,
  findUserIdByClerkId,
  syncCurrentUserToDb,
  onSyncError,
}: ResolveWishlistUserIdInput) {
  if (!clerkUserId) return null;

  const existingUserId = await findUserIdByClerkId(clerkUserId);
  if (existingUserId) return existingUserId;

  try {
    await syncCurrentUserToDb();
  } catch (error) {
    onSyncError?.(error);
    return null;
  }

  return findUserIdByClerkId(clerkUserId);
}

export async function getCurrentDbUserId() {
  const { userId } = await auth();

  return resolveWishlistUserId({
    clerkUserId: userId,
    findUserIdByClerkId: findDbUserIdByClerkId,
    syncCurrentUserToDb: syncCurrentClerkUserToDb,
    onSyncError: (error) => console.warn("Wishlist user sync failed:", error),
  });
}

export async function getCurrentWishlistData(): Promise<WishlistData | null> {
  const userId = await getCurrentDbUserId();
  if (!userId) return null;

  const rows = await db
    .select({
      wishlistId: wishlists.id,
      createdAt: wishlists.createdAt,
      productId: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      compareAtPrice: products.compareAtPrice,
      imageUrl: productImages.url,
      isFeatured: products.isFeatured,
      stock: products.stock,
      categoryName: categories.name,
    })
    .from(wishlists)
    .innerJoin(products, eq(wishlists.productId, products.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(
      productImages,
      and(
        eq(productImages.productId, products.id),
        eq(productImages.isPrimary, true)
      )
    )
    .where(and(eq(wishlists.userId, userId), eq(products.status, "active")))
    .orderBy(desc(wishlists.createdAt));

  const items = mapWishlistRows(rows);

  return {
    items,
    itemCount: items.length,
  };
}

export async function isProductWishlisted(productId: number) {
  const userId = await getCurrentDbUserId();
  if (!userId) return false;

  const [item] = await db
    .select({ id: wishlists.id })
    .from(wishlists)
    .where(and(eq(wishlists.userId, userId), eq(wishlists.productId, productId)))
    .limit(1);

  return Boolean(item);
}

export async function addProductToWishlist(productId: number) {
  const userId = await getCurrentDbUserId();
  if (!userId) return { ok: false as const, status: 401, error: "Sign in required" };

  const [product] = await db
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.id, productId), eq(products.status, "active")))
    .limit(1);
  if (!product) return { ok: false as const, status: 404, error: "Product not found" };

  await db
    .insert(wishlists)
    .values({ userId, productId })
    .onConflictDoNothing({
      target: [wishlists.userId, wishlists.productId],
    });

  return { ok: true as const, wishlisted: true };
}

export async function removeProductFromWishlist(productId: number) {
  const userId = await getCurrentDbUserId();
  if (!userId) return { ok: false as const, status: 401, error: "Sign in required" };

  await db
    .delete(wishlists)
    .where(and(eq(wishlists.userId, userId), eq(wishlists.productId, productId)));

  return { ok: true as const, wishlisted: false };
}
