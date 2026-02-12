import { getProductById } from "@/lib/data";

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  country: string;
}

export const CART_STORAGE_KEY = "gyg_cart_v1";

export function clampQuantity(value: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(10, Math.round(value)));
}

export function sanitizeCartItems(items: unknown): CartItem[] {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      if (typeof row.productId !== "string") return null;
      const product = getProductById(row.productId);
      if (!product) return null;
      return {
        productId: row.productId,
        quantity: clampQuantity(Number(row.quantity ?? 1)),
      } satisfies CartItem;
    })
    .filter((item): item is CartItem => item !== null);
}

export function computeCartTotal(items: CartItem[]) {
  return items.reduce((total, item) => {
    const product = getProductById(item.productId);
    if (!product) return total;
    return total + product.price * item.quantity;
  }, 0);
}
