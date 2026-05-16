import { NextResponse } from "next/server";
import { getPayPalClientId, getPayPalCurrency } from "@/lib/paypal/paypal";

export async function GET() {
  const clientId = getPayPalClientId();

  if (!clientId) {
    return NextResponse.json(
      { error: "PayPal client ID is not configured" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    clientId,
    currency: getPayPalCurrency(),
  });
}
