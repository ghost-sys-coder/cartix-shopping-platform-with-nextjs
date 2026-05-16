import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdminResponse } from "@/lib/auth/admin";

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
    const [category] = await db
      .insert(categories)
      .values({
        name: body.name,
        slug: body.slug,
        description: body.description,
        imageUrl: body.imageUrl,
        parentId: body.parentId ?? null,
        isActive: body.isActive ?? true,
        sortOrder: body.sortOrder ?? 0,
      })
      .returning();

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
