"use client";

import { FormEvent, useState } from "react";
import type { BudgetLevel, InterestTag } from "@/types/travel";

const CITY_OPTIONS = ["istanbul", "cappadocia", "ephesus", "pamukkale", "antalya", "bodrum"] as const;
const INTEREST_OPTIONS: InterestTag[] = ["culture", "history", "food", "nature", "adventure", "relaxation"];

interface UserPreferencesCardProps {
  initial: {
    preferredBudget: BudgetLevel;
    preferredCities: string[];
    preferredInterests: InterestTag[];
  };
}

export default function UserPreferencesCard({ initial }: UserPreferencesCardProps) {
  const [preferredBudget, setPreferredBudget] = useState<BudgetLevel>(initial.preferredBudget);
  const [preferredCities, setPreferredCities] = useState<string[]>(initial.preferredCities);
  const [preferredInterests, setPreferredInterests] = useState<InterestTag[]>(initial.preferredInterests);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function toggleCity(city: string) {
    setPreferredCities((prev) =>
      prev.includes(city) ? prev.filter((item) => item !== city) : [...prev, city],
    );
  }

  function toggleInterest(tag: InterestTag) {
    setPreferredInterests((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/v1/users/me/preferences", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          preferredBudget,
          preferredCities,
          preferredInterests,
        }),
      });

      if (!response.ok) {
        const body = (await response.json()) as { detail?: string };
        throw new Error(body.detail ?? "Failed to save preferences");
      }

      setMessage("Preferences saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="mb-8 rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold">Travel Preferences</h2>

      <label className="mb-4 block">
        <span className="mb-1 block text-xs font-semibold uppercase text-gray-600">Budget preference</span>
        <select
          value={preferredBudget}
          onChange={(event) => setPreferredBudget(event.target.value as BudgetLevel)}
          className="h-10 w-full rounded-lg border border-gray-300 px-3 outline-none focus:border-blue-600"
        >
          <option value="budget">Budget</option>
          <option value="standard">Standard</option>
          <option value="luxury">Luxury</option>
        </select>
      </label>

      <div className="mb-4">
        <p className="mb-2 text-xs font-semibold uppercase text-gray-600">Preferred cities</p>
        <div className="flex flex-wrap gap-2">
          {CITY_OPTIONS.map((city) => {
            const active = preferredCities.includes(city);
            return (
              <button
                key={city}
                type="button"
                onClick={() => toggleCity(city)}
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  active ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-700"
                }`}
              >
                {city}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-xs font-semibold uppercase text-gray-600">Interest tags</p>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((tag) => {
            const active = preferredInterests.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleInterest(tag)}
                className={`rounded-full border px-3 py-1.5 text-sm ${
                  active ? "border-blue-600 bg-blue-600 text-white" : "border-gray-300 bg-white text-gray-700"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[#0071eb] px-5 py-2 font-semibold text-white disabled:opacity-70"
        >
          {saving ? "Saving..." : "Save preferences"}
        </button>
        {message ? <p className="text-sm text-gray-700">{message}</p> : null}
      </div>
    </form>
  );
}
