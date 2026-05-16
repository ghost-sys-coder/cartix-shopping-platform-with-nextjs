"use client";

import Image from "next/image";
import { ChevronRight, Edit2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminCategory } from "@/components/admin/categories/category-types";

interface CategoryTreeItemProps {
  category: AdminCategory;
  childCount: number;
  isChild?: boolean;
  onEdit: (category: AdminCategory) => void;
}

export function CategoryTreeItem({
  category,
  childCount,
  isChild = false,
  onEdit,
}: CategoryTreeItemProps) {
  return (
    <div
      className={`flex items-center gap-3 py-3 transition-colors group hover:bg-muted/30 ${
        isChild ? "pl-14 pr-4 border-t border-border/50" : "px-4"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-muted shrink-0 flex items-center justify-center ${
          isChild ? "w-8 h-8 rounded-md" : "w-10 h-10 rounded-lg"
        }`}
      >
        {category.imageUrl ? (
          <Image
            src={category.imageUrl}
            alt={category.name}
            fill
            className="object-cover"
          />
        ) : (
          <Tag size={isChild ? 14 : 16} className="text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-label ${
              isChild ? "font-medium text-muted-foreground" : "font-semibold"
            }`}
          >
            {category.name}
          </span>
          {!isChild && (
            <span
              className={`text-[10px] font-label font-bold px-1.5 py-0.5 rounded-full ${
                category.isActive
                  ? "bg-green-50 text-green-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {category.isActive ? "Active" : "Inactive"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs text-muted-foreground font-body">
            /{category.slug}
          </span>
          <span className="text-xs text-muted-foreground font-body">
            {category.productCount} products
          </span>
          {!isChild && childCount > 0 && (
            <span className="text-xs text-muted-foreground font-body flex items-center gap-0.5">
              <ChevronRight size={10} />
              {childCount} subcategories
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          type="button"
          variant="secondary"
          size={isChild ? "icon-xs" : "icon-sm"}
          onClick={() => onEdit(category)}
          aria-label={`Edit ${category.name}`}
        >
          <Edit2 size={isChild ? 11 : 13} />
        </Button>
      </div>
    </div>
  );
}
