import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { type ClerkUserPayload } from "@/lib/auth/clerk-user";
import { upsertClerkUser } from "@/lib/auth/user-sync";

export async function POST(request: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "No webhook secret" }, { status: 500 });
  }

  const headerPayload = request.headers;
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await request.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let event: { type: string; data: ClerkUserPayload };
  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as { type: string; data: ClerkUserPayload };
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const { type, data } = event;

  try {
    if (type === "user.created") {
      await upsertClerkUser(data);
    }

    if (type === "user.updated") {
      await upsertClerkUser(data);
    }

    if (type === "user.deleted") {
      await db.delete(users).where(eq(users.clerkId, data.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
