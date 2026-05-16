import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import { requireAdminResponse } from "@/lib/auth/admin";
import { parseCategoryPayload } from "@/lib/categories/category-input";

export async function PATCH(
  request: NextRequest,
  context: RouteContext<"/api/categories/[id]">
) {
  const adminError = await requireAdminResponse();
  if (adminError) return adminError;

  const { id } = await context.params;
  const categoryId = Number(id);
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return NextResponse.json({ error: "Invalid category id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const parsed = parseCategoryPayload(body, {
      currentCategoryId: categoryId,
    });
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const [existingCategory] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(
        and(eq(categories.slug, parsed.values.slug), ne(categories.id, categoryId))
      )
      .limit(1);
    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 409 }
      );
    }

    const [category] = await db
      .update(categories)
      .set({
        ...parsed.values,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, categoryId))
      .returning();

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error("PATCH /api/categories/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}
