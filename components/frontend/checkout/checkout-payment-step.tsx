"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Shield } from "lucide-react";
import type { CartItem } from "@/store/cart";
import {
  checkoutPayloadFromCart,
  type CheckoutFormState,
} from "@/components/frontend/checkout/checkout-types";

declare global {
  interface Window {
    paypal?: {
      Buttons: (options: PayPalButtonsOptions) => {
        render: (element: HTMLElement) => void;
        close?: () => void;
      };
    };
  }
}

interface PayPalButtonsOptions {
  createOrder: () => Promise<string>;
  onApprove: (data: { orderID: string }) => Promise<void>;
  onError: (error: unknown) => void;
}

interface CheckoutPaymentStepProps {
  items: CartItem[];
  shippingAddress: CheckoutFormState;
  onBack: () => void;
  onPaid: (orderNumber: string) => void;
}

interface PayPalConfigResponse {
  clientId: string;
  currency: string;
}

interface CreateOrderResponse {
  paypalOrderId: string;
  localOrderId: number;
  orderNumber: string;
}

export function CheckoutPaymentStep({
  items,
  shippingAddress,
  onBack,
  onPaid,
}: CheckoutPaymentStepProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const localOrderIdRef = useRef<number | null>(null);
  const orderNumberRef = useRef("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const buttonElement = buttonRef.current;

    async function mountPayPalButtons() {
      try {
        const configResponse = await fetch("/api/paypal/config");
        if (!configResponse.ok) {
          throw new Error("PayPal is not configured");
        }
        const config = (await configResponse.json()) as PayPalConfigResponse;
        await loadPayPalScript(config);

        if (cancelled || !buttonElement || !window.paypal) return;
        buttonElement.innerHTML = "";
        window.paypal
          .Buttons({
            createOrder: async () => {
              setError("");
              const response = await fetch("/api/paypal/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                  checkoutPayloadFromCart(items, shippingAddress)
                ),
              });

              const data = (await response.json()) as Partial<CreateOrderResponse> & {
                error?: string;
              };
              if (!response.ok || !data.paypalOrderId || !data.localOrderId) {
                throw new Error(data.error ?? "Could not create PayPal order");
              }

              localOrderIdRef.current = data.localOrderId;
              orderNumberRef.current = data.orderNumber ?? "";
              return data.paypalOrderId;
            },
            onApprove: async (data) => {
              const localOrderId = localOrderIdRef.current;
              if (!localOrderId) {
                throw new Error("Local order was not created");
              }

              const response = await fetch(
                `/api/paypal/orders/${data.orderID}/capture`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ localOrderId }),
                }
              );
              const result = (await response.json()) as {
                error?: string;
                order?: { orderNumber?: string };
              };

              if (!response.ok) {
                throw new Error(result.error ?? "Could not capture PayPal order");
              }

              onPaid(result.order?.orderNumber ?? orderNumberRef.current);
            },
            onError: (paypalError) => {
              console.error("PayPal checkout error:", paypalError);
              setError("PayPal checkout failed. Please try again.");
            },
          })
          .render(buttonElement);
      } catch (paypalError) {
        console.error("PayPal setup error:", paypalError);
        setError(
          paypalError instanceof Error
            ? paypalError.message
            : "PayPal could not be loaded"
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void mountPayPalButtons();

    return () => {
      cancelled = true;
      if (buttonElement) buttonElement.innerHTML = "";
    };
  }, [items, onPaid, shippingAddress]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="flex items-center gap-2 text-xl font-headline font-bold">
        <CreditCard size={20} style={{ color: "var(--brand-primary)" }} />
        Pay with PayPal
      </h2>
      <div
        className="flex items-center gap-3 rounded-[var(--radius)] border p-4"
        style={{
          borderColor: "var(--brand-primary)",
          background: "var(--brand-primary-container)",
        }}
      >
        <Shield size={18} style={{ color: "var(--brand-primary)" }} />
        <p
          className="text-xs font-body"
          style={{ color: "var(--brand-primary)" }}
        >
          PayPal opens a secure checkout and confirms payment before your order
          is marked paid.
        </p>
      </div>

      {error && (
        <p className="rounded-[var(--radius)] border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="min-h-14 rounded-[var(--radius-auth)] border border-border bg-card p-4">
        {loading && (
          <p className="text-sm text-muted-foreground font-body">
            Loading PayPal...
          </p>
        )}
        <div ref={buttonRef} />
      </div>

      <button
        onClick={onBack}
        className="rounded-[var(--radius)] border border-border px-6 py-3 text-sm font-label font-semibold transition-colors hover:bg-muted"
      >
        Back
      </button>
    </motion.div>
  );
}

async function loadPayPalScript({ clientId, currency }: PayPalConfigResponse) {
  if (window.paypal) return;

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-paypal-sdk="true"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId
    )}&currency=${encodeURIComponent(currency)}&intent=capture`;
    script.async = true;
    script.dataset.paypalSdk = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("PayPal SDK failed to load"));
    document.body.appendChild(script);
  });
}
