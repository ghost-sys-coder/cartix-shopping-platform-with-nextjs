export interface ProductSearchResult {
  id: number;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  categoryName: string | null;
}

export interface ProductSearchData {
  query: string;
  results: ProductSearchResult[];
  resultCount: number;
}
