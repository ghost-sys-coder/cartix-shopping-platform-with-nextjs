import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { orders, orderItems } from "@/db/schema";
import {
  getCheckoutSummaryFromCart,
  normalizeCheckoutAddress,
} from "@/lib/checkout/checkout";
import { generateOrderNumber } from "@/lib/orders/order-number";
import {
  createPayPalOrder,
  getPayPalCurrency,
  toMoney,
} from "@/lib/paypal/paypal";
import { getCurrentDbUserId } from "@/lib/wishlist/wishlist";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      items?: unknown;
      shippingAddress?: unknown;
    };
    const items = Array.isArray(body.items) ? body.items : [];
    const shippingAddress = normalizeCheckoutAddress(body.shippingAddress);

    if (!shippingAddress?.email) {
      return NextResponse.json(
        { error: "Shipping information is incomplete" },
        { status: 400 }
      );
    }

    const summary = await getCheckoutSummaryFromCart(items);
    const orderNumber = generateOrderNumber();
    const currency = getPayPalCurrency();
    const paypalOrder = await createPayPalOrder({
      currency,
      orderNumber,
      subtotal: summary.subtotal,
      shipping: summary.shipping,
      tax: summary.tax,
      total: summary.total,
    });
    const userId = await getCurrentDbUserId();

    const [order] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId,
        email: shippingAddress.email,
        status: "pending",
        paymentStatus: "pending",
        subtotal: toMoney(summary.subtotal),
        taxAmount: toMoney(summary.tax),
        shippingAmount: toMoney(summary.shipping),
        discountAmount: "0.00",
        total: toMoney(summary.total),
        shippingAddress,
        billingAddress: shippingAddress,
        notes: `PayPal order: ${paypalOrder.id}`,
      })
      .returning();

    await db.insert(orderItems).values(
      summary.orderItems.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        variantId: item.variantId,
        productName: item.productName,
        variantName: item.variantName,
        sku: item.sku,
        imageUrl: item.imageUrl,
        price: item.price,
        quantity: item.quantity,
        total: item.total,
      }))
    );

    return NextResponse.json({
      paypalOrderId: paypalOrder.id,
      localOrderId: order.id,
      orderNumber: order.orderNumber,
      total: toMoney(summary.total),
      currency,
    });
  } catch (error) {
    console.error("POST /api/paypal/orders error:", error);
    return NextResponse.json(
      { error: "Failed to create PayPal order" },
      { status: 500 }
    );
  }
}
