import { asc, eq, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { categories, products } from "@/db/schema";
import type {
  CategoryCatalogData,
  StorefrontCategory,
  StorefrontCategoryGroup,
} from "@/lib/categories/category-catalog-shared";

export type {
  CategoryCatalogData,
  StorefrontCategory,
  StorefrontCategoryGroup,
} from "@/lib/categories/category-catalog-shared";

const FALLBACK_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900";

interface CategoryCatalogRow {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: number | null;
  sortOrder: number;
}

export function mapCategoryCatalogRows(
  rows: CategoryCatalogRow[],
  productCounts: Map<number, number>
): StorefrontCategory[] {
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    imageUrl: row.imageUrl ?? FALLBACK_CATEGORY_IMAGE,
    parentId: row.parentId,
    productCount: productCounts.get(row.id) ?? 0,
    sortOrder: row.sortOrder,
  }));
}

export function buildCategoryHierarchy(
  categories: StorefrontCategory[]
): StorefrontCategoryGroup[] {
  const categoryIds = new Set(categories.map((category) => category.id));
  const childrenByParent = new Map<number, StorefrontCategory[]>();

  for (const category of categories) {
    if (category.parentId === null || !categoryIds.has(category.parentId)) {
      continue;
    }

    const siblings = childrenByParent.get(category.parentId) ?? [];
    siblings.push(category);
    childrenByParent.set(category.parentId, siblings);
  }

  return categories
    .filter(
      (category) =>
        category.parentId === null || !categoryIds.has(category.parentId)
    )
    .map((category) => ({
      ...category,
      children: childrenByParent.get(category.id) ?? [],
    }));
}

export async function getCategoryCatalogData(): Promise<CategoryCatalogData> {
  const [categoryRows, categoryCountRows] = await Promise.all([
    db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        imageUrl: categories.imageUrl,
        parentId: categories.parentId,
        sortOrder: categories.sortOrder,
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

  const productCountsByCategory = new Map(
    categoryCountRows
      .filter((row) => row.categoryId !== null)
      .map((row) => [row.categoryId as number, Number(row.count)])
  );
  const mappedCategories = mapCategoryCatalogRows(
    categoryRows,
    productCountsByCategory
  );
  const featuredCategories = [...mappedCategories]
    .sort(
      (first, second) =>
        second.productCount - first.productCount ||
        first.sortOrder - second.sortOrder ||
        first.name.localeCompare(second.name)
    )
    .slice(0, 3);

  return {
    categories: buildCategoryHierarchy(mappedCategories),
    featuredCategories,
    totalCategories: mappedCategories.length,
    totalProducts: mappedCategories.reduce(
      (total, category) => total + category.productCount,
      0
    ),
  };
}
