import { notFound } from "next/navigation";
import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import { ProductCreateForm } from "@/components/admin/products/product-create-form";
import type { ProductCategoryOption } from "@/components/admin/products/product-form-types";

async function getProductCategories(): Promise<ProductCategoryOption[]> {
  return db
    .select({
      id: categories.id,
      name: categories.name,
      parentId: categories.parentId,
    })
    .from(categories)
    .orderBy(categories.sortOrder, categories.name);
}

export default async function AdminProductFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id !== "new") {
    notFound();
  }

  const productCategories = await getProductCategories();

  return <ProductCreateForm categories={productCategories} />;
}
