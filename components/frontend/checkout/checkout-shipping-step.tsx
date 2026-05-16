"use client";

import { motion } from "framer-motion";
import { ChevronDown, Truck } from "lucide-react";
import type { CheckoutFormState } from "@/components/frontend/checkout/checkout-types";

interface ShippingField {
  key: keyof CheckoutFormState;
  label: string;
  col: 1 | 2;
  type?: string;
}

interface CheckoutShippingStepProps {
  form: CheckoutFormState;
  error: string;
  onUpdate: (key: keyof CheckoutFormState, value: string) => void;
  onContinue: () => void;
}

const shippingFields: ShippingField[] = [
  { key: "firstName", label: "First Name", col: 1 },
  { key: "lastName", label: "Last Name", col: 1 },
  { key: "email", label: "Email Address", col: 2, type: "email" },
  { key: "phone", label: "Phone", col: 1, type: "tel" },
  { key: "address1", label: "Address Line 1", col: 2 },
  { key: "address2", label: "Address Line 2 (Optional)", col: 2 },
  { key: "city", label: "City", col: 1 },
  { key: "state", label: "State", col: 1 },
  { key: "zip", label: "ZIP Code", col: 1 },
];

export function CheckoutShippingStep({
  form,
  error,
  onUpdate,
  onContinue,
}: CheckoutShippingStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h2 className="flex items-center gap-2 text-xl font-headline font-bold">
        <Truck size={20} style={{ color: "var(--brand-primary)" }} />
        Shipping Information
      </h2>

      {error && (
        <p className="rounded-[var(--radius)] border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        {shippingFields.map(({ key, label, col, type }) => (
          <div key={key} className={col === 2 ? "col-span-2" : ""}>
            <label className="mb-1.5 block text-xs font-label font-semibold text-muted-foreground">
              {label}
            </label>
            <input
              type={type ?? "text"}
              value={form[key]}
              onChange={(event) => onUpdate(key, event.target.value)}
              className="h-11 w-full rounded-[var(--radius)] border border-border bg-background px-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        ))}

        <div>
          <label className="mb-1.5 block text-xs font-label font-semibold text-muted-foreground">
            Country
          </label>
          <div className="relative">
            <select
              value={form.country}
              onChange={(event) => onUpdate("country", event.target.value)}
              className="h-11 w-full appearance-none rounded-[var(--radius)] border border-border bg-background px-3 text-sm focus:outline-none"
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>
      </div>

      <button onClick={onContinue} className="btn-brand px-8 py-3 text-sm">
        Continue to Payment
      </button>
    </motion.div>
  );
}
