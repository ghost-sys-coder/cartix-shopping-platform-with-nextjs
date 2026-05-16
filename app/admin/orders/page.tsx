"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Eye, ChevronDown, Download } from "lucide-react";
import Link from "next/link";

const ORDERS = [
  { id: "#CR-5021", customer: "Alex Morgan", email: "alex@example.com", date: "Apr 13, 2026", items: 2, total: 249.99, status: "delivered", payment: "paid" },
  { id: "#CR-5020", customer: "Sam Chen", email: "sam@example.com", date: "Apr 13, 2026", items: 1, total: 189.00, status: "shipped", payment: "paid" },
  { id: "#CR-5019", customer: "Jordan Lee", email: "jordan@example.com", date: "Apr 12, 2026", items: 3, total: 328.00, status: "processing", payment: "paid" },
  { id: "#CR-5018", customer: "Casey Park", email: "casey@example.com", date: "Apr 12, 2026", items: 1, total: 79.99, status: "pending", payment: "pending" },
  { id: "#CR-5017", customer: "Riley Wong", email: "riley@example.com", date: "Apr 11, 2026", items: 2, total: 238.99, status: "cancelled", payment: "refunded" },
  { id: "#CR-5016", customer: "Morgan Smith", email: "morgan@example.com", date: "Apr 11, 2026", items: 4, total: 486.00, status: "delivered", payment: "paid" },
];

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-orange-50 text-orange-600",
  processing: "bg-amber-50 text-amber-600",
  shipped: "bg-blue-50 text-blue-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-600",
};

const PAYMENT_STYLE: Record<string, string> = {
  paid: "bg-green-50 text-green-600",
  pending: "bg-amber-50 text-amber-600",
  refunded: "bg-gray-100 text-gray-500",
  failed: "bg-red-50 text-red-600",
};

const STATUS_TABS = ["all", "pending", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  const filtered = ORDERS.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === "all" || o.status === tab;
    return matchSearch && matchTab;
  });

  const stats = {
    total: ORDERS.length,
    revenue: ORDERS.filter(o => o.payment === "paid").reduce((s, o) => s + o.total, 0),
    pending: ORDERS.filter(o => o.status === "pending").length,
    delivered: ORDERS.filter(o => o.status === "delivered").length,
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-headline font-black tracking-tight">Orders</h1>
          <p className="text-muted-foreground text-sm font-body mt-1">{ORDERS.length} total orders</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-label font-semibold border border-border rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: stats.total },
          { label: "Revenue", value: `$${stats.revenue.toLocaleString("en", { minimumFractionDigits: 2 })}` },
          { label: "Pending", value: stats.pending },
          { label: "Delivered", value: stats.delivered },
        ].map(({ label, value }) => (
          <div key={label} className="p-4 rounded-[var(--radius-auth)] border border-border bg-card">
            <p className="text-xs font-label font-semibold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
            <p className="text-2xl font-headline font-black" style={{ color: "var(--brand-primary)" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_TABS.map((s) => (
          <button
            key={s}
            onClick={() => setTab(s)}
            className={`px-3 py-1.5 text-xs font-label font-semibold rounded-lg capitalize transition-colors ${
              tab === s ? "text-white" : "border border-border text-muted-foreground hover:bg-muted"
            }`}
            style={tab === s ? { background: "var(--brand-primary)" } : {}}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-body"
          />
        </div>
        <button className="flex items-center gap-1.5 h-9 px-3 text-sm font-label border border-border rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <Filter size={14} />
          Date range
          <ChevronDown size={12} />
        </button>
      </div>

      {/* Table */}
      <div className="rounded-[var(--radius-auth)] border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Order", "Customer", "Date", "Items", "Total", "Payment", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-label font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-4 py-3 font-label font-semibold text-sm">{order.id}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-label font-medium">{order.customer}</div>
                    <div className="text-xs text-muted-foreground font-body">{order.email}</div>
                  </td>
                  <td className="px-4 py-3 text-xs font-body text-muted-foreground whitespace-nowrap">{order.date}</td>
                  <td className="px-4 py-3 text-sm font-label text-center">{order.items}</td>
                  <td className="px-4 py-3 font-label font-bold text-sm" style={{ color: "var(--brand-primary)" }}>${order.total}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-label font-bold px-2 py-0.5 rounded-full capitalize ${PAYMENT_STYLE[order.payment]}`}>{order.payment}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-label font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[order.status]}`}>{order.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
                      <Eye size={13} />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
