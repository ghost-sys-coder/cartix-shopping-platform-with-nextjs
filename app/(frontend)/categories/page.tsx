import type { Metadata } from "next";
import { CategoriesPage } from "@/components/frontend/categories/categories-page";
import { getCategoryCatalogData } from "@/lib/categories/category-catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse Cartix categories and shop products by collection.",
};

export default async function CategoriesRoutePage() {
  const catalog = await getCategoryCatalogData();

  return <CategoriesPage catalog={catalog} />;
}
