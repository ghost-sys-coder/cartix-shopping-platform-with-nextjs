"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useUser, UserButton } from "@clerk/nextjs";
import { ShoppingCart, Search, Menu, X, Heart } from "lucide-react";
import { useCartStore } from "@/store/cart";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories" },
];

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const { itemCount, toggleCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const count = itemCount();

  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass-panel shadow-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-headline font-black tracking-tight shrink-0"
            style={{ color: "var(--brand-primary)" }}
          >
            Cartix
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative px-4 py-2 text-sm font-label font-medium rounded-lg transition-colors ${
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-primary/10"
                    />
                  )}
                  <span className="relative">{label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <Search size={18} />
            </button>

            {isSignedIn && (
              <Link
                href="/account/wishlist"
                className="hidden sm:flex w-9 h-9 items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <Heart size={18} />
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <ShoppingCart size={18} />
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                  style={{ background: "var(--brand-primary)" }}
                >
                  {count > 99 ? "99+" : count}
                </motion.span>
              )}
            </button>

            {/* User */}
            {isSignedIn ? (
              <div className="ml-1">
                <UserButton />
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="hidden sm:inline-flex ml-1 px-4 py-2 text-sm font-label font-semibold rounded-lg text-white transition-colors"
                style={{ background: "var(--brand-primary)" }}
              >
                Sign in
              </Link>
            )}

            {/* Mobile menu */}
            <button
              className="ml-1 md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed top-16 inset-x-0 z-40 glass-panel border-b border-border shadow-lg md:hidden"
          >
            <nav className="flex flex-col p-4 gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-label font-medium transition-colors ${
                    pathname === href
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {label}
                </Link>
              ))}
              {!isSignedIn && (
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 px-4 py-3 rounded-xl text-sm font-label font-semibold text-center text-white transition-colors"
                  style={{ background: "var(--brand-primary)" }}
                >
                  Sign in
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
