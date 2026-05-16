"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { CreditCard, Truck, Shield, ChevronDown } from "lucide-react";
import Link from "next/link";

const STEPS = ["Shipping", "Payment", "Review"];

export default function CheckoutPage() {
  const { items, subtotal } = useCartStore();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address1: "", address2: "", city: "", state: "", zip: "", country: "US",
  });

  const sub = subtotal();
  const shipping = sub > 99 ? 0 : 9.99;
  const tax = sub * 0.08;
  const total = sub + shipping + tax;

  function update(key: keyof typeof form, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <Link href="/" className="text-2xl font-headline font-black" style={{ color: "var(--brand-primary)" }}>
          Cartix
        </Link>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-label font-bold transition-colors ${
                  i <= step ? "text-white" : "bg-muted text-muted-foreground"
                }`}
                style={i <= step ? { background: "var(--brand-primary)" } : {}}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-sm font-label font-medium ${i === step ? "text-foreground" : "text-muted-foreground"}`}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-16 h-px bg-border" />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-10">
        {/* Form */}
        <div>
          {step === 0 && (
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h2 className="text-xl font-headline font-bold flex items-center gap-2">
                <Truck size={20} style={{ color: "var(--brand-primary)" }} />
                Shipping Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: "firstName", label: "First Name", col: 1 },
                  { key: "lastName", label: "Last Name", col: 1 },
                  { key: "email", label: "Email Address", col: 2, type: "email" },
                  { key: "phone", label: "Phone", col: 1, type: "tel" },
                  { key: "address1", label: "Address Line 1", col: 2 },
                  { key: "address2", label: "Address Line 2 (Optional)", col: 2 },
                  { key: "city", label: "City", col: 1 },
                  { key: "state", label: "State", col: 1 },
                  { key: "zip", label: "ZIP Code", col: 1 },
                ].map(({ key, label, col, type }) => (
                  <div key={key} className={col === 2 ? "col-span-2" : ""}>
                    <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">{label}</label>
                    <input
                      type={type ?? "text"}
                      value={form[key as keyof typeof form]}
                      onChange={(e) => update(key as keyof typeof form, e.target.value)}
                      className="w-full h-11 px-3 rounded-[var(--radius)] border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-body"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">Country</label>
                  <div className="relative">
                    <select
                      value={form.country}
                      onChange={(e) => update("country", e.target.value)}
                      className="w-full h-11 px-3 rounded-[var(--radius)] border border-border bg-background text-sm focus:outline-none appearance-none"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>
              <button
                onClick={() => setStep(1)}
                className="btn-brand px-8 py-3 text-sm"
              >
                Continue to Payment
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h2 className="text-xl font-headline font-bold flex items-center gap-2">
                <CreditCard size={20} style={{ color: "var(--brand-primary)" }} />
                Payment Details
              </h2>
              <div
                className="flex items-center gap-3 p-4 rounded-[var(--radius)] border"
                style={{ borderColor: "var(--brand-primary)", background: "var(--brand-primary-container)" }}
              >
                <Shield size={18} style={{ color: "var(--brand-primary)" }} />
                <p className="text-xs font-body" style={{ color: "var(--brand-primary)" }}>
                  Your payment info is secured with 256-bit SSL encryption
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">Card Number</label>
                  <input placeholder="4242 4242 4242 4242" className="w-full h-11 px-3 rounded-[var(--radius)] border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-body" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">Expiry Date</label>
                    <input placeholder="MM / YY" className="w-full h-11 px-3 rounded-[var(--radius)] border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">CVC</label>
                    <input placeholder="123" className="w-full h-11 px-3 rounded-[var(--radius)] border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">Name on Card</label>
                  <input className="w-full h-11 px-3 rounded-[var(--radius)] border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="px-6 py-3 text-sm font-label font-semibold border border-border rounded-[var(--radius)] hover:bg-muted transition-colors">
                  Back
                </button>
                <button onClick={() => setStep(2)} className="btn-brand px-8 py-3 text-sm">
                  Review Order
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h2 className="text-xl font-headline font-bold">Review Your Order</h2>
              <div className="border border-border rounded-[var(--radius-auth)] divide-y divide-border">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-label font-semibold">{item.product.name}</p>
                      {item.variant && <p className="text-xs text-muted-foreground">{item.variant.value}</p>}
                      <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-label font-bold text-sm">${((item.variant?.price ?? item.product.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-6 py-3 text-sm font-label font-semibold border border-border rounded-[var(--radius)] hover:bg-muted transition-colors">
                  Back
                </button>
                <button className="btn-brand px-8 py-3 text-sm flex items-center gap-2">
                  <Shield size={16} />
                  Place Order · ${total.toFixed(2)}
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:sticky lg:top-24 self-start">
          <div className="border border-border rounded-[var(--radius-auth)] overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="font-headline font-bold">Order Summary</h3>
            </div>
            <div className="p-5 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
                    <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white" style={{ background: "var(--brand-primary)" }}>
                      {item.quantity}
                    </span>
                  </div>
                  <span className="flex-1 text-xs font-label truncate">{item.product.name}</span>
                  <span className="text-xs font-label font-bold">${((item.variant?.price ?? item.product.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="h-px bg-border my-3" />
              {[
                { label: "Subtotal", value: `$${sub.toFixed(2)}` },
                { label: "Shipping", value: shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}` },
                { label: "Tax", value: `$${tax.toFixed(2)}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm font-label">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={label === "Shipping" && shipping === 0 ? "text-green-600 font-semibold" : ""}>{value}</span>
                </div>
              ))}
              <div className="h-px bg-border" />
              <div className="flex justify-between font-headline font-bold text-lg">
                <span>Total</span>
                <span style={{ color: "var(--brand-primary)" }}>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
