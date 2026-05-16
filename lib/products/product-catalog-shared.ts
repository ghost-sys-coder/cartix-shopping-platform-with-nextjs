export const CATALOG_SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "bestsellers", label: "Best Sellers" },
  { value: "rating", label: "Top Rated" },
] as const;

export type CatalogSort = (typeof CATALOG_SORT_OPTIONS)[number]["value"];

export interface CatalogFilters {
  categories: string[];
  priceMax: number;
  minRating: number;
  saleOnly: boolean;
  sort: CatalogSort;
}

export interface CatalogProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  categorySlug: string | null;
  createdAt: Date;
  sales: number;
}

export interface CatalogCategoryOption {
  id: number;
  name: string;
  slug: string;
  productCount: number;
}

export interface ProductCatalogData {
  products: CatalogProduct[];
  categories: CatalogCategoryOption[];
  productCount: number;
  maxPrice: number;
}
