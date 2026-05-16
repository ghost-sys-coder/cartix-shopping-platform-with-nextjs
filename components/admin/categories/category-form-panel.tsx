"use client";

import { Loader2, Save, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryImageUploader } from "@/components/admin/categories/category-image-uploader";
import type {
  AdminCategory,
  CategoryFormState,
} from "@/components/admin/categories/category-types";

interface CategoryFormPanelProps {
  categories: AdminCategory[];
  editingCategory: AdminCategory | null;
  form: CategoryFormState;
  isSaving: boolean;
  error: string | null;
  onChange: (field: keyof CategoryFormState, value: string | boolean) => void;
  onUploadError: (message: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export function CategoryFormPanel({
  categories,
  editingCategory,
  form,
  isSaving,
  error,
  onChange,
  onUploadError,
  onClose,
  onSubmit,
}: CategoryFormPanelProps) {
  const parentOptions = categories.filter(
    (category) =>
      category.parentId === null && category.id !== editingCategory?.id
  );

  return (
    <aside className="p-5 rounded-[var(--radius-auth)] border border-border bg-card self-start sticky top-24 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-headline font-bold flex items-center gap-2">
          <Tag size={16} style={{ color: "var(--brand-primary)" }} />
          {editingCategory ? "Edit Category" : "New Category"}
        </h2>
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close category form"
        >
          <X size={14} />
        </Button>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">
          Category Name
        </label>
        <input
          value={form.name}
          onChange={(event) => onChange("name", event.target.value)}
          placeholder="e.g. Electronics"
          className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-body"
        />
      </div>

      <div>
        <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">
          URL Slug
        </label>
        <input
          value={form.slug}
          onChange={(event) => onChange("slug", event.target.value)}
          placeholder="electronics"
          className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-body"
        />
      </div>

      <div>
        <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(event) => onChange("description", event.target.value)}
          placeholder="Short description..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-body resize-none"
        />
      </div>

      <div>
        <CategoryImageUploader
          imageUrl={form.imageUrl}
          disabled={isSaving}
          onChange={(imageUrl) => onChange("imageUrl", imageUrl)}
          onError={onUploadError}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">
            Parent Category
          </label>
          <select
            title="Parent Category"
            value={form.parentId}
            onChange={(event) => onChange("parentId", event.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none"
          >
            <option value="">None</option>
            {parentOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">
            Sort Order
          </label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(event) => onChange("sortOrder", event.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-body"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm font-label font-medium">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(event) => onChange("isActive", event.target.checked)}
          className="size-4"
        />
        Active category
      </label>

      <Button
        type="button"
        onClick={onSubmit}
        disabled={isSaving}
        className="btn-brand w-full flex items-center justify-center gap-2 py-2.5 text-sm"
      >
        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        {editingCategory ? "Save Changes" : "Create Category"}
      </Button>
    </aside>
  );
}
