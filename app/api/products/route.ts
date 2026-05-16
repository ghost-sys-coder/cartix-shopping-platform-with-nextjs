import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { products, categories, productImages } from "@/db/schema";
import { eq, desc, ilike, and, or } from "drizzle-orm";
import { requireAdminResponse } from "@/lib/auth/admin";
import { parseProductPayload } from "@/lib/products/product-input";

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
    const parsed = parseProductPayload(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const [existingSlug] = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, parsed.values.product.slug))
      .limit(1);
    if (existingSlug) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 409 }
      );
    }

    if (parsed.values.product.sku) {
      const [existingSku] = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.sku, parsed.values.product.sku))
        .limit(1);
      if (existingSku) {
        return NextResponse.json(
          { error: "A product with this SKU already exists" },
          { status: 409 }
        );
      }
    }

    const [product] = await db
      .insert(products)
      .values(parsed.values.product)
      .returning();

    if (parsed.values.images.length > 0) {
      await db.insert(productImages).values(
        parsed.values.images.map((image) => ({
          productId: product.id,
          url: image.url,
          publicId: image.publicId,
          altText: image.altText,
          sortOrder: image.sortOrder,
          isPrimary: image.isPrimary,
        }))
      );
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
