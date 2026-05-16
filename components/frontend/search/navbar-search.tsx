"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function NavbarSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedQuery = query.trim().replace(/\s+/g, " ");
    if (!normalizedQuery) return;

    setOpen(false);
    setQuery("");
    router.push(`/search?q=${encodeURIComponent(normalizedQuery)}`);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Search products"
        aria-expanded={open}
      >
        {open ? <X size={18} /> : <Search size={18} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.form
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            onSubmit={handleSubmit}
            className="absolute right-0 top-11 z-50 flex w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-[var(--radius-auth)] border border-border bg-card shadow-xl"
          >
            <label htmlFor="navbar-product-search" className="sr-only">
              Search products
            </label>
            <div className="flex w-10 items-center justify-center text-muted-foreground">
              <Search size={16} />
            </div>
            <input
              ref={inputRef}
              id="navbar-product-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products"
              className="min-w-0 flex-1 bg-transparent py-3 pr-3 text-sm font-body outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="px-4 text-sm font-label font-semibold text-white"
              style={{ background: "var(--brand-primary)" }}
            >
              Go
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
