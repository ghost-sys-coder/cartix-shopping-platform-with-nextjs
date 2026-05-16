const PAYPAL_SANDBOX_API_BASE = "https://api-m.sandbox.paypal.com";
const PAYPAL_LIVE_API_BASE = "https://api-m.paypal.com";

export interface PayPalCredentials {
  clientId: string;
  clientSecret: string;
}

export interface PayPalAmountInput {
  currency: string;
  orderNumber: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

interface PayPalAccessTokenResponse {
  access_token?: string;
}

export function getPayPalCredentials(
  env: NodeJS.ProcessEnv = process.env
): PayPalCredentials | null {
  const clientId =
    env.PAYPAL_CLIENT_ID ?? env.PAYPAYL_CLIENT_ID ?? env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret =
    env.PAYPAL_CLIENT_SECRET ?? env.PAYPAL_SECRET ?? env.PAYPAYL_SECRET;

  if (!clientId || !clientSecret) return null;

  return { clientId, clientSecret };
}

export function getPayPalClientId(env: NodeJS.ProcessEnv = process.env) {
  return (
    env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ??
    env.PAYPAL_CLIENT_ID ??
    env.PAYPAYL_CLIENT_ID ??
    null
  );
}

export function getPayPalCurrency(env: NodeJS.ProcessEnv = process.env) {
  return env.PAYPAL_CURRENCY ?? "USD";
}

export function getPayPalApiBase(env: NodeJS.ProcessEnv = process.env) {
  return env.PAYPAL_ENV === "live" || env.PAYPAL_MODE === "live"
    ? PAYPAL_LIVE_API_BASE
    : PAYPAL_SANDBOX_API_BASE;
}

export function toMoney(value: number) {
  return value.toFixed(2);
}

export function buildPayPalOrderPayload({
  currency,
  orderNumber,
  subtotal,
  shipping,
  tax,
  total,
}: PayPalAmountInput) {
  return {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: orderNumber,
        custom_id: orderNumber,
        invoice_id: orderNumber,
        amount: {
          currency_code: currency,
          value: toMoney(total),
          breakdown: {
            item_total: { currency_code: currency, value: toMoney(subtotal) },
            shipping: { currency_code: currency, value: toMoney(shipping) },
            tax_total: { currency_code: currency, value: toMoney(tax) },
          },
        },
      },
    ],
  };
}

export async function getPayPalAccessToken() {
  const credentials = getPayPalCredentials();
  if (!credentials) {
    throw new Error("PayPal credentials are not configured");
  }

  const auth = Buffer.from(
    `${credentials.clientId}:${credentials.clientSecret}`
  ).toString("base64");

  const response = await fetch(`${getPayPalApiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to authenticate with PayPal");
  }

  const data = (await response.json()) as PayPalAccessTokenResponse;
  if (!data.access_token) {
    throw new Error("PayPal did not return an access token");
  }

  return data.access_token;
}

export async function createPayPalOrder(input: PayPalAmountInput) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(`${getPayPalApiBase()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(buildPayPalOrderPayload(input)),
  });

  if (!response.ok) {
    throw new Error("Failed to create PayPal order");
  }

  return (await response.json()) as { id: string; status: string };
}

export async function capturePayPalOrder(paypalOrderId: string) {
  const accessToken = await getPayPalAccessToken();
  const response = await fetch(
    `${getPayPalApiBase()}/v2/checkout/orders/${paypalOrderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to capture PayPal order");
  }

  return (await response.json()) as {
    id: string;
    status: string;
    purchase_units?: Array<{
      payments?: {
        captures?: Array<{
          id: string;
          status: string;
          amount?: { value: string; currency_code: string };
        }>;
      };
    }>;
  };
}
