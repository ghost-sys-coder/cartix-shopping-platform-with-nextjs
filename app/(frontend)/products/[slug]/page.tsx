import { notFound } from "next/navigation";
import { ProductDetailPage } from "@/components/frontend/product-detail/product-detail-page";
import { getProductDetailData } from "@/lib/products/product-detail";

export const dynamic = "force-dynamic";

export default async function ProductSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const detail = await getProductDetailData(slug);

  if (!detail) notFound();

  return <ProductDetailPage detail={detail} />;
}
