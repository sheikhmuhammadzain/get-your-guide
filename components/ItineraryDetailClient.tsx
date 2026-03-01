"use client";

import Link from "next/link";
import { Save, Trash2, ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import type { GeneratedItinerary } from "@/types/travel";

type ItineraryStatus = "draft" | "saved" | "archived";

interface ItineraryRecord {
  id: string;
  notes?: string;
  status: ItineraryStatus;
  version: number;
  updatedAt: string | Date;
}

interface ItineraryDetailClientProps {
  itinerary: ItineraryRecord;
  generatedPlan: GeneratedItinerary | null;
}

const STATUS_LABELS: Record<ItineraryStatus, string> = {
  draft: "Draft",
  saved: "Saved",
  archived: "Archived",
};

export default function ItineraryDetailClient({ itinerary, generatedPlan }: ItineraryDetailClientProps) {
  const [notes, setNotes] = useState(itinerary.notes ?? "");
  const [status, setStatus] = useState<ItineraryStatus>(itinerary.status);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const dayCount = useMemo(() => generatedPlan?.days.length ?? 0, [generatedPlan]);

  async function updateItinerary() {
    setIsSaving(true);
    setFeedback(null);

    try {
      const response = await fetch(`/api/v1/itineraries/${itinerary.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ notes, status }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { detail?: string };
        throw new Error(body.detail ?? "Failed to update itinerary");
      }

      setFeedback("✓ Itinerary updated successfully.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Failed to update itinerary");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteItinerary() {
    const approved = window.confirm("Delete this itinerary permanently?");
    if (!approved) return;

    setIsDeleting(true);
    setFeedback(null);

    try {
      const response = await fetch(`/api/v1/itineraries/${itinerary.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const body = (await response.json()) as { detail?: string };
        throw new Error(body.detail ?? "Failed to delete itinerary");
      }

      window.location.href = "/dashboard";
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Failed to delete itinerary");
      setIsDeleting(false);
    }
  }

  return (
    <section className="space-y-5">
      {/* Meta bar */}
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border-soft bg-surface-subtle px-5 py-3 text-sm text-text-body">
        <p>
          Status:{" "}
          <span className={`font-semibold ${status === "saved" ? "text-green-600" : status === "archived" ? "text-text-muted" : "text-amber-500"}`}>
            {STATUS_LABELS[status]}
          </span>
        </p>
        <div className="h-4 w-px bg-border-default" />
        <p>
          Version: <span className="font-semibold">{itinerary.version}</span>
        </p>
        <div className="h-4 w-px bg-border-default" />
        <p>
          Days: <span className="font-semibold">{dayCount}</span>
        </p>
      </div>

      {/* Edit form */}
      <div className="rounded-2xl border border-border-soft bg-surface-base p-5">
        <h2 className="mb-4 text-lg font-bold text-text-primary">Notes & Status</h2>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-text-subtle">
              Status
            </span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as ItineraryStatus)}
              className="h-10 w-full rounded-lg border border-border-default bg-surface-base px-3 text-sm text-text-body outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-colors"
            >
              <option value="draft">Draft</option>
              <option value="saved">Saved</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-text-subtle">
              Notes
            </span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border-default bg-surface-base p-3 text-sm text-text-body outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-colors"
              placeholder="Add your travel notes, reminders, or packing list..."
            />
          </label>
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            disabled={isSaving}
            onClick={() => void updateItinerary()}
            className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>

          <button
            disabled={isDeleting}
            onClick={() => void deleteItinerary()}
            className="inline-flex items-center gap-2 rounded-lg border border-border-danger px-5 py-2.5 text-sm font-semibold text-text-danger transition-colors hover:bg-surface-danger-soft disabled:opacity-60"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-border-default px-5 py-2.5 text-sm font-medium text-text-body transition-colors hover:bg-surface-subtle"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>

        {feedback && (
          <p className={`mt-4 text-sm ${feedback.startsWith("✓") ? "text-green-600" : "text-text-danger"}`}>
            {feedback}
          </p>
        )}
      </div>
    </section>
  );
}
