"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import {
  EMPTY_CHECKOUT_FORM,
  type CheckoutFormState,
} from "@/components/frontend/checkout/checkout-types";
import { CheckoutOrderSummary } from "@/components/frontend/checkout/checkout-order-summary";
import { CheckoutPaymentStep } from "@/components/frontend/checkout/checkout-payment-step";
import { CheckoutReviewStep } from "@/components/frontend/checkout/checkout-review-step";
import { CheckoutShippingStep } from "@/components/frontend/checkout/checkout-shipping-step";
import { CheckoutStepIndicator } from "@/components/frontend/checkout/checkout-step-indicator";
import { CheckoutSuccessState } from "@/components/frontend/checkout/checkout-success-state";

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCartStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CheckoutFormState>(EMPTY_CHECKOUT_FORM);
  const [formError, setFormError] = useState("");
  const [completedOrderNumber, setCompletedOrderNumber] = useState("");

  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  const sub = subtotal();
  const shipping = sub > 99 ? 0 : 9.99;
  const tax = sub * 0.08;
  const total = sub + shipping + tax;
  const totals = { subtotal: sub, shipping, tax, total };

  function update(key: keyof CheckoutFormState, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setFormError("");
  }

  function continueToPayment() {
    if (!isShippingComplete(form)) {
      setFormError("Complete the required shipping fields before payment.");
      return;
    }

    setStep(1);
  }

  if (completedOrderNumber) {
    return <CheckoutSuccessState orderNumber={completedOrderNumber} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <Link
          href="/"
          className="text-2xl font-headline font-black"
          style={{ color: "var(--brand-primary)" }}
        >
          Cartix
        </Link>
      </div>

      <CheckoutStepIndicator step={step} />

      <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
        <div>
          {step === 0 && (
            <CheckoutShippingStep
              form={form}
              error={formError}
              onUpdate={update}
              onContinue={continueToPayment}
            />
          )}

          {step === 1 && (
            <CheckoutPaymentStep
              items={items}
              shippingAddress={form}
              onBack={() => setStep(0)}
              onPaid={(orderNumber) => {
                clearCart();
                setCompletedOrderNumber(orderNumber);
              }}
            />
          )}

          {step === 2 && (
            <CheckoutReviewStep
              items={items}
              totals={totals}
              onBack={() => setStep(1)}
            />
          )}
        </div>

        <CheckoutOrderSummary items={items} totals={totals} />
      </div>
    </div>
  );
}

function isShippingComplete(form: CheckoutFormState) {
  return Boolean(
    form.firstName &&
      form.lastName &&
      form.email &&
      form.address1 &&
      form.city &&
      form.state &&
      form.zip &&
      form.country
  );
}
