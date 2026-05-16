import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { orders, users, analyticsEvents } from "@/db/schema";
import { sql, gte, and, eq } from "drizzle-orm";
import { requireAdminResponse } from "@/lib/auth/admin";

export async function GET(request: NextRequest) {
  const adminError = await requireAdminResponse();
  if (adminError) return adminError;

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "30d";

  const daysMap: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 };
  const days = daysMap[period] ?? 30;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  try {
    const [totalRevenueResult] = await db
      .select({ total: sql<number>`SUM(CAST(${orders.total} AS DECIMAL))` })
      .from(orders)
      .where(and(eq(orders.paymentStatus, "paid"), gte(orders.createdAt, since)));

    const [totalOrdersResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(orders)
      .where(gte(orders.createdAt, since));

    const [totalCustomersResult] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(users)
      .where(gte(users.createdAt, since));

    return NextResponse.json({
      revenue: totalRevenueResult?.total ?? 0,
      orders: totalOrdersResult?.count ?? 0,
      customers: totalCustomersResult?.count ?? 0,
      period,
    });
  } catch (error) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await db.insert(analyticsEvents).values({
      type: body.type,
      userId: body.userId,
      sessionId: body.sessionId,
      productId: body.productId,
      orderId: body.orderId,
      metadata: body.metadata,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to track event" }, { status: 500 });
  }
}
