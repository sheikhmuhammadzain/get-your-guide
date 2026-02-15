"use client";

import Link from "next/link";
import { formatPrice, getProductById } from "@/lib/data";
import { computeCartTotal } from "@/modules/commerce/cart";
import { useCartState } from "@/components/commerce/cart-client";

export default function CartPageClient() {
  const { items, updateQuantity, removeItem } = useCartState();

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
        <p className="text-gray-700">Your cart is currently empty.</p>
        <p className="mt-2 text-sm text-gray-600">Open a tour and add it to continue to checkout.</p>
        <Link href="/" className="mt-4 inline-flex rounded-full bg-brand px-5 py-2 font-semibold text-white">
          Browse tours
        </Link>
      </div>
    );
  }

  const total = computeCartTotal(items);
  const currency = getProductById(items[0].productId)?.currency ?? "EUR";
  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(total);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {items.map((item) => {
          const product = getProductById(item.productId);
          if (!product) return null;
          return (
            <article key={item.productId} className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-semibold">{product.title}</h2>
              <p className="mt-1 text-sm text-gray-600">
                {product.location} â€¢ {product.duration}
              </p>
              <p className="mt-2 text-sm text-gray-700">{formatPrice(product)} per traveler</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={item.quantity}
                  onChange={(event) => updateQuantity(item.productId, Number(event.target.value))}
                  className="h-10 w-24 rounded-lg border border-gray-300 px-3"
                />
                <button
                  onClick={() => removeItem(item.productId)}
                  className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-700"
                >
                  Remove
                </button>
                <Link href={`/products/${product.id}`} className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">
                  View detail
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <aside className="h-fit rounded-xl border border-gray-200 bg-gray-50 p-5">
        <p className="text-sm text-gray-600">Subtotal</p>
        <p className="mt-1 text-2xl font-bold">{formattedTotal}</p>
        <p className="mt-2 text-xs text-gray-500">Taxes and final payment details will be shown on checkout.</p>
        <Link href="/checkout" className="mt-5 inline-flex w-full justify-center rounded-full bg-brand px-5 py-2.5 font-semibold text-white">
          Continue to checkout
        </Link>
      </aside>
    </div>
  );
}

