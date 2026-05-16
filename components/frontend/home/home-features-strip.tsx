"use client";

import { motion } from "framer-motion";
import { Headphones, RefreshCw, Shield, Zap } from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Fast Delivery", desc: "Express shipping in 24-48 hours" },
  { icon: Shield, title: "Secure Payment", desc: "256-bit SSL encryption" },
  { icon: RefreshCw, title: "Free Returns", desc: "30-day return policy" },
  { icon: Headphones, title: "24/7 Support", desc: "Always-on customer care" },
];

export function HomeFeaturesStrip() {
  return (
    <section className="py-16 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center gap-3 p-4"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "var(--brand-primary-container)" }}
              >
                <Icon size={22} style={{ color: "var(--brand-primary)" }} />
              </div>
              <div>
                <h3 className="font-label font-semibold text-sm">{title}</h3>
                <p className="text-xs text-muted-foreground font-body mt-0.5">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
