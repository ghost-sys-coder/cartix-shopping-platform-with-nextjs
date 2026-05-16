import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildCheckoutSummary,
  normalizeCheckoutItems,
} from "@/lib/checkout/checkout";

describe("checkout helpers", () => {
  it("normalizes cart items for server validation", () => {
    assert.deepEqual(
      normalizeCheckoutItems([
        { productId: 1, variantId: 2, quantity: 3 },
        { productId: "4", quantity: "2" },
        { productId: 0, quantity: 1 },
      ]),
      [
        { productId: 1, variantId: 2, quantity: 3 },
        { productId: 4, variantId: null, quantity: 2 },
      ]
    );
  });

  it("builds totals from product and variant prices", () => {
    const summary = buildCheckoutSummary({
      items: [
        { productId: 1, variantId: 2, quantity: 2 },
        { productId: 3, variantId: null, quantity: 1 },
      ],
      products: [
        {
          id: 1,
          name: "Headphones",
          price: "100.00",
          sku: "HP-1",
          imageUrl: "https://example.com/headphones.jpg",
        },
        {
          id: 3,
          name: "Speaker",
          price: "50.00",
          sku: null,
          imageUrl: null,
        },
      ],
      variants: [
        {
          id: 2,
          productId: 1,
          name: "Color",
          value: "Black",
          price: "120.00",
        },
      ],
    });

    assert.equal(summary.subtotal, 290);
    assert.equal(summary.shipping, 0);
    assert.equal(summary.tax, 23.2);
    assert.equal(summary.total, 313.2);
    assert.deepEqual(
      summary.orderItems.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        price: item.price,
        total: item.total,
      })),
      [
        { productId: 1, variantId: 2, price: "120.00", total: "240.00" },
        { productId: 3, variantId: null, price: "50.00", total: "50.00" },
      ]
    );
  });
});
