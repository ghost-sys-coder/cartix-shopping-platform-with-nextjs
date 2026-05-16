"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, ImageIcon, TrendingUp } from "lucide-react";
import type { AdminProductListItem } from "@/components/admin/products/product-list-types";

interface ProductTableRowProps {
  product: AdminProductListItem;
}

export function ProductTableRow({ product }: ProductTableRowProps) {
  return (
    <tr className="hover:bg-muted/30 transition-colors group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0 flex items-center justify-center">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <ImageIcon size={16} className="text-muted-foreground" />
            )}
          </div>
          <span className="text-sm font-label font-semibold line-clamp-1">
            {product.name}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
        {product.sku ?? "-"}
      </td>
      <td className="px-4 py-3 text-xs font-label text-muted-foreground">
        {product.categoryName ?? "Uncategorized"}
      </td>
      <td
        className="px-4 py-3 text-sm font-label font-bold"
        style={{ color: "var(--brand-primary)" }}
      >
        ${Number(product.price).toFixed(2)}
      </td>
      <td className="px-4 py-3">
        <span
          className={`text-xs font-label font-semibold ${
            product.stock === 0
              ? "text-red-600"
              : product.stock <= 5
                ? "text-amber-600"
                : "text-green-600"
          }`}
        >
          {product.stock === 0 ? "Out of stock" : `${product.stock} units`}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 text-xs font-label text-muted-foreground">
          <TrendingUp size={11} style={{ color: "var(--brand-primary)" }} />
          {product.sales}
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={`text-[11px] font-label font-bold px-2 py-0.5 rounded-full capitalize ${
            product.status === "active"
              ? "bg-green-50 text-green-600"
              : product.status === "draft"
                ? "bg-amber-50 text-amber-600"
                : "bg-gray-100 text-gray-500"
          }`}
        >
          {product.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/products/${product.slug}`}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label={`View ${product.name}`}
          >
            <Eye size={13} />
          </Link>
        </div>
      </td>
    </tr>
  );
}
