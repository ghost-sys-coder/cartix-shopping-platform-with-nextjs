"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Filter, Edit2, Trash2, Eye, MoreHorizontal, TrendingUp } from "lucide-react";

const PRODUCTS = [
  { id: 1, name: "Premium Wireless Headphones", sku: "HP-WL-001", category: "Electronics", price: 249.99, stock: 42, status: "active", sales: 124, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80" },
  { id: 2, name: "Minimalist Leather Watch", sku: "WT-LT-002", category: "Fashion", price: 189.00, stock: 18, status: "active", sales: 87, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80" },
  { id: 3, name: "Smart Fitness Tracker", sku: "FT-SM-003", category: "Electronics", price: 99.00, stock: 3, status: "active", sales: 203, image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=80" },
  { id: 4, name: "Portable Bluetooth Speaker", sku: "SP-BT-004", category: "Electronics", price: 79.99, stock: 55, status: "active", sales: 56, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=80" },
  { id: 5, name: "Mechanical Keyboard", sku: "KB-MC-005", category: "Electronics", price: 159.00, stock: 0, status: "archived", sales: 89, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=80" },
];

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = PRODUCTS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-headline font-black tracking-tight">Products</h1>
          <p className="text-muted-foreground text-sm font-body mt-1">{PRODUCTS.length} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-brand flex items-center gap-2 px-4 py-2.5 text-sm"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products or SKU..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-body"
          />
        </div>
        <div className="flex items-center gap-2">
          {["all", "active", "draft", "archived"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-label font-semibold rounded-lg capitalize transition-colors ${
                statusFilter === s ? "text-white" : "border border-border text-muted-foreground hover:bg-muted"
              }`}
              style={statusFilter === s ? { background: "var(--brand-primary)" } : {}}
            >
              {s}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-1.5 h-9 px-3 text-sm font-label border border-border rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <Filter size={14} />
          Filters
        </button>
      </div>

      {/* Table */}
      <div className="rounded-[var(--radius-auth)] border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Product", "SKU", "Category", "Price", "Stock", "Sales", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-label font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((product, i) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <span className="text-sm font-label font-semibold line-clamp-1">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{product.sku}</td>
                  <td className="px-4 py-3 text-xs font-label text-muted-foreground">{product.category}</td>
                  <td className="px-4 py-3 text-sm font-label font-bold" style={{ color: "var(--brand-primary)" }}>${product.price}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-label font-semibold ${product.stock === 0 ? "text-red-600" : product.stock <= 5 ? "text-amber-600" : "text-green-600"}`}>
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
                    <span className={`text-[11px] font-label font-bold px-2 py-0.5 rounded-full capitalize ${
                      product.status === "active" ? "bg-green-50 text-green-600" :
                      product.status === "draft" ? "bg-amber-50 text-amber-600" :
                      "bg-gray-100 text-gray-500"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/products/${product.id}`} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Eye size={13} />
                      </Link>
                      <Link href={`/admin/products/${product.id}`} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Edit2 size={13} />
                      </Link>
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
            <MoreHorizontal size={32} className="text-muted-foreground/40" />
            <p className="font-label font-semibold text-muted-foreground">No products found</p>
            <p className="text-xs text-muted-foreground font-body">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
