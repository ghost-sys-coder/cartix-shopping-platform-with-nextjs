import type { Metadata } from "next";
import { ProductSearchPage } from "@/components/frontend/search/product-search-page";
import {
  getProductSearchData,
  normalizeSearchQuery,
} from "@/lib/search/product-search";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  description: "Search active products in the Cartix storefront.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = normalizeSearchQuery((await searchParams).q);
  const search = await getProductSearchData(query);

  return <ProductSearchPage search={search} />;
}
