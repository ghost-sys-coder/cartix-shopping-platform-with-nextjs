import { NextRequest, NextResponse } from "next/server";
import {
  addProductToWishlist,
  getCurrentWishlistData,
  isProductWishlisted,
  removeProductFromWishlist,
} from "@/lib/wishlist/wishlist";

function productIdFromValue(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function GET(request: NextRequest) {
  const productId = productIdFromValue(
    request.nextUrl.searchParams.get("productId")
  );

  if (productId) {
    const wishlisted = await isProductWishlisted(productId);
    return NextResponse.json({ wishlisted });
  }

  const data = await getCurrentWishlistData();
  if (!data) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    productId?: unknown;
  } | null;
  const productId = productIdFromValue(body?.productId);

  if (!productId) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const result = await addProductToWishlist(productId);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    );
  }

  return NextResponse.json({ wishlisted: result.wishlisted });
}

export async function DELETE(request: NextRequest) {
  const productId = productIdFromValue(
    request.nextUrl.searchParams.get("productId")
  );

  if (!productId) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const result = await removeProductFromWishlist(productId);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: result.status }
    );
  }

  return NextResponse.json({ wishlisted: result.wishlisted });
}
