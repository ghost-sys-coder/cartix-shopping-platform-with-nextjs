"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } =
    useCartStore();

  const total = subtotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-background border-l border-border flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} style={{ color: "var(--brand-primary)" }} />
                <h2 className="font-headline font-bold text-lg">
                  Cart
                  {items.length > 0 && (
                    <span className="ml-2 text-sm font-label font-normal text-muted-foreground">
                      ({items.length})
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
                  <ShoppingBag size={48} className="text-muted-foreground/40" />
                  <div className="text-center">
                    <p className="font-headline font-semibold text-foreground">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start shopping to add items
                    </p>
                  </div>
                  <button
                    onClick={closeCart}
                    className="btn-brand px-5 py-2.5 text-sm"
                  >
                    Browse products
                  </button>
                </div>
              ) : (
                items.map((item) => {
                  const unitPrice = item.variant?.price ?? item.product.price;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex gap-3"
                    >
                      {/* Image */}
                      <div className="relative w-18 h-18 rounded-xl overflow-hidden bg-muted shrink-0" style={{ width: 72, height: 72 }}>
                        <Image
                          src={item.product.imageUrl || "/placeholder.jpg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.product.slug}`}
                          onClick={closeCart}
                          className="text-sm font-label font-semibold truncate hover:underline block"
                        >
                          {item.product.name}
                        </Link>
                        {item.variant && (
                          <p className="text-xs text-muted-foreground mt-0.5 font-body">
                            {item.variant.name}: {item.variant.value}
                          </p>
                        )}
                        <p className="text-sm font-bold mt-1 font-label" style={{ color: "var(--brand-primary)" }}>
                          ${(unitPrice * item.quantity).toFixed(2)}
                        </p>

                        {/* Qty controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-border rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-2 text-sm font-label font-medium min-w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-muted-foreground"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-5 py-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-label">Subtotal</span>
                  <span className="font-bold font-headline text-lg">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-body">
                  Shipping and taxes calculated at checkout
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-brand w-full flex items-center justify-center gap-2 py-3 text-sm"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="w-full py-2.5 text-sm font-label font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Continue shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
