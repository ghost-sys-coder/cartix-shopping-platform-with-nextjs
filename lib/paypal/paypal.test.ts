import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildPayPalOrderPayload,
  getPayPalCredentials,
  toMoney,
} from "@/lib/paypal/paypal";

describe("paypal helpers", () => {
  it("reads standard and legacy misspelled paypal env names", () => {
    assert.deepEqual(
      getPayPalCredentials({
        PAYPAL_CLIENT_ID: "standard-client",
        PAYPAL_CLIENT_SECRET: "standard-secret",
      }),
      {
        clientId: "standard-client",
        clientSecret: "standard-secret",
      }
    );

    assert.deepEqual(
      getPayPalCredentials({
        PAYPAYL_CLIENT_ID: "legacy-client",
        PAYPAYL_SECRET: "legacy-secret",
      }),
      {
        clientId: "legacy-client",
        clientSecret: "legacy-secret",
      }
    );
  });

  it("formats money for PayPal amounts", () => {
    assert.equal(toMoney(12), "12.00");
    assert.equal(toMoney(12.345), "12.35");
  });

  it("builds a capture order payload with a purchase unit", () => {
    const payload = buildPayPalOrderPayload({
      currency: "USD",
      orderNumber: "CR-TEST",
      subtotal: 100,
      shipping: 9.99,
      tax: 8,
      total: 117.99,
    });

    assert.deepEqual(payload, {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: "CR-TEST",
          custom_id: "CR-TEST",
          invoice_id: "CR-TEST",
          amount: {
            currency_code: "USD",
            value: "117.99",
            breakdown: {
              item_total: { currency_code: "USD", value: "100.00" },
              shipping: { currency_code: "USD", value: "9.99" },
              tax_total: { currency_code: "USD", value: "8.00" },
            },
          },
        },
      ],
    });
  });
});
