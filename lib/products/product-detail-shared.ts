export interface ProductDetailImage {
  id: number;
  url: string;
  altText: string;
}

export interface ProductDetailVariant {
  id: number;
  name: string;
  value: string;
  price?: number;
  stock: number;
  imageUrl?: string;
}

export interface ProductDetailCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductDetailProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  stock: number;
  stockLabel: string;
  isFeatured: boolean;
  tags: string[];
  keyFeatures: string[];
  category: ProductDetailCategory | null;
  images: ProductDetailImage[];
  variants: ProductDetailVariant[];
  rating: number;
  reviewCount: number;
  badge?: string;
}

export interface RelatedProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  badge?: string;
}

export interface ProductDetailData {
  product: ProductDetailProduct;
  relatedProducts: RelatedProduct[];
}
