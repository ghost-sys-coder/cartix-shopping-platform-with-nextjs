import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { products, categories } from "@/db/schema";
import { eq, desc, ilike, and, or } from "drizzle-orm";
import { requireAdminResponse } from "@/lib/auth/admin";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("category");
  const status = searchParams.get("status") ?? "active";
  const featured = searchParams.get("featured");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const offset = parseInt(searchParams.get("offset") ?? "0");

  try {
    const conditions = [];
    if (status !== "all") conditions.push(eq(products.status, status as "active" | "draft" | "archived"));
    if (categoryId) conditions.push(eq(products.categoryId, parseInt(categoryId)));
    if (featured === "true") conditions.push(eq(products.isFeatured, true));
    if (search) conditions.push(or(ilike(products.name, `%${search}%`), ilike(products.sku ?? "", `%${search}%`)));

    const result = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        compareAtPrice: products.compareAtPrice,
        stock: products.stock,
        status: products.status,
        isFeatured: products.isFeatured,
        sku: products.sku,
        createdAt: products.createdAt,
        categoryName: categories.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ products: result });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminError = await requireAdminResponse();
  if (adminError) return adminError;

  try {
    const body = await request.json();
    const [product] = await db
      .insert(products)
      .values({
        name: body.name,
        slug: body.slug,
        description: body.description,
        shortDescription: body.shortDescription,
        price: body.price,
        compareAtPrice: body.compareAtPrice,
        costPrice: body.costPrice,
        sku: body.sku,
        stock: body.stock ?? 0,
        categoryId: body.categoryId,
        status: body.status ?? "draft",
        isFeatured: body.isFeatured ?? false,
        tags: body.tags,
      })
      .returning();

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
