"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Mail, ShoppingBag, DollarSign, MoreHorizontal } from "lucide-react";
import Image from "next/image";

const CUSTOMERS = [
  { id: 1, name: "Alex Morgan", email: "alex@example.com", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80", orders: 12, spent: 1849.88, joined: "Jan 12, 2026", lastOrder: "Apr 13, 2026", status: "active" },
  { id: 2, name: "Sam Chen", email: "sam@example.com", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80", orders: 7, spent: 924.50, joined: "Feb 3, 2026", lastOrder: "Apr 13, 2026", status: "active" },
  { id: 3, name: "Jordan Lee", email: "jordan@example.com", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80", orders: 3, spent: 328.00, joined: "Mar 15, 2026", lastOrder: "Apr 12, 2026", status: "active" },
  { id: 4, name: "Casey Park", email: "casey@example.com", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80", orders: 1, spent: 79.99, joined: "Apr 8, 2026", lastOrder: "Apr 12, 2026", status: "new" },
  { id: 5, name: "Riley Wong", email: "riley@example.com", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80", orders: 0, spent: 0, joined: "Apr 1, 2026", lastOrder: "—", status: "inactive" },
];

const STATUS_STYLE: Record<string, string> = {
  active: "bg-green-50 text-green-600",
  new: "bg-blue-50 text-blue-600",
  inactive: "bg-gray-100 text-gray-500",
};

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");

  const filtered = CUSTOMERS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-headline font-black tracking-tight">Customers</h1>
          <p className="text-muted-foreground text-sm font-body mt-1">{CUSTOMERS.length} registered customers</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Customers", value: CUSTOMERS.length, icon: "👥" },
          { label: "Total Orders", value: CUSTOMERS.reduce((s, c) => s + c.orders, 0), icon: "📦" },
          { label: "Total Revenue", value: `$${CUSTOMERS.reduce((s, c) => s + c.spent, 0).toLocaleString("en", { minimumFractionDigits: 2 })}`, icon: "💰" },
        ].map(({ label, value, icon }) => (
          <div key={label} className="p-4 rounded-[var(--radius-auth)] border border-border bg-card">
            <div className="text-2xl mb-1">{icon}</div>
            <p className="text-xs font-label font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
            <p className="text-2xl font-headline font-black mt-0.5" style={{ color: "var(--brand-primary)" }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 font-body"
        />
      </div>

      {/* Table */}
      <div className="rounded-[var(--radius-auth)] border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["Customer", "Orders", "Total Spent", "Joined", "Last Order", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-label font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((c, i) => (
              <motion.tr
                key={c.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="hover:bg-muted/30 transition-colors group"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-muted shrink-0">
                      <Image src={c.avatar} alt={c.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-label font-semibold">{c.name}</div>
                      <div className="text-xs text-muted-foreground font-body">{c.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-sm font-label">
                    <ShoppingBag size={12} className="text-muted-foreground" />
                    {c.orders}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-sm font-label font-bold" style={{ color: "var(--brand-primary)" }}>
                    <DollarSign size={12} />
                    {c.spent.toFixed(2)}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-body">{c.joined}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-body">{c.lastOrder}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-label font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[c.status]}`}>{c.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                      <Mail size={13} />
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                      <MoreHorizontal size={13} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
