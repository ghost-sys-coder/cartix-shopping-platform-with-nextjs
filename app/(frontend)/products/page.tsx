import { ProductShopPage } from "@/components/frontend/products/product-shop-page";
import {
  getProductCatalogData,
  parseCatalogFilters,
} from "@/lib/products/product-catalog";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseCatalogFilters(await searchParams);
  const catalog = await getProductCatalogData(filters);

  return <ProductShopPage catalog={catalog} filters={filters} />;
}
