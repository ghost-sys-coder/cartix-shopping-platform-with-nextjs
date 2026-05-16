import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { productImages, products } from "@/db/schema";
import { requireAdminResponse } from "@/lib/auth/admin";
import { deleteImage } from "@/lib/cloudinary";
import { getRemovedCloudinaryPublicIds } from "@/lib/products/product-images";
import { parseProductPayload } from "@/lib/products/product-input";

export async function PATCH(
  request: NextRequest,
  context: RouteContext<"/api/products/[id]">
) {
  const adminError = await requireAdminResponse();
  if (adminError) return adminError;

  const { id } = await context.params;
  const productId = Number(id);
  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const parsed = parseProductPayload(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const [existingSlug] = await db
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.slug, parsed.values.product.slug), ne(products.id, productId)))
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
        .where(and(eq(products.sku, parsed.values.product.sku), ne(products.id, productId)))
        .limit(1);
      if (existingSku) {
        return NextResponse.json(
          { error: "A product with this SKU already exists" },
          { status: 409 }
        );
      }
    }

    const existingImages = await db
      .select({ publicId: productImages.publicId })
      .from(productImages)
      .where(eq(productImages.productId, productId));

    const [product] = await db
      .update(products)
      .set({
        ...parsed.values.product,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId))
      .returning();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await db.delete(productImages).where(eq(productImages.productId, productId));

    if (parsed.values.images.length > 0) {
      await db.insert(productImages).values(
        parsed.values.images.map((image) => ({
          productId,
          url: image.url,
          publicId: image.publicId,
          altText: image.altText,
          sortOrder: image.sortOrder,
          isPrimary: image.isPrimary,
        }))
      );
    }

    const removedPublicIds = getRemovedCloudinaryPublicIds(
      existingImages,
      parsed.values.images
    );
    await Promise.all(
      removedPublicIds.map(async (publicId) => {
        try {
          await deleteImage(publicId);
        } catch (deleteError) {
          console.error("Failed to delete removed product image:", deleteError);
        }
      })
    );

    return NextResponse.json({ product });
  } catch (error) {
    console.error("PATCH /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}
