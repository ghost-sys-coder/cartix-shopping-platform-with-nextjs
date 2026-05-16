"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Shield } from "lucide-react";
import type { CartItem } from "@/store/cart";
import type { CheckoutTotals } from "@/components/frontend/checkout/checkout-types";

interface CheckoutReviewStepProps {
  items: CartItem[];
  totals: CheckoutTotals;
  onBack: () => void;
}

export function CheckoutReviewStep({
  items,
  totals,
  onBack,
}: CheckoutReviewStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-headline font-bold">Review Your Order</h2>
      <div className="divide-y divide-border rounded-[var(--radius-auth)] border border-border">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image
                src={item.product.imageUrl}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-label font-semibold">
                {item.product.name}
              </p>
              {item.variant && (
                <p className="text-xs text-muted-foreground">
                  {item.variant.value}
                </p>
              )}
              <p className="mt-0.5 text-xs text-muted-foreground">
                Qty: {item.quantity}
              </p>
            </div>
            <span className="text-sm font-label font-bold">
              ${((item.variant?.price ?? item.product.price) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="rounded-[var(--radius)] border border-border px-6 py-3 text-sm font-label font-semibold transition-colors hover:bg-muted"
        >
          Back
        </button>
        <button className="btn-brand flex items-center gap-2 px-8 py-3 text-sm">
          <Shield size={16} />
          Paid with PayPal · ${totals.total.toFixed(2)}
        </button>
      </div>
    </motion.div>
  );
}
