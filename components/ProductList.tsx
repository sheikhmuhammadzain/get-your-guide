"use client";

import { useEffect, useMemo, useState } from "react";
import { products } from "@/lib/data";
import ProductCard from "./ProductCard";

interface WishlistResponse {
  items: string[];
  count: number;
}

export default function ProductList({
  searchQuery = "",
  onCountChange,
}: {
  searchQuery?: string;
  onCountChange?: (count: number) => void;
}) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadWishlist() {
      try {
        const response = await fetch("/api/v1/wishlist", { cache: "no-store" });
        if (!response.ok) {
          if (!cancelled) setWishlistIds([]);
          return;
        }

        const body = (await response.json()) as WishlistResponse;
        if (!cancelled) {
          setWishlistIds(body.items ?? []);
          window.dispatchEvent(new CustomEvent("wishlist:changed", { detail: { items: body.items ?? [] } }));
        }
      } catch {
        if (!cancelled) setWishlistIds([]);
      }
    }

    void loadWishlist();
    return () => {
      cancelled = true;
    };
  }, []);

  const wishlistSet = useMemo(() => new Set(wishlistIds), [wishlistIds]);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredProducts = useMemo(() => {
    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) => {
      const haystack = `${product.title} ${product.location} ${product.category} ${product.summary}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [normalizedQuery]);

  useEffect(() => {
    onCountChange?.(filteredProducts.length);
  }, [filteredProducts.length, onCountChange]);

  async function toggleWishlist(productId: string) {
    try {
      const response = await fetch("/api/v1/wishlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (response.status === 401) {
        window.location.href = "/auth/signin";
        return;
      }

      if (!response.ok) {
        return;
      }

      const body = (await response.json()) as WishlistResponse;
      setWishlistIds(body.items ?? []);
      window.dispatchEvent(new CustomEvent("wishlist:changed", { detail: { items: body.items ?? [] } }));
    } catch {
      // non-blocking UI action
    }
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="rounded-2xl border border-border-default bg-surface-muted p-6">
        <p className="text-lg font-semibold text-text-heading">No matching experiences found</p>
        <p className="mt-2 text-sm text-text-body">Try another destination keyword like Istanbul, Cappadocia, or Ephesus.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isWishlisted={wishlistSet.has(product.id)}
          onToggleWishlist={toggleWishlist}
        />
      ))}
    </div>
  );
}
