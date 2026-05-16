"use client";

import type { AdminCategory } from "@/components/admin/categories/category-types";
import { CategoryTreeItem } from "@/components/admin/categories/category-tree-item";

interface CategoryTreeProps {
  categories: AdminCategory[];
  onEdit: (category: AdminCategory) => void;
}

export function CategoryTree({ categories, onEdit }: CategoryTreeProps) {
  const roots = categories.filter((category) => category.parentId === null);
  const getChildren = (id: number) =>
    categories.filter((category) => category.parentId === id);

  return (
    <div className="rounded-[var(--radius-auth)] border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border text-xs font-label font-bold uppercase tracking-widest text-muted-foreground">
        Category Hierarchy
      </div>
      <div className="divide-y divide-border">
        {roots.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="font-label font-semibold">No categories yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first category to organize products.
            </p>
          </div>
        ) : (
          roots.map((root) => {
            const children = getChildren(root.id);

            return (
              <div key={root.id}>
                <CategoryTreeItem
                  category={root}
                  childCount={children.length}
                  onEdit={onEdit}
                />
                {children.map((child) => (
                  <CategoryTreeItem
                    key={child.id}
                    category={child}
                    childCount={0}
                    isChild
                    onEdit={onEdit}
                  />
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
