import { NextRequest, NextResponse } from "next/server";
import { syncCurrentClerkUserToDb } from "@/lib/auth/user-sync";

function getSafeRedirect(request: NextRequest) {
  const redirectTo = request.nextUrl.searchParams.get("redirect") ?? "/";

  if (!redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return "/";
  }

  return redirectTo;
}

export async function GET(request: NextRequest) {
  const syncedUser = await syncCurrentClerkUserToDb();

  if (!syncedUser) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.redirect(new URL(getSafeRedirect(request), request.url));
}
