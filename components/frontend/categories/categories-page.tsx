import type { CategoryCatalogData } from "@/lib/categories/category-catalog-shared";
import { CategoriesEmptyState } from "@/components/frontend/categories/categories-empty-state";
import { CategoriesHero } from "@/components/frontend/categories/categories-hero";
import { CategoryGrid } from "@/components/frontend/categories/category-grid";

interface CategoriesPageProps {
  catalog: CategoryCatalogData;
}

export function CategoriesPage({ catalog }: CategoriesPageProps) {
  if (catalog.totalCategories === 0) {
    return <CategoriesEmptyState />;
  }

  return (
    <div className="bg-background">
      <CategoriesHero
        featuredCategories={catalog.featuredCategories}
        totalCategories={catalog.totalCategories}
        totalProducts={catalog.totalProducts}
      />
      <CategoryGrid categories={catalog.categories} />
    </div>
  );
}
