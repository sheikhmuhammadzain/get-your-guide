"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProductById } from "@/lib/data";
import { computeCartTotal } from "@/modules/commerce/cart";
import { useCartState } from "@/components/commerce/cart-client";

export default function CheckoutPageClient() {
  const router = useRouter();
  const { items, clearCart } = useCartState();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("United States");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(() => computeCartTotal(items), [items]);
  const currency = getProductById(items[0]?.productId ?? "")?.currency ?? "EUR";
  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(total);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/v1/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items,
          customer: {
            fullName,
            email,
            phone,
            country,
          },
        }),
      });

      const body = (await response.json()) as { orderId?: string; detail?: string };
      if (!response.ok || !body.orderId) {
        throw new Error(body.detail ?? "Checkout failed");
      }

      clearCart();
      router.push(`/checkout/success?orderId=${encodeURIComponent(body.orderId)}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Checkout failed");
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
        <p className="text-gray-700">Your cart is empty. Add at least one tour before checkout.</p>
        <Link href="/" className="mt-4 inline-flex rounded-full bg-brand px-5 py-2 font-semibold text-white">
          Browse tours
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Traveler Details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Full name"
            className="h-11 rounded-lg border border-gray-300 px-3"
          />
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="h-11 rounded-lg border border-gray-300 px-3"
          />
          <input
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Phone"
            className="h-11 rounded-lg border border-gray-300 px-3"
          />
          <input
            required
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            placeholder="Country"
            className="h-11 rounded-lg border border-gray-300 px-3"
          />
        </div>

        <button
          disabled={isSubmitting}
          className="mt-6 rounded-full bg-brand px-6 py-2.5 font-semibold text-white disabled:opacity-70"
        >
          {isSubmitting ? "Processing..." : `Pay ${formattedTotal}`}
        </button>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </form>

      <aside className="h-fit rounded-xl border border-gray-200 bg-gray-50 p-5">
        <p className="text-sm text-gray-600">Order Summary</p>
        <p className="mt-1 text-2xl font-bold">{formattedTotal}</p>
        <ul className="mt-3 space-y-2 text-sm text-gray-700">
          {items.map((item) => {
            const product = getProductById(item.productId);
            if (!product) return null;
            return (
              <li key={item.productId} className="flex justify-between gap-2">
                <span className="line-clamp-2">{product.title}</span>
                <span>x{item.quantity}</span>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}

