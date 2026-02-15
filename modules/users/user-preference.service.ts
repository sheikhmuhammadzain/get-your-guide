import {
  getUserPreferences,
  upsertUserPreferences,
} from "@/modules/users/user-preference.repository";

function mapPreference(doc: {
  _id: { toString(): string };
  userId: { toString(): string };
  preferredBudget?: "budget" | "standard" | "luxury";
  preferredCities?: string[];
  preferredInterests?: string[];
  savedMap?: {
    centerLat: number;
    centerLon: number;
    zoom: number;
    highlightedCities: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    preferredBudget: doc.preferredBudget ?? "standard",
    preferredCities: doc.preferredCities ?? [],
    preferredInterests: doc.preferredInterests ?? [],
    savedMap: doc.savedMap ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function getUserPreferencesService(userId: string) {
  const doc = await getUserPreferences(userId);
  if (!doc) {
    return {
      id: null,
      userId,
      preferredBudget: "standard" as const,
      preferredCities: [],
      preferredInterests: [],
      savedMap: null,
      createdAt: null,
      updatedAt: null,
    };
  }
  return mapPreference(doc);
}

export async function updateUserPreferencesService(
  userId: string,
  patch: {
    preferredBudget?: "budget" | "standard" | "luxury";
    preferredCities?: string[];
    preferredInterests?: string[];
    savedMap?: {
      centerLat: number;
      centerLon: number;
      zoom: number;
      highlightedCities: string[];
    };
  },
) {
  const updated = await upsertUserPreferences(userId, patch);
  return mapPreference(updated);
}
