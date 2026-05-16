export interface AdminProductListItem {
  id: number;
  name: string;
  slug: string;
  sku: string | null;
  categoryName: string | null;
  price: string;
  stock: number;
  status: "draft" | "active" | "archived";
  imageUrl: string | null;
  sales: number;
}
