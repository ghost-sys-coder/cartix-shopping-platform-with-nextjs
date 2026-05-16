import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { isAdminFromSources } from "@/lib/auth/clerk-user";
import { syncClerkUserByIdToDb } from "@/lib/auth/user-sync";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getClaimString(claims: unknown, key: string) {
  if (!isRecord(claims)) return undefined;

  const value = claims[key];
  return typeof value === "string" && value.trim() ? value : undefined;
}

export async function getCurrentAuthAdminState() {
  const { userId, sessionClaims } = await auth();
  let databaseIsAdmin: boolean | null | undefined;

  if (userId && !isAdminFromSources({ sessionClaims })) {
    const databaseUser = await db
      .select({ isAdmin: users.isAdmin })
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1)
      .then((rows) => rows[0] ?? null);

    databaseIsAdmin = databaseUser?.isAdmin;

    if (!databaseIsAdmin) {
      try {
        const syncedUser = await syncClerkUserByIdToDb(userId);
        databaseIsAdmin = syncedUser.isAdmin;
      } catch (error) {
        console.error("Failed to refresh Clerk user admin metadata", error);
      }
    }
  }

  return {
    userId,
    sessionClaims,
    isAdmin: isAdminFromSources({
      sessionClaims,
      databaseIsAdmin,
    }),
  };
}

export function getAdminDisplayName(sessionClaims: unknown) {
  const firstName =
    getClaimString(sessionClaims, "firstName") ??
    getClaimString(sessionClaims, "given_name");
  const lastName =
    getClaimString(sessionClaims, "lastName") ??
    getClaimString(sessionClaims, "family_name");
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  return (
    getClaimString(sessionClaims, "fullName") ??
    getClaimString(sessionClaims, "name") ??
    (fullName || undefined) ??
    getClaimString(sessionClaims, "email") ??
    "Admin"
  );
}

export async function requireAdminResponse() {
  const { userId, isAdmin } = await getCurrentAuthAdminState();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}
