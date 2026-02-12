export interface UserPreference {
  userId: string;
  preferredBudget?: "budget" | "standard" | "luxury";
  preferredCities?: string[];
  preferredInterests?: string[];
}

export function normalizeUserPreferences(input: Partial<UserPreference>): UserPreference {
  return {
    userId: input.userId ?? "",
    preferredBudget: input.preferredBudget,
    preferredCities: input.preferredCities ?? [],
    preferredInterests: input.preferredInterests ?? [],
  };
}
