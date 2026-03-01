"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import ProductList from "@/components/ProductList";
import { products } from "@/lib/data";

export default function SearchResultsClient({ initialQuery }: { initialQuery: string }) {
  const [input, setInput] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [resultCount, setResultCount] = useState(0);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    setInput(initialQuery);
    setDebouncedQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(input.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!formRef.current) return;
      if (!formRef.current.contains(event.target as Node)) {
        setFocused(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const current = params.get("q") ?? "";
    if (debouncedQuery === current) return;

    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }

    const next = params.toString();
    router.replace(next ? `/search?${next}` : "/search", { scroll: false });
  }, [debouncedQuery, router]);

  const suggestions = useMemo(() => {
    if (debouncedQuery.length < 2) return [];
    const q = debouncedQuery.toLowerCase();
    return products
      .filter((product) => {
        const haystack = `${product.title} ${product.location} ${product.category} ${product.summary}`.toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 8);
  }, [debouncedQuery]);

  return (
    <>
      <form
        ref={formRef}
        onSubmit={(event) => {
          event.preventDefault();
          setDebouncedQuery(input.trim());
        }}
        className="relative mb-6 flex items-center rounded-2xl border border-border-default bg-surface-base px-4 py-2.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/10"
      >
        <Search className="h-5 w-5 text-text-subtle" />
        <input
          type="search"
          value={input}
          onFocus={() => setFocused(true)}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Search destinations, tours, and experiences"
          className="h-10 flex-1 bg-transparent px-3 text-base outline-none"
        />
        <button
          type="submit"
          className="rounded-full bg-brand px-6 py-2 text-sm font-semibold text-white hover:bg-brand-hover"
        >
          Search
        </button>

        {focused && suggestions.length > 0 ? (
          <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 rounded-2xl border border-border-soft bg-background shadow-2xl">
            <ul className="max-h-80 overflow-y-auto py-2">
              {suggestions.map((product) => (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setInput(product.title);
                      setDebouncedQuery(product.title);
                      setFocused(false);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-surface-subtle"
                  >
                    <p className="text-sm font-semibold text-text-primary">{product.title}</p>
                    <p className="text-xs text-text-muted">
                      {product.location} | {product.category}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </form>

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-heading">
          {debouncedQuery ? `${resultCount} results for "${debouncedQuery}"` : "All experiences"}
        </h2>
      </div>

      <ProductList searchQuery={debouncedQuery} onCountChange={setResultCount} />
    </>
  );
}
