"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Users,
  ShoppingCart,
  CheckCircle2,
  ChevronDown,
  AlertCircle,
  ChevronUp,
} from "lucide-react";
import { useCartState } from "@/components/commerce/cart-client";
import CurrencyAmount from "@/components/CurrencyAmount";

interface AvailableOption {
  id: string;
  name: string;
  description: string;
  openingHoursText: string;
  pricePerPerson: number;
  currency: string;
  cancellationHours: number;
  maxGroupSize: number;
  timeSlots: string[];
  cancellationDeadline: string;
}

interface AvailabilityResponse {
  date: string;
  travelers: number;
  options: AvailableOption[];
}

interface ProductAvailabilityPanelProps {
  productId: string;
  basePrice: number;
  baseCurrency: string;
}

export default function ProductAvailabilityPanel({
  productId,
  basePrice,
  baseCurrency,
}: ProductAvailabilityPanelProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [travelers, setTravelers] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AvailabilityResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedOptions, setExpandedOptions] = useState<Set<string>>(new Set());
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { addItem } = useCartState();
  const router = useRouter();

  async function checkAvailability() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        `/api/v1/products/${productId}/availability?date=${date}&travelers=${travelers}`,
      );
      const body = (await res.json()) as AvailabilityResponse & { detail?: string };
      if (!res.ok) {
        throw new Error(body.detail ?? "Failed to check availability");
      }
      setResult(body);
      // auto-expand all returned options
      setExpandedOptions(new Set(body.options.map((o) => o.id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function toggleExpand(id: string) {
    setExpandedOptions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAddToCart(optionId: string) {
    addItem(productId, travelers);
    setAddedIds((prev) => new Set(prev).add(optionId));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(optionId);
        return next;
      });
    }, 2000);
  }

  function handleBookNow() {
    addItem(productId, travelers);
    router.push("/checkout");
  }

  const selectedDateLabel = date
    ? new Date(date + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Select date";

  return (
    <div className="space-y-6">
      {/* ── Sticky Booking Sidebar ─────────────────────── */}
      <div className="rounded-2xl border border-border-soft bg-surface-base p-5 shadow-sm">
        <p className="mb-4 text-sm font-bold text-text-primary">
          Check availability
        </p>

        {/* Traveler count */}
        <div className="mb-3">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Travelers
          </label>
          <div className="relative">
            <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
            <select
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="h-11 w-full appearance-none rounded-lg border border-border-default bg-surface-base pl-9 pr-8 text-sm font-medium text-text-body outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  Adult x{n}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
          </div>
        </div>

        {/* Date picker */}
        <div className="mb-4">
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Date
          </label>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 w-full rounded-lg border border-border-default bg-surface-base pl-9 pr-3 text-sm font-medium text-text-body outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
            />
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={checkAvailability}
          disabled={loading || !date}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand text-sm font-bold text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : null}
          {loading ? "Checking…" : "Check Availability"}
        </button>

        {/* Free cancellation notice */}
        <div className="mt-3 flex items-start gap-2 text-xs text-text-muted">
          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
          <span>
            <span className="font-semibold text-text-body">Free cancellation</span> — cancel up to 24 hours in advance for a full refund
          </span>
        </div>
      </div>

      {/* ── Error ──────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800/40 dark:bg-red-950/30 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Availability Results ───────────────────────── */}
      {result && (
        <div>
          <h3 className="mb-3 text-base font-bold text-text-primary">
            {result.options.length === 0
              ? "No availability"
              : `Choose from ${result.options.length} available option${result.options.length === 1 ? "" : "s"}`}
          </h3>

          {result.options.length === 0 ? (
            <div className="rounded-2xl border border-border-soft bg-surface-subtle p-6 text-center">
              <p className="text-sm text-text-muted">
                No options are available on {selectedDateLabel} for {travelers}{" "}
                {travelers === 1 ? "traveler" : "travelers"}. Try a different date.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {result.options.map((opt) => {
                const expanded = expandedOptions.has(opt.id);
                const added = addedIds.has(opt.id);
                const totalPrice = opt.pricePerPerson * travelers;

                return (
                  <article
                    key={opt.id}
                    className="overflow-hidden rounded-2xl border border-border-soft bg-surface-base"
                  >
                    {/* Option header — always visible */}
                    <button
                      type="button"
                      onClick={() => toggleExpand(opt.id)}
                      className="flex w-full items-start justify-between gap-3 px-5 py-4 text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-text-primary leading-snug">
                          {opt.name}
                        </p>
                        <p className="mt-1 text-[13px] leading-relaxed text-text-muted line-clamp-2">
                          {opt.description}
                        </p>
                      </div>
                      {expanded ? (
                        <ChevronUp className="mt-0.5 h-4 w-4 shrink-0 text-text-subtle" />
                      ) : (
                        <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-text-subtle" />
                      )}
                    </button>

                    {/* Expanded content */}
                    {expanded && (
                      <div className="border-t border-border-subtle px-5 pb-5 pt-4">
                        {/* Hours */}
                        <div className="mb-3">
                          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                            Opening / Operating hours
                          </p>
                          <p className="text-sm font-medium text-text-body">
                            {selectedDateLabel}
                          </p>
                          <p className="text-sm text-text-body">{opt.openingHoursText}</p>
                        </div>

                        {/* Cancellation */}
                        <div className="mb-4 flex items-start gap-2 rounded-lg bg-surface-subtle px-3 py-2.5 text-xs">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          <span className="text-text-body">
                            Cancel before {opt.cancellationDeadline} for a full refund
                          </span>
                        </div>

                        {/* Price row */}
                        <div className="mb-4 border-t border-border-subtle pt-3">
                          <p className="text-xl font-bold text-text-heading">
                            <CurrencyAmount
                              amount={totalPrice}
                              baseCurrency={opt.currency}
                            />
                          </p>
                          <p className="text-xs text-text-muted">
                            {travelers} Adult{travelers > 1 ? "s" : ""} ×{" "}
                            <CurrencyAmount
                              amount={opt.pricePerPerson}
                              baseCurrency={opt.currency}
                            />{" "}
                            · All taxes and fees included
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleBookNow}
                            className="flex-1 rounded-lg border border-border-strong px-4 py-2.5 text-sm font-semibold text-text-body transition-colors hover:bg-surface-subtle"
                          >
                            Book now
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddToCart(opt.id)}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
                          >
                            {added ? (
                              <>
                                <CheckCircle2 className="h-4 w-4" />
                                Added
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="h-4 w-4" />
                                Add to cart
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Default price hint (before search) ────────── */}
      {!result && !loading && (
        <div className="rounded-2xl border border-border-soft bg-surface-base p-4 text-center">
          <p className="text-xs text-text-muted">
            From{" "}
            <span className="font-bold text-text-primary">
              <CurrencyAmount amount={basePrice} baseCurrency={baseCurrency} />
            </span>{" "}
            per person · Select a date to see all options
          </p>
        </div>
      )}
    </div>
  );
}
