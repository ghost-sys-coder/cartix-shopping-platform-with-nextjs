"use client";

import { motion } from "framer-motion";
import {
  DollarSign, ShoppingBag, Users, Package, ArrowRight,
  TrendingUp, Clock, CheckCircle2, XCircle, Truck,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import Link from "next/link";
import { StatsCard } from "@/components/admin/stats-card";

const REVENUE_DATA = [
  { month: "Oct", revenue: 18400, orders: 142 },
  { month: "Nov", revenue: 22100, orders: 178 },
  { month: "Dec", revenue: 35600, orders: 264 },
  { month: "Jan", revenue: 28200, orders: 198 },
  { month: "Feb", revenue: 31000, orders: 221 },
  { month: "Mar", revenue: 29800, orders: 209 },
  { month: "Apr", revenue: 38400, orders: 287 },
];

const CATEGORY_DATA = [
  { name: "Electronics", value: 38, color: "var(--brand-primary)" },
  { name: "Fashion", value: 28, color: "var(--brand-secondary)" },
  { name: "Home & Living", value: 20, color: "var(--brand-tertiary)" },
  { name: "Sports", value: 14, color: "var(--brand-primary-container)" },
];

const RECENT_ORDERS = [
  { id: "#CR-5021", customer: "Alex Morgan", product: "Premium Headphones", amount: 249.99, status: "Delivered", date: "2m ago" },
  { id: "#CR-5020", customer: "Sam Chen", product: "Leather Watch", amount: 189.00, status: "Shipped", date: "18m ago" },
  { id: "#CR-5019", customer: "Jordan Lee", product: "Smart Tracker", amount: 99.00, status: "Processing", date: "1h ago" },
  { id: "#CR-5018", customer: "Casey Park", product: "BT Speaker", amount: 79.99, status: "Pending", date: "2h ago" },
  { id: "#CR-5017", customer: "Riley Wong", product: "Keyboard", amount: 159.00, status: "Cancelled", date: "3h ago" },
];

const TOP_PRODUCTS = [
  { name: "Premium Headphones", sales: 124, revenue: 30999, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60" },
  { name: "Leather Watch", sales: 87, revenue: 16443, img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60" },
  { name: "Smart Tracker", sales: 203, revenue: 20097, img: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=60" },
];

const STATUS_STYLES: Record<string, { icon: React.ElementType; className: string }> = {
  Delivered: { icon: CheckCircle2, className: "text-green-600 bg-green-50" },
  Shipped: { icon: Truck, className: "text-blue-600 bg-blue-50" },
  Processing: { icon: Clock, className: "text-amber-600 bg-amber-50" },
  Pending: { icon: Clock, className: "text-orange-600 bg-orange-50" },
  Cancelled: { icon: XCircle, className: "text-red-600 bg-red-50" },
};

const stagger = { show: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function AdminDashboard() {
  return (
    <div className="space-y-8 max-w-7xl">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-headline font-black tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm font-body mt-1">
          Welcome back — here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={stagger}
        className="grid grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {[
          { title: "Total Revenue", value: "38,400", change: 24.5, icon: DollarSign, prefix: "$" },
          { title: "Total Orders", value: "287", change: 12.3, icon: ShoppingBag },
          { title: "Active Customers", value: "1,842", change: 8.7, icon: Users },
          { title: "Products Listed", value: "416", change: -2.1, icon: Package },
        ].map((stat) => (
          <motion.div key={stat.title} variants={fadeUp}>
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 p-5 rounded-[var(--radius-auth)] border border-border bg-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-headline font-bold">Revenue Overview</h2>
              <p className="text-xs text-muted-foreground font-body">Monthly revenue for the last 7 months</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-label font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-600">
              <TrendingUp size={12} />
              +24.5%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--brand-primary)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--brand-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "var(--font-label)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fontFamily: "var(--font-label)" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontFamily: "var(--font-label)" }}
                formatter={(v) => [`$${Number(v).toLocaleString()}`, "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="var(--brand-primary)" strokeWidth={2.5} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category pie */}
        <div className="p-5 rounded-[var(--radius-auth)] border border-border bg-card">
          <h2 className="font-headline font-bold mb-1">Sales by Category</h2>
          <p className="text-xs text-muted-foreground font-body mb-4">Distribution this month</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {CATEGORY_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs font-label">{v}</span>} />
              <Tooltip formatter={(v) => [`${v}%`, "Share"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Orders + Top Products */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 rounded-[var(--radius-auth)] border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-headline font-bold">Recent Orders</h2>
            <Link href="/admin/orders" className="flex items-center gap-1 text-xs font-label font-semibold hover:underline" style={{ color: "var(--brand-primary)" }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {RECENT_ORDERS.map((order) => {
              const { icon: Icon, className } = STATUS_STYLES[order.status];
              return (
                <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/40 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-label font-semibold">{order.id}</span>
                      <span className="text-xs text-muted-foreground font-body">· {order.date}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-body truncate">{order.customer} — {order.product}</p>
                  </div>
                  <span className="font-label font-bold text-sm">${order.amount}</span>
                  <span className={`flex items-center gap-1 text-[11px] font-label font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${className}`}>
                    <Icon size={10} />
                    {order.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top products */}
        <div className="rounded-[var(--radius-auth)] border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-headline font-bold">Top Products</h2>
            <Link href="/admin/products" className="flex items-center gap-1 text-xs font-label font-semibold hover:underline" style={{ color: "var(--brand-primary)" }}>
              All <ArrowRight size={12} />
            </Link>
          </div>
          <div className="p-5 space-y-4">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-xs font-label font-bold text-muted-foreground w-4">{i + 1}</span>
                <img src={p.img} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-label font-semibold truncate">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground font-body">{p.sales} sold</p>
                </div>
                <span className="text-sm font-headline font-bold" style={{ color: "var(--brand-primary)" }}>
                  ${(p.revenue / 1000).toFixed(1)}k
                </span>
              </div>
            ))}
          </div>
          {/* Bar chart */}
          <div className="px-5 pb-5">
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={TOP_PRODUCTS} barSize={24}>
                <XAxis dataKey="name" tick={{ fontSize: 9, fontFamily: "var(--font-label)" }} tickLine={false} axisLine={false} />
                <Bar dataKey="sales" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} />
                <Tooltip formatter={(v) => [v, "Sales"]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
