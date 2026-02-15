export interface UserPreference {
  userId: string;
  preferredBudget?: "budget" | "standard" | "luxury";
  preferredCities?: string[];
  preferredInterests?: string[];
  savedMap?: {
    centerLat: number;
    centerLon: number;
    zoom: number;
    highlightedCities: string[];
  } | null;
}

export function normalizeUserPreferences(input: Partial<UserPreference>): UserPreference {
  return {
    userId: input.userId ?? "",
    preferredBudget: input.preferredBudget,
    preferredCities: input.preferredCities ?? [],
    preferredInterests: input.preferredInterests ?? [],
    savedMap: input.savedMap ?? null,
  };
}
