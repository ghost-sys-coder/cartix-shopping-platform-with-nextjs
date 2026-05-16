"use client";

import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  period?: string;
  icon: LucideIcon;
  prefix?: string;
}

export function StatsCard({ title, value, change, period = "vs last month", icon: Icon, prefix = "" }: StatsCardProps) {
  const positive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-[var(--radius-auth)] border border-border bg-card hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "var(--brand-primary-container)" }}
        >
          <Icon size={18} style={{ color: "var(--brand-primary)" }} />
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-label font-semibold px-2 py-1 rounded-full ${
            positive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          }`}
        >
          {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-xs font-label font-semibold uppercase tracking-widest text-muted-foreground mb-1">
        {title}
      </p>
      <p className="text-3xl font-headline font-black">
        {prefix}{value}
      </p>
      <p className="text-xs text-muted-foreground font-body mt-1">{period}</p>
    </motion.div>
  );
}
