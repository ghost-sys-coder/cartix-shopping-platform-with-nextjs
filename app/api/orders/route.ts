import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { orders, orderItems } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { nanoid } from "nanoid";
import { requireAdminResponse } from "@/lib/auth/admin";

function generateOrderNumber(): string {
  return `CR-${Date.now().toString(36).toUpperCase().slice(-5)}${nanoid(3).toUpperCase()}`;
}

export async function GET(request: NextRequest) {
  const adminError = await requireAdminResponse();
  if (adminError) return adminError;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  try {
    const conditions = [];
    if (status && status !== "all") conditions.push(eq(orders.status, status as "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"));

    const result = await db
      .select()
      .from(orders)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(orders.createdAt))
      .limit(limit);

    return NextResponse.json({ orders: result });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orderNumber = generateOrderNumber();

    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId: body.userId ?? null,
        email: body.email,
        status: "pending",
        paymentStatus: "pending",
        subtotal: body.subtotal,
        taxAmount: body.taxAmount ?? "0",
        shippingAmount: body.shippingAmount ?? "0",
        discountAmount: body.discountAmount ?? "0",
        total: body.total,
        shippingAddress: body.shippingAddress,
        billingAddress: body.billingAddress,
        couponCode: body.couponCode,
      })
      .returning();

    if (body.items?.length) {
      await db.insert(orderItems).values(
        body.items.map((item: {
          productId: number;
          variantId?: number;
          productName: string;
          variantName?: string;
          sku?: string;
          imageUrl?: string;
          price: string;
          quantity: number;
          total: string;
        }) => ({
          orderId: order.id,
          productId: item.productId,
          variantId: item.variantId ?? null,
          productName: item.productName,
          variantName: item.variantName,
          sku: item.sku,
          imageUrl: item.imageUrl,
          price: item.price,
          quantity: item.quantity,
          total: item.total,
        }))
      );
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
