import type { ProductStatus } from "@/lib/products/product-input";

export interface ProductCategoryOption {
  id: number;
  name: string;
  parentId: number | null;
}

export interface ProductFormImage {
  url: string;
  publicId: string;
  altText: string;
}

export interface ProductFormState {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: string;
  compareAtPrice: string;
  costPrice: string;
  sku: string;
  barcode: string;
  stock: string;
  lowStockThreshold: string;
  weight: string;
  categoryId: string;
  status: ProductStatus;
  isFeatured: boolean;
  tags: string;
  keyFeatures: string;
  metaTitle: string;
  metaDescription: string;
}

export const EMPTY_PRODUCT_FORM: ProductFormState = {
  name: "",
  slug: "",
  description: "",
  shortDescription: "",
  price: "",
  compareAtPrice: "",
  costPrice: "",
  sku: "",
  barcode: "",
  stock: "0",
  lowStockThreshold: "5",
  weight: "",
  categoryId: "",
  status: "draft",
  isFeatured: false,
  tags: "",
  keyFeatures: "",
  metaTitle: "",
  metaDescription: "",
};
