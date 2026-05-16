"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Plus, Edit2, Trash2, Tag, ChevronRight, X, Save } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  { id: 1, name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100", count: 145, parent: null, isActive: true },
  { id: 2, name: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=100", count: 230, parent: null, isActive: true },
  { id: 3, name: "Home & Living", slug: "home-living", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100", count: 98, parent: null, isActive: true },
  { id: 4, name: "Sports", slug: "sports", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=100", count: 76, parent: null, isActive: false },
  { id: 5, name: "Headphones", slug: "headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100", count: 32, parent: 1, isActive: true },
  { id: 6, name: "Wearables", slug: "wearables", image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=100", count: 28, parent: 1, isActive: true },
];

export default function AdminCategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "", parent: "", description: "" });

  const roots = CATEGORIES.filter((c) => !c.parent);
  const getChildren = (id: number) => CATEGORIES.filter((c) => c.parent === id);

  function handleSave() {
    toast.success(editId ? "Category updated!" : "Category created!");
    setShowForm(false);
    setEditId(null);
    setFormData({ name: "", slug: "", parent: "", description: "" });
  }

  function openEdit(cat: typeof CATEGORIES[0]) {
    setEditId(cat.id);
    setFormData({ name: cat.name, slug: cat.slug, parent: cat.parent?.toString() ?? "", description: "" });
    setShowForm(true);
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-headline font-black tracking-tight">Categories</h1>
          <p className="text-muted-foreground text-sm font-body mt-1">{CATEGORIES.length} categories · {roots.length} top-level</p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setFormData({ name: "", slug: "", parent: "", description: "" }); }}
          className="btn-brand flex items-center gap-2 px-4 py-2.5 text-sm"
        >
          <Plus size={16} />
          New Category
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Category tree */}
        <div className="lg:col-span-2">
          <div className="rounded-[var(--radius-auth)] border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border text-xs font-label font-bold uppercase tracking-widest text-muted-foreground">
              Category Hierarchy
            </div>
            <div className="divide-y divide-border">
              {roots.map((root) => {
                const children = getChildren(root.id);
                return (
                  <div key={root.id}>
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/30 transition-colors group"
                    >
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image src={root.image} alt={root.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-label font-semibold">{root.name}</span>
                          <span className={`text-[10px] font-label font-bold px-1.5 py-0.5 rounded-full ${root.isActive ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                            {root.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-muted-foreground font-body">/{root.slug}</span>
                          <span className="text-xs text-muted-foreground font-body">{root.count} products</span>
                          {children.length > 0 && (
                            <span className="text-xs text-muted-foreground font-body flex items-center gap-0.5">
                              <ChevronRight size={10} />{children.length} subcategories
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(root)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                          <Edit2 size={13} />
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </motion.div>

                    {/* Children */}
                    {children.map((child) => (
                      <motion.div
                        key={child.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 pl-14 pr-4 py-3 border-t border-border/50 hover:bg-muted/20 transition-colors group"
                      >
                        <div className="relative w-8 h-8 rounded-md overflow-hidden bg-muted shrink-0">
                          <Image src={child.image} alt={child.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-label font-medium text-muted-foreground">{child.name}</span>
                          <span className="text-xs text-muted-foreground font-body ml-2">· {child.count} products</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(child)} className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground">
                            <Edit2 size={11} />
                          </button>
                          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-destructive/10 hover:text-destructive text-muted-foreground">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form panel */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              className="p-5 rounded-[var(--radius-auth)] border border-border bg-card self-start sticky top-24 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-headline font-bold flex items-center gap-2">
                  <Tag size={16} style={{ color: "var(--brand-primary)" }} />
                  {editId ? "Edit Category" : "New Category"}
                </h2>
                <button onClick={() => setShowForm(false)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                  <X size={14} />
                </button>
              </div>

              {[
                { key: "name", label: "Category Name", placeholder: "e.g. Electronics" },
                { key: "slug", label: "URL Slug", placeholder: "electronics" },
                { key: "description", label: "Description (optional)", placeholder: "Short description..." },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">{label}</label>
                  <input
                    value={formData[key as keyof typeof formData]}
                    onChange={(e) => setFormData((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-body"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">Parent Category</label>
                <select
                  value={formData.parent}
                  onChange={(e) => setFormData((f) => ({ ...f, parent: e.target.value }))}
                  className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none"
                >
                  <option value="">None (Top-level)</option>
                  {roots.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">Category Image</label>
                <button className="w-full h-20 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors text-xs font-label">
                  <Plus size={18} />
                  Upload image
                </button>
              </div>

              <button onClick={handleSave} className="btn-brand w-full flex items-center justify-center gap-2 py-2.5 text-sm">
                <Save size={14} />
                {editId ? "Save Changes" : "Create Category"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
