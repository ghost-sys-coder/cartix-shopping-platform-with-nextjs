export interface StorefrontCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string;
  parentId: number | null;
  productCount: number;
  sortOrder: number;
}

export interface StorefrontCategoryGroup extends StorefrontCategory {
  children: StorefrontCategory[];
}

export interface CategoryCatalogData {
  categories: StorefrontCategoryGroup[];
  featuredCategories: StorefrontCategory[];
  totalCategories: number;
  totalProducts: number;
}
