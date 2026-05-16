import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { categories, productImages, products } from "@/db/schema";
import { ProductCreateForm } from "@/components/admin/products/product-create-form";
import type { ProductCategoryOption } from "@/components/admin/products/product-form-types";
import { mapProductToFormValues } from "@/lib/products/product-input";

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
  const productCategories = await getProductCategories();

  if (id === "new") {
    return <ProductCreateForm categories={productCategories} />;
  }

  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) {
    notFound();
  }

  const [product, images] = await Promise.all([
    db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        shortDescription: products.shortDescription,
        price: products.price,
        compareAtPrice: products.compareAtPrice,
        costPrice: products.costPrice,
        sku: products.sku,
        barcode: products.barcode,
        stock: products.stock,
        lowStockThreshold: products.lowStockThreshold,
        weight: products.weight,
        categoryId: products.categoryId,
        status: products.status,
        isFeatured: products.isFeatured,
        tags: products.tags,
        keyFeatures: products.keyFeatures,
        metaTitle: products.metaTitle,
        metaDescription: products.metaDescription,
      })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1)
      .then((rows) => rows[0] ?? null),
    db
      .select({
        id: productImages.id,
        url: productImages.url,
        publicId: productImages.publicId,
        altText: productImages.altText,
      })
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(asc(productImages.sortOrder), asc(productImages.id)),
  ]);

  if (!product) {
    notFound();
  }

  const initialValues = mapProductToFormValues({ product, images });

  return (
    <ProductCreateForm
      categories={productCategories}
      productId={product.id}
      initialForm={initialValues.form}
      initialImages={initialValues.images}
    />
  );
}
