"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Upload, X, Plus, Save, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminProductFormPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
  ]);
  const [form, setForm] = useState({
    name: "Premium Wireless Headphones",
    slug: "premium-wireless-headphones",
    description: "Experience audio like never before...",
    price: "249.99",
    compareAtPrice: "349.99",
    costPrice: "89.00",
    sku: "HP-WL-001",
    stock: "42",
    category: "1",
    status: "active",
    isFeatured: true,
    tags: "headphones, wireless, audio",
  });

  function update(key: keyof typeof form, val: string | boolean) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Product saved successfully!");
    setSaving(false);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImages((prev) => [...prev, url]);
    toast.success("Image uploaded via Cloudinary");
  }

  const FIELD = (label: string, key: keyof typeof form, type = "text", placeholder = "") => (
    <div>
      <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">{label}</label>
      <input
        type={type}
        value={form[key] as string}
        onChange={(e) => update(key, e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-body"
      />
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground">
            <ChevronLeft size={16} />
          </Link>
          <div>
            <h1 className="text-2xl font-headline font-black tracking-tight">Edit Product</h1>
            <p className="text-muted-foreground text-sm font-body mt-0.5">Update product details</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-label font-semibold border border-border rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <Trash2 size={14} />
            Delete
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saving}
            className="btn-brand flex items-center gap-2 px-5 py-2 text-sm disabled:opacity-60"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save Changes
          </motion.button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic info */}
          <div className="p-5 rounded-[var(--radius-auth)] border border-border bg-card space-y-4">
            <h2 className="font-headline font-bold">Basic Information</h2>
            {FIELD("Product Name", "name", "text", "Enter product name")}
            {FIELD("Slug / URL Handle", "slug", "text", "product-slug")}
            <div>
              <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-body resize-none"
              />
            </div>
            {FIELD("Tags (comma separated)", "tags")}
          </div>

          {/* Media */}
          <div className="p-5 rounded-[var(--radius-auth)] border border-border bg-card">
            <h2 className="font-headline font-bold mb-4">Product Images</h2>
            <div className="grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 text-[9px] font-label font-bold px-1.5 py-0.5 rounded text-white" style={{ background: "var(--brand-primary)" }}>
                      Primary
                    </span>
                  )}
                  <button
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-[var(--brand-primary)] flex flex-col items-center justify-center gap-1.5 transition-colors text-muted-foreground hover:text-[var(--brand-primary)]"
              >
                <Upload size={20} />
                <span className="text-[10px] font-label">Upload</span>
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <p className="text-xs text-muted-foreground font-body mt-3">Images are stored on Cloudinary. Drag to reorder.</p>
          </div>

          {/* Pricing */}
          <div className="p-5 rounded-[var(--radius-auth)] border border-border bg-card">
            <h2 className="font-headline font-bold mb-4">Pricing</h2>
            <div className="grid grid-cols-3 gap-4">
              {FIELD("Sale Price ($)", "price", "number")}
              {FIELD("Compare At Price ($)", "compareAtPrice", "number")}
              {FIELD("Cost Per Item ($)", "costPrice", "number")}
            </div>
            {form.price && form.costPrice && (
              <div className="mt-3 text-xs font-label text-muted-foreground">
                Margin:{" "}
                <span className="font-bold text-green-600">
                  {(((parseFloat(form.price) - parseFloat(form.costPrice)) / parseFloat(form.price)) * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Status */}
          <div className="p-5 rounded-[var(--radius-auth)] border border-border bg-card">
            <h2 className="font-headline font-bold mb-4">Product Status</h2>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none"
            >
              {["draft", "active", "archived"].map((s) => (
                <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <label className="flex items-center gap-2.5 mt-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => update("isFeatured", e.target.checked)}
                className="rounded accent-[var(--brand-primary)]"
              />
              <span className="text-sm font-label font-medium">Featured product</span>
            </label>
          </div>

          {/* Category */}
          <div className="p-5 rounded-[var(--radius-auth)] border border-border bg-card">
            <h2 className="font-headline font-bold mb-4">Category</h2>
            <select
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none"
            >
              <option value="1">Electronics</option>
              <option value="2">Fashion</option>
              <option value="3">Home & Living</option>
              <option value="4">Sports</option>
            </select>
          </div>

          {/* Inventory */}
          <div className="p-5 rounded-[var(--radius-auth)] border border-border bg-card space-y-4">
            <h2 className="font-headline font-bold">Inventory</h2>
            {FIELD("SKU", "sku")}
            {FIELD("Stock Quantity", "stock", "number")}
          </div>

          {/* Variants */}
          <div className="p-5 rounded-[var(--radius-auth)] border border-border bg-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-headline font-bold">Variants</h2>
              <button className="flex items-center gap-1 text-xs font-label font-semibold" style={{ color: "var(--brand-primary)" }}>
                <Plus size={12} /> Add
              </button>
            </div>
            <p className="text-xs text-muted-foreground font-body">Add options like Size or Color for this product.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
