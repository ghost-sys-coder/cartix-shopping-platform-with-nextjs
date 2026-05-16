"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CategoryFormPanel } from "@/components/admin/categories/category-form-panel";
import { CategoryTree } from "@/components/admin/categories/category-tree";
import {
  type AdminCategory,
  type CategoryFormState,
  EMPTY_CATEGORY_FORM,
} from "@/components/admin/categories/category-types";
import { slugifyCategoryName } from "@/lib/categories/category-input";

interface CategoryManagerProps {
  initialCategories: AdminCategory[];
}

function formFromCategory(category: AdminCategory): CategoryFormState {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    imageUrl: category.imageUrl ?? "",
    parentId: category.parentId?.toString() ?? "",
    sortOrder: category.sortOrder.toString(),
    isActive: category.isActive,
  };
}

function categoryPayloadFromForm(form: CategoryFormState) {
  return {
    name: form.name,
    slug: form.slug,
    description: form.description,
    imageUrl: form.imageUrl,
    parentId: form.parentId || null,
    sortOrder: form.sortOrder,
    isActive: form.isActive,
  };
}

function categoryFromResponse(
  category: Omit<AdminCategory, "productCount">,
  current?: AdminCategory
): AdminCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    imageUrl: category.imageUrl,
    parentId: category.parentId,
    isActive: category.isActive,
    sortOrder: category.sortOrder,
    productCount: current?.productCount ?? 0,
  };
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [form, setForm] = useState<CategoryFormState>(EMPTY_CATEGORY_FORM);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(
    null
  );
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  const roots = categories.filter((category) => category.parentId === null);

  function startCreate() {
    setEditingCategory(null);
    setForm(EMPTY_CATEGORY_FORM);
    setSlugEdited(false);
    setError(null);
    setShowForm(true);
  }

  function startEdit(category: AdminCategory) {
    setEditingCategory(category);
    setForm(formFromCategory(category));
    setSlugEdited(true);
    setError(null);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingCategory(null);
    setForm(EMPTY_CATEGORY_FORM);
    setError(null);
  }

  function updateForm(field: keyof CategoryFormState, value: string | boolean) {
    setForm((current) => {
      const next = { ...current, [field]: value };
      if (field === "name" && typeof value === "string" && !slugEdited) {
        next.slug = slugifyCategoryName(value);
      }
      return next;
    });

    if (field === "slug") {
      setSlugEdited(true);
    }
  }

  async function saveCategory() {
    setIsSaving(true);
    setError(null);

    const endpoint = editingCategory
      ? `/api/categories/${editingCategory.id}`
      : "/api/categories";
    const method = editingCategory ? "PATCH" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryPayloadFromForm(form)),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save category");
      }

      const savedCategory = categoryFromResponse(data.category, editingCategory ?? undefined);

      setCategories((current) => {
        if (editingCategory) {
          return current.map((category) =>
            category.id === savedCategory.id ? savedCategory : category
          );
        }
        return [...current, savedCategory].sort((a, b) => {
          if ((a.parentId ?? 0) !== (b.parentId ?? 0)) {
            return (a.parentId ?? 0) - (b.parentId ?? 0);
          }
          return a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);
        });
      });

      toast.success(editingCategory ? "Category updated" : "Category created");
      closeForm();
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : "Failed to save category";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-headline font-black tracking-tight">
            Categories
          </h1>
          <p className="text-muted-foreground text-sm font-body mt-1">
            {categories.length} categories - {roots.length} top-level
          </p>
        </div>
        <Button
          type="button"
          onClick={startCreate}
          className="btn-brand flex items-center gap-2 px-4 py-2.5 text-sm"
        >
          <Plus size={16} />
          New Category
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CategoryTree categories={categories} onEdit={startEdit} />
        </div>

        {showForm && (
          <CategoryFormPanel
            categories={categories}
            editingCategory={editingCategory}
            form={form}
            isSaving={isSaving}
            error={error}
            onChange={updateForm}
            onUploadError={setError}
            onClose={closeForm}
            onSubmit={saveCategory}
          />
        )}
      </div>
    </div>
  );
}
