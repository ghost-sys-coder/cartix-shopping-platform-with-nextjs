import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  imageUrl: string;
  sku?: string;
}

export interface CartVariant {
  id: number;
  name: string;
  value: string;
  price?: number;
}

export interface CartItem {
  id: string;
  product: CartProduct;
  variant?: CartVariant;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: CartProduct, variant?: CartVariant, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, variant, quantity = 1) => {
        const id = variant ? `${product.id}-${variant.id}` : `${product.id}`;
        set((state) => {
          const existing = state.items.find((i) => i.id === id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { id, product, variant, quantity }],
          };
        });
        set({ isOpen: true });
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => {
          const price = i.variant?.price ?? i.product.price;
          return sum + price * i.quantity;
        }, 0),
    }),
    {
      name: "cartix-cart",
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    }
  )
);
