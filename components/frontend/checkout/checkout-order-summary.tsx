"use client";

import Image from "next/image";
import type { CartItem } from "@/store/cart";
import type { CheckoutTotals } from "@/components/frontend/checkout/checkout-types";

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  totals: CheckoutTotals;
}

export function CheckoutOrderSummary({
  items,
  totals,
}: CheckoutOrderSummaryProps) {
  return (
    <div className="self-start lg:sticky lg:top-24">
      <div className="overflow-hidden rounded-[var(--radius-auth)] border border-border">
        <div className="border-b border-border px-5 py-4">
          <h3 className="font-headline font-bold">Order Summary</h3>
        </div>
        <div className="space-y-3 p-5">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
                <span
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
                  style={{ background: "var(--brand-primary)" }}
                >
                  {item.quantity}
                </span>
              </div>
              <span className="flex-1 truncate text-xs font-label">
                {item.product.name}
              </span>
              <span className="text-xs font-label font-bold">
                ${((item.variant?.price ?? item.product.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          <div className="my-3 h-px bg-border" />
          <SummaryRow label="Subtotal" value={`$${totals.subtotal.toFixed(2)}`} />
          <SummaryRow
            label="Shipping"
            value={totals.shipping === 0 ? "FREE" : `$${totals.shipping.toFixed(2)}`}
            free={totals.shipping === 0}
          />
          <SummaryRow label="Tax" value={`$${totals.tax.toFixed(2)}`} />
          <div className="h-px bg-border" />
          <div className="flex justify-between text-lg font-headline font-bold">
            <span>Total</span>
            <span style={{ color: "var(--brand-primary)" }}>
              ${totals.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  free = false,
}: {
  label: string;
  value: string;
  free?: boolean;
}) {
  return (
    <div className="flex justify-between text-sm font-label">
      <span className="text-muted-foreground">{label}</span>
      <span className={free ? "font-semibold text-green-600" : ""}>{value}</span>
    </div>
  );
}
