import type { CartItem } from "@/store/cart";

export interface CheckoutFormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CheckoutTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface PayPalCheckoutPayload {
  items: Array<{
    productId: number;
    variantId: number | null;
    quantity: number;
  }>;
  shippingAddress: CheckoutFormState;
}

export const EMPTY_CHECKOUT_FORM: CheckoutFormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
};

export function checkoutPayloadFromCart(
  items: CartItem[],
  shippingAddress: CheckoutFormState
): PayPalCheckoutPayload {
  return {
    items: items.map((item) => ({
      productId: item.product.id,
      variantId: item.variant?.id ?? null,
      quantity: item.quantity,
    })),
    shippingAddress,
  };
}
