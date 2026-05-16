import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { categories, orderItems, productImages, products } from "@/db/schema";
import { ProductList } from "@/components/admin/products/product-list";
import type { AdminProductListItem } from "@/components/admin/products/product-list-types";

async function getAdminProducts(): Promise<AdminProductListItem[]> {
  const [productRows, salesRows] = await Promise.all([
    db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        sku: products.sku,
        categoryName: categories.name,
        price: products.price,
        stock: products.stock,
        status: products.status,
        imageUrl: productImages.url,
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
      .orderBy(desc(products.createdAt)),
    db
      .select({
        productId: orderItems.productId,
        sales: sql<number>`COALESCE(SUM(${orderItems.quantity}), 0)::int`,
      })
      .from(orderItems)
      .groupBy(orderItems.productId),
  ]);

  const sales = new Map(salesRows.map((row) => [row.productId, Number(row.sales)]));

  return productRows.map((product) => ({
    ...product,
    sales: sales.get(product.id) ?? 0,
  }));
}

export default async function AdminProductsPage() {
  const adminProducts = await getAdminProducts();

  return <ProductList products={adminProducts} />;
}
