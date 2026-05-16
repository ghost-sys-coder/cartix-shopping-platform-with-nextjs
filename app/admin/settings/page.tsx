"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CreditCard,
  Globe,
  Loader2,
  Mail,
  Save,
  Shield,
  Store,
} from "lucide-react";
import { toast } from "sonner";

const TABS = [
  { id: "store", label: "Store", icon: Store },
  { id: "email", label: "Email", icon: Mail },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "seo", label: "SEO", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

const INITIAL_SETTINGS_FORM = {
  storeName: "Cartix",
  storeUrl: "https://cartix.store",
  storeEmail: "hello@cartix.store",
  storePhone: "+1 555 000 0000",
  currency: "USD",
  timezone: "America/New_York",
  taxRate: "8",
  freeShippingThreshold: "99",
  shippingRate: "9.99",
  metaTitle: "Cartix - Modern Commerce",
  metaDescription: "High-velocity ecommerce. Velocity meets vision.",
};

type SettingsForm = typeof INITIAL_SETTINGS_FORM;
type SettingsTab = (typeof TABS)[number]["id"];

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: {
  label: string;
  id: keyof SettingsForm;
  value: string;
  onChange: (id: keyof SettingsForm, value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(id, event.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-body"
      />
    </div>
  );
}

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<SettingsTab>("store");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(INITIAL_SETTINGS_FORM);

  function update(key: keyof SettingsForm, val: string) {
    setForm((current) => ({ ...current, [key]: val }));
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Settings saved successfully!");
    setSaving(false);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-headline font-black tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground text-sm font-body mt-1">
          Configure your store preferences
        </p>
      </div>

      <div className="flex gap-6">
        <nav className="w-48 shrink-0 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-label font-medium transition-colors text-left ${
                tab === id
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              style={tab === id ? { background: "var(--brand-primary)" } : {}}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <div className="flex-1">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-[var(--radius-auth)] border border-border bg-card space-y-5"
          >
            {tab === "store" && (
              <>
                <h2 className="font-headline font-bold">Store Information</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Store Name"
                    id="storeName"
                    value={form.storeName}
                    onChange={update}
                  />
                  <Field
                    label="Store URL"
                    id="storeUrl"
                    value={form.storeUrl}
                    onChange={update}
                  />
                  <Field
                    label="Contact Email"
                    id="storeEmail"
                    value={form.storeEmail}
                    onChange={update}
                    type="email"
                  />
                  <Field
                    label="Phone Number"
                    id="storePhone"
                    value={form.storePhone}
                    onChange={update}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">
                      Currency
                    </label>
                    <select
                      value={form.currency}
                      onChange={(event) => update("currency", event.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none"
                    >
                      {["USD", "EUR", "GBP", "CAD", "AUD"].map((currency) => (
                        <option key={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">
                      Timezone
                    </label>
                    <select
                      value={form.timezone}
                      onChange={(event) => update("timezone", event.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {tab === "payments" && (
              <>
                <h2 className="font-headline font-bold">Payment & Shipping</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Tax Rate (%)"
                    id="taxRate"
                    value={form.taxRate}
                    onChange={update}
                    type="number"
                  />
                  <Field
                    label="Standard Shipping Rate ($)"
                    id="shippingRate"
                    value={form.shippingRate}
                    onChange={update}
                    type="number"
                  />
                </div>
                <Field
                  label="Free Shipping Threshold ($)"
                  id="freeShippingThreshold"
                  value={form.freeShippingThreshold}
                  onChange={update}
                  type="number"
                />
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <p className="text-sm font-label font-semibold mb-2">
                    Stripe Integration
                  </p>
                  <p className="text-xs text-muted-foreground font-body mb-3">
                    Connect your Stripe account to accept payments.
                  </p>
                  <div className="space-y-3">
                    {[
                      "STRIPE_SECRET_KEY",
                      "STRIPE_PUBLISHABLE_KEY",
                      "STRIPE_WEBHOOK_SECRET",
                    ].map((key) => (
                      <div key={key}>
                        <label className="block text-xs font-label font-medium text-muted-foreground mb-1">
                          {key}
                        </label>
                        <input
                          type="password"
                          placeholder="sk_test_..."
                          className="w-full h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none font-mono text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {tab === "seo" && (
              <>
                <h2 className="font-headline font-bold">SEO Settings</h2>
                <Field
                  label="Meta Title"
                  id="metaTitle"
                  value={form.metaTitle}
                  onChange={update}
                />
                <div>
                  <label className="block text-xs font-label font-semibold text-muted-foreground mb-1.5">
                    Meta Description
                  </label>
                  <textarea
                    value={form.metaDescription}
                    onChange={(event) =>
                      update("metaDescription", event.target.value)
                    }
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none font-body resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {form.metaDescription.length}/160 characters
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-dashed border-border">
                  <p className="text-xs font-label font-bold text-muted-foreground mb-2">
                    Google Search Preview
                  </p>
                  <p className="text-blue-600 text-sm font-medium">
                    {form.metaTitle}
                  </p>
                  <p className="text-green-700 text-xs">{form.storeUrl}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {form.metaDescription}
                  </p>
                </div>
              </>
            )}

            {(tab === "email" ||
              tab === "notifications" ||
              tab === "security") && (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: "var(--brand-primary-container)" }}
                >
                  {tab === "email" ? (
                    <Mail size={22} style={{ color: "var(--brand-primary)" }} />
                  ) : tab === "notifications" ? (
                    <Bell size={22} style={{ color: "var(--brand-primary)" }} />
                  ) : (
                    <Shield
                      size={22}
                      style={{ color: "var(--brand-primary)" }}
                    />
                  )}
                </div>
                <p className="font-headline font-bold capitalize">
                  {tab} Settings
                </p>
                <p className="text-sm text-muted-foreground font-body max-w-xs">
                  Configure your {tab} settings here. This section will be fully
                  wired to your backend.
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-border flex justify-end">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSave}
                disabled={saving}
                className="btn-brand flex items-center gap-2 px-5 py-2.5 text-sm disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                Save Changes
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
