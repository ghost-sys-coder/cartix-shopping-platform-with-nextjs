"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Package, Heart, MapPin, CreditCard, Settings, ChevronRight, ShoppingBag, Star } from "lucide-react";

const MENU_ITEMS = [
  { icon: Package, label: "My Orders", href: "/account/orders", badge: "3" },
  { icon: Heart, label: "Wishlist", href: "/account/wishlist" },
  { icon: MapPin, label: "Addresses", href: "/account/addresses" },
  { icon: CreditCard, label: "Payment Methods", href: "/account/payment" },
  { icon: Star, label: "Reviews", href: "/account/reviews" },
  { icon: Settings, label: "Settings", href: "/account/settings" },
];

const RECENT_ORDERS = [
  { id: "#CR-4521", date: "Apr 10, 2026", status: "Delivered", total: 249.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100" },
  { id: "#CR-4498", date: "Apr 02, 2026", status: "Shipped", total: 89.00, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100" },
  { id: "#CR-4412", date: "Mar 20, 2026", status: "Processing", total: 159.00, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100" },
];

const STATUS_COLORS: Record<string, string> = {
  Delivered: "text-green-600 bg-green-50",
  Shipped: "text-blue-600 bg-blue-50",
  Processing: "text-amber-600 bg-amber-50",
};

export default function AccountPage() {
  const { user } = useUser();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-5 mb-10 p-6 rounded-[var(--radius-auth)] border border-border bg-card"
      >
        {user?.imageUrl ? (
          <Image src={user.imageUrl} alt={user.fullName ?? "User"} width={72} height={72} className="rounded-full ring-4 ring-[var(--brand-primary-container)]" />
        ) : (
          <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-2xl font-headline font-bold text-white" style={{ background: "var(--brand-gradient)" }}>
            {user?.firstName?.[0] ?? "U"}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-headline font-bold">{user?.fullName ?? "My Account"}</h1>
          <p className="text-muted-foreground text-sm font-body mt-0.5">{user?.emailAddresses[0]?.emailAddress}</p>
          <span className="inline-flex items-center gap-1 mt-2 text-xs font-label font-semibold px-2.5 py-1 rounded-full" style={{ background: "var(--brand-primary-container)", color: "var(--brand-primary)" }}>
            Verified Customer
          </span>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div>
          <nav className="border border-border rounded-[var(--radius-auth)] overflow-hidden divide-y divide-border">
            {MENU_ITEMS.map(({ icon: Icon, label, href, badge }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={href}
                  className="flex items-center justify-between px-4 py-3.5 hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className="text-muted-foreground group-hover:text-foreground transition-colors" style={{ color: "var(--brand-primary)" }} />
                    <span className="text-sm font-label font-medium">{label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {badge && (
                      <span className="text-[10px] font-label font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "var(--brand-primary)" }}>
                        {badge}
                      </span>
                    )}
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>

        {/* Recent orders */}
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-headline font-bold">Recent Orders</h2>
            <Link href="/account/orders" className="text-sm font-label font-semibold hover:underline" style={{ color: "var(--brand-primary)" }}>
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {RECENT_ORDERS.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-4 p-4 rounded-[var(--radius-auth)] border border-border bg-card hover:shadow-md transition-shadow"
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0">
                  <Image src={order.image} alt="" fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-label font-semibold text-sm">{order.id}</span>
                    <span className={`text-[11px] font-label font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-headline font-bold" style={{ color: "var(--brand-primary)" }}>${order.total}</p>
                  <Link href={`/account/orders/${order.id}`} className="text-xs font-label text-muted-foreground hover:text-foreground transition-colors mt-0.5 block">
                    View details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty state if needed */}
          {RECENT_ORDERS.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <ShoppingBag size={48} className="text-muted-foreground/30" />
              <p className="text-muted-foreground font-body">No orders yet</p>
              <Link href="/products" className="btn-brand px-5 py-2.5 text-sm">
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
