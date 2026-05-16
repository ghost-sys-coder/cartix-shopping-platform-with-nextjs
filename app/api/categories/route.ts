import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminResponse } from "@/lib/auth/admin";
import { parseCategoryPayload } from "@/lib/categories/category-input";

export async function GET() {
  try {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.sortOrder, categories.name);

    return NextResponse.json({ categories: result });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminError = await requireAdminResponse();
  if (adminError) return adminError;

  try {
    const body = await request.json();
    const parsed = parseCategoryPayload(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const [existingCategory] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, parsed.values.slug))
      .limit(1);
    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 409 }
      );
    }

    const [category] = await db
      .insert(categories)
      .values(parsed.values)
      .returning();

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
