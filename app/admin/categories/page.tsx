import { sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { categories, products } from "@/db/schema";
import { CategoryManager } from "@/components/admin/categories/category-manager";
import type { AdminCategory } from "@/components/admin/categories/category-types";

async function getAdminCategories(): Promise<AdminCategory[]> {
  const [categoryRows, countRows] = await Promise.all([
    db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        imageUrl: categories.imageUrl,
        parentId: categories.parentId,
        isActive: categories.isActive,
        sortOrder: categories.sortOrder,
      })
      .from(categories)
      .orderBy(categories.sortOrder, categories.name),
    db
      .select({
        categoryId: products.categoryId,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(products)
      .groupBy(products.categoryId),
  ]);

  const counts = new Map(
    countRows
      .filter((row) => row.categoryId !== null)
      .map((row) => [row.categoryId as number, Number(row.count)])
  );

  return categoryRows.map((category) => ({
    ...category,
    productCount: counts.get(category.id) ?? 0,
  }));
}

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return <CategoryManager initialCategories={categories} />;
}
