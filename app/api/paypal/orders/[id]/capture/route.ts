import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { orders } from "@/db/schema";
import { capturePayPalOrder, toMoney } from "@/lib/paypal/paypal";

function capturedAmount(response: Awaited<ReturnType<typeof capturePayPalOrder>>) {
  return response.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value;
}

function captureId(response: Awaited<ReturnType<typeof capturePayPalOrder>>) {
  return response.purchase_units?.[0]?.payments?.captures?.[0]?.id;
}

export async function POST(
  request: NextRequest,
  context: RouteContext<"/api/paypal/orders/[id]/capture">
) {
  const { id: paypalOrderId } = await context.params;
  const body = (await request.json().catch(() => null)) as {
    localOrderId?: unknown;
  } | null;
  const localOrderId = Number(body?.localOrderId);

  if (!Number.isInteger(localOrderId) || localOrderId <= 0) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  try {
    const [order] = await db
      .select({
        id: orders.id,
        total: orders.total,
        orderNumber: orders.orderNumber,
      })
      .from(orders)
      .where(eq(orders.id, localOrderId))
      .limit(1);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const capture = await capturePayPalOrder(paypalOrderId);
    const amount = capturedAmount(capture);
    const expectedTotal = toMoney(Number(order.total));

    if (capture.status !== "COMPLETED" || amount !== expectedTotal) {
      await db
        .update(orders)
        .set({ paymentStatus: "failed", updatedAt: new Date() })
        .where(eq(orders.id, order.id));

      return NextResponse.json(
        { error: "PayPal capture could not be verified" },
        { status: 400 }
      );
    }

    const [updatedOrder] = await db
      .update(orders)
      .set({
        status: "confirmed",
        paymentStatus: "paid",
        notes: `PayPal order: ${paypalOrderId}; capture: ${captureId(capture) ?? "unknown"}`,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id))
      .returning();

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error("POST /api/paypal/orders/[id]/capture error:", error);
    return NextResponse.json(
      { error: "Failed to capture PayPal order" },
      { status: 500 }
    );
  }
}
