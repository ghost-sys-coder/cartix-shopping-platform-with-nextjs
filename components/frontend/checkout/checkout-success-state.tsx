import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface CheckoutSuccessStateProps {
  orderNumber: string;
}

export function CheckoutSuccessState({ orderNumber }: CheckoutSuccessStateProps) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
        style={{
          background: "var(--brand-primary-container)",
          color: "var(--brand-primary)",
        }}
      >
        <CheckCircle2 size={28} />
      </div>
      <h1 className="mt-5 text-3xl font-headline font-black tracking-tight">
        Payment Confirmed
      </h1>
      <p className="mt-2 text-sm text-muted-foreground font-body">
        Your PayPal payment was captured and order {orderNumber} is confirmed.
      </p>
      <Link href="/products" className="btn-brand mt-8 inline-flex px-6 py-3 text-sm">
        Continue Shopping
      </Link>
    </section>
  );
}
