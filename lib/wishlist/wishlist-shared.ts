export interface WishlistProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  badge?: string;
  stock: number;
  categoryName: string | null;
}

export interface WishlistItem {
  wishlistId: number;
  addedAt: Date;
  product: WishlistProduct;
}

export interface WishlistData {
  items: WishlistItem[];
  itemCount: number;
}
