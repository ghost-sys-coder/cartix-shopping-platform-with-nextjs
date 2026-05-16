"use client";

import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight } from "lucide-react";

const REVENUE_30D = Array.from({ length: 30 }, (_, i) => ({
  day: `Apr ${i + 1}`,
  revenue: Math.round(800 + Math.random() * 1200),
  orders: Math.round(8 + Math.random() * 12),
}));

const WEEKLY = [
  { week: "W1 Mar", revenue: 21000, newUsers: 124, orders: 167 },
  { week: "W2 Mar", revenue: 24500, newUsers: 138, orders: 189 },
  { week: "W3 Mar", revenue: 22800, newUsers: 115, orders: 174 },
  { week: "W4 Mar", revenue: 28100, newUsers: 162, orders: 214 },
  { week: "W1 Apr", revenue: 31400, newUsers: 178, orders: 241 },
  { week: "W2 Apr", revenue: 38400, newUsers: 201, orders: 287 },
];

const TOP_PAGES = [
  { page: "/products", views: 12450, conversion: 4.2 },
  { page: "/products/premium-headphones", views: 8320, conversion: 6.8 },
  { page: "/", views: 15600, conversion: 3.1 },
  { page: "/categories/electronics", views: 6240, conversion: 5.4 },
  { page: "/cart", views: 4180, conversion: 28.3 },
];

const DEVICE_DATA = [
  { name: "Mobile", value: 52, color: "var(--brand-primary)" },
  { name: "Desktop", value: 38, color: "var(--brand-secondary)" },
  { name: "Tablet", value: 10, color: "var(--brand-tertiary)" },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl font-headline font-black tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm font-body mt-1">Performance overview for your store</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Monthly Revenue", value: "$38,400", change: "+24.5%", icon: DollarSign },
          { label: "Total Orders", value: "287", change: "+12.3%", icon: ShoppingBag },
          { label: "New Customers", value: "201", change: "+18.7%", icon: Users },
          { label: "Avg. Order Value", value: "$133.80", change: "+5.4%", icon: TrendingUp },
        ].map(({ label, value, change, icon: Icon }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-[var(--radius-auth)] border border-border bg-card"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--brand-primary-container)" }}>
                <Icon size={16} style={{ color: "var(--brand-primary)" }} />
              </div>
              <span className="flex items-center gap-0.5 text-xs font-label font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                <ArrowUpRight size={10} />
                {change}
              </span>
            </div>
            <p className="text-xs font-label font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">{label}</p>
            <p className="text-2xl font-headline font-black" style={{ color: "var(--brand-primary)" }}>{value}</p>
          </motion.div>
        ))}
      </div>

      {/* 30-day revenue */}
      <div className="p-5 rounded-[var(--radius-auth)] border border-border bg-card">
        <h2 className="font-headline font-bold mb-1">Daily Revenue — Last 30 Days</h2>
        <p className="text-xs text-muted-foreground font-body mb-5">Revenue and order volume per day</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={REVENUE_30D}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.18} />
                <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--brand-secondary)" stopOpacity={0.15} />
                <stop offset="95%" stopColor="var(--brand-secondary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fontFamily: "var(--font-label)" }} tickLine={false} axisLine={false} interval={4} />
            <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", fontFamily: "var(--font-label)", fontSize: 12 }} />
            <Legend iconType="circle" iconSize={8} />
            <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="var(--brand-primary)" strokeWidth={2} fill="url(#revGrad)" name="Revenue ($)" />
            <Area yAxisId="right" type="monotone" dataKey="orders" stroke="var(--brand-secondary)" strokeWidth={2} fill="url(#ordGrad)" name="Orders" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Weekly trend */}
        <div className="lg:col-span-2 p-5 rounded-[var(--radius-auth)] border border-border bg-card">
          <h2 className="font-headline font-bold mb-1">Weekly Revenue Trend</h2>
          <p className="text-xs text-muted-foreground font-body mb-5">Last 6 weeks performance</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WEEKLY} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 }} />
              <Legend iconType="circle" iconSize={8} />
              <Bar dataKey="revenue" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} name="Revenue ($)" />
              <Bar dataKey="newUsers" fill="var(--brand-secondary)" radius={[4, 4, 0, 0]} name="New Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Device breakdown */}
        <div className="p-5 rounded-[var(--radius-auth)] border border-border bg-card">
          <h2 className="font-headline font-bold mb-1">Device Breakdown</h2>
          <p className="text-xs text-muted-foreground font-body mb-4">Traffic by device type</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={DEVICE_DATA} cx="50%" cy="50%" outerRadius={75} innerRadius={45} paddingAngle={4} dataKey="value">
                {DEVICE_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs font-label">{v}</span>} />
              <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top pages */}
      <div className="rounded-[var(--radius-auth)] border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-headline font-bold">Top Performing Pages</h2>
          <p className="text-xs text-muted-foreground font-body mt-0.5">Pages ranked by conversion rate</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["Page", "Views", "Conversion Rate", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-[11px] font-label font-bold uppercase tracking-widest text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {TOP_PAGES.map((page) => (
              <tr key={page.page} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 font-mono text-sm text-muted-foreground">{page.page}</td>
                <td className="px-5 py-3 text-sm font-label font-semibold">{page.views.toLocaleString()}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 max-w-[120px] h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${Math.min(page.conversion * 3, 100)}%`, background: "var(--brand-primary)" }}
                      />
                    </div>
                    <span className="text-sm font-label font-bold" style={{ color: page.conversion > 10 ? "var(--brand-primary)" : "inherit" }}>
                      {page.conversion}%
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <TrendingUp size={14} className="text-green-500" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
