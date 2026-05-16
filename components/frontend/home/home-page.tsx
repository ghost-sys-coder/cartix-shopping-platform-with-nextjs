import type { HomePageData } from "@/lib/home/home-data";
import { HomeCategoryShowcase } from "@/components/frontend/home/home-category-showcase";
import { HomeFeaturedProductsSection } from "@/components/frontend/home/home-featured-products-section";
import { HomeFeaturesStrip } from "@/components/frontend/home/home-features-strip";
import { HomeHeroSection } from "@/components/frontend/home/home-hero-section";
import { HomePromoBanner } from "@/components/frontend/home/home-promo-banner";

interface HomePageProps {
  data: HomePageData;
}

export function HomePage({ data }: HomePageProps) {
  return (
    <div className="overflow-x-hidden">
      <HomeHeroSection />
      <HomeFeaturesStrip />
      <HomeCategoryShowcase categories={data.categories} />
      <HomeFeaturedProductsSection products={data.featuredProducts} />
      <HomePromoBanner />
    </div>
  );
}
