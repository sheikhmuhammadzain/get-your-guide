"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import CurrencyAmount from "@/components/CurrencyAmount";
import { products } from "@/lib/data";

interface WishlistResponse {
  items: string[];
  count: number;
}

export default function WishlistPageClient() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadWishlist() {
      setLoading(true);
      try {
        const response = await fetch("/api/v1/wishlist", { cache: "no-store" });
        if (response.status === 401) {
          if (!cancelled) {
            setItems([]);
          }
          return;
        }

        if (!response.ok) {
          if (!cancelled) setItems([]);
          return;
        }

        const body = (await response.json()) as WishlistResponse;
        if (!cancelled) {
          setItems(body.items ?? []);
        }
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadWishlist();
    return () => {
      cancelled = true;
    };
  }, []);

  const wishlistProducts = useMemo(
    () => products.filter((product) => items.includes(product.id)),
    [items],
  );

  async function removeItem(productId: string) {
    try {
      const response = await fetch(`/api/v1/wishlist/${productId}`, { method: "DELETE" });
      if (!response.ok) {
        return;
      }

      const body = (await response.json()) as WishlistResponse;
      setItems(body.items ?? []);
      window.dispatchEvent(new CustomEvent("wishlist:changed", { detail: { items: body.items ?? [] } }));
    } catch {
      // no-op
    }
  }

  if (loading) {
    return <div className="rounded-xl border border-border-default bg-surface-muted p-6 text-text-body">Loading wishlist...</div>;
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="rounded-xl border border-border-default bg-surface-muted p-6">
        <p className="text-text-body">No wishlist items yet.</p>
        <p className="mt-2 text-sm text-text-body">Browse curated attractions and add favorites as you plan.</p>
        <Link
          href="/attractions"
          className="mt-4 inline-flex rounded-full bg-brand px-5 py-2 font-semibold text-white"
        >
          Explore Attractions
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {wishlistProducts.map((product) => (
        <article key={product.id} className="rounded-xl border border-border-default bg-surface-base p-4">
          <h2 className="text-lg font-semibold">{product.title}</h2>
          <p className="mt-1 text-sm text-text-body">
            {product.location} | {product.duration}
          </p>
          <p className="mt-2 text-sm text-text-body">{product.summary}</p>
          <p className="mt-3 text-sm font-semibold">
            <CurrencyAmount amount={product.price} baseCurrency={product.currency} />
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              href={`/products/${product.id}`}
              className="rounded-full border border-border-strong px-4 py-2 text-sm font-semibold text-text-body"
            >
              View
            </Link>
            <button
              onClick={() => void removeItem(product.id)}
              className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-700"
            >
              Remove
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

