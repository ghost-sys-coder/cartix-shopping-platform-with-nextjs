import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { productImages, products, productVariants } from "@/db/schema";
import { toMoney } from "@/lib/paypal/paypal";

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 99;
const STANDARD_SHIPPING = 9.99;

export interface CheckoutAddress {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CheckoutItemInput {
  productId: unknown;
  variantId?: unknown;
  quantity: unknown;
}

export interface NormalizedCheckoutItem {
  productId: number;
  variantId: number | null;
  quantity: number;
}

export interface CheckoutProductRow {
  id: number;
  name: string;
  price: string;
  sku: string | null;
  imageUrl: string | null;
}

export interface CheckoutVariantRow {
  id: number;
  productId: number;
  name: string;
  value: string;
  price: string | null;
}

export interface CheckoutOrderItem {
  productId: number;
  variantId: number | null;
  productName: string;
  variantName: string | null;
  sku: string | null;
  imageUrl: string | null;
  price: string;
  quantity: number;
  total: string;
}

export interface CheckoutSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  orderItems: CheckoutOrderItem[];
}

function integerValue(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isInteger(parsed) ? parsed : null;
}

function numberValue(value: string | null | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function normalizeCheckoutItems(
  items: CheckoutItemInput[]
): NormalizedCheckoutItem[] {
  return items
    .map((item) => {
      const productId = integerValue(item.productId);
      const variantId = integerValue(item.variantId);
      const quantity = integerValue(item.quantity);

      if (!productId || productId <= 0 || !quantity || quantity <= 0) {
        return null;
      }

      return {
        productId,
        variantId: variantId && variantId > 0 ? variantId : null,
        quantity: Math.min(quantity, 99),
      };
    })
    .filter((item): item is NormalizedCheckoutItem => item !== null);
}

export function buildCheckoutSummary({
  items,
  products,
  variants,
}: {
  items: NormalizedCheckoutItem[];
  products: CheckoutProductRow[];
  variants: CheckoutVariantRow[];
}): CheckoutSummary {
  const productsById = new Map(products.map((product) => [product.id, product]));
  const variantsById = new Map(variants.map((variant) => [variant.id, variant]));

  const orderItems = items.map((item) => {
    const product = productsById.get(item.productId);
    if (!product) {
      throw new Error("Product in cart is no longer available");
    }

    const variant =
      item.variantId !== null ? variantsById.get(item.variantId) : undefined;
    if (item.variantId !== null && (!variant || variant.productId !== product.id)) {
      throw new Error("Product option in cart is no longer available");
    }

    const unitPrice = numberValue(variant?.price ?? product.price);
    const lineTotal = unitPrice * item.quantity;

    return {
      productId: product.id,
      variantId: variant?.id ?? null,
      productName: product.name,
      variantName: variant ? `${variant.name}: ${variant.value}` : null,
      sku: product.sku,
      imageUrl: product.imageUrl,
      price: toMoney(unitPrice),
      quantity: item.quantity,
      total: toMoney(lineTotal),
    };
  });

  const subtotal = orderItems.reduce(
    (sum, item) => sum + numberValue(item.total),
    0
  );
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return {
    subtotal: Number(toMoney(subtotal)),
    shipping: Number(toMoney(shipping)),
    tax: Number(toMoney(tax)),
    total: Number(toMoney(total)),
    orderItems,
  };
}

export async function getCheckoutSummaryFromCart(items: CheckoutItemInput[]) {
  const normalizedItems = normalizeCheckoutItems(items);
  if (normalizedItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const productIds = [...new Set(normalizedItems.map((item) => item.productId))];
  const variantIds = [
    ...new Set(
      normalizedItems
        .map((item) => item.variantId)
        .filter((variantId): variantId is number => variantId !== null)
    ),
  ];

  const [productRows, variantRows] = await Promise.all([
    db
      .select({
        id: products.id,
        name: products.name,
        price: products.price,
        sku: products.sku,
        imageUrl: productImages.url,
      })
      .from(products)
      .leftJoin(
        productImages,
        and(
          eq(productImages.productId, products.id),
          eq(productImages.isPrimary, true)
        )
      )
      .where(and(inArray(products.id, productIds), eq(products.status, "active"))),
    variantIds.length > 0
      ? db
          .select({
            id: productVariants.id,
            productId: productVariants.productId,
            name: productVariants.name,
            value: productVariants.value,
            price: productVariants.price,
          })
          .from(productVariants)
          .where(inArray(productVariants.id, variantIds))
      : Promise.resolve([]),
  ]);

  return buildCheckoutSummary({
    items: normalizedItems,
    products: productRows,
    variants: variantRows,
  });
}

export function normalizeCheckoutAddress(value: unknown): CheckoutAddress | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  const record = value as Record<string, unknown>;
  const address = {
    firstName: stringValue(record.firstName),
    lastName: stringValue(record.lastName),
    email: stringValue(record.email),
    phone: stringValue(record.phone),
    address1: stringValue(record.address1),
    address2: stringValue(record.address2),
    city: stringValue(record.city),
    state: stringValue(record.state),
    zip: stringValue(record.zip),
    country: stringValue(record.country) || "US",
  };

  if (
    !address.firstName ||
    !address.lastName ||
    !address.address1 ||
    !address.city ||
    !address.state ||
    !address.zip ||
    !address.country
  ) {
    return null;
  }

  return address;
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
