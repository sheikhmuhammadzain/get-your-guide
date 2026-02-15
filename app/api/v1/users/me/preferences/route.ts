import { z } from "zod";
import { requireUserId } from "@/modules/auth/guards";
import { fromUnknownError, fromZodError } from "@/modules/shared/problem";
import { userPreferencesPatchSchema } from "@/modules/shared/schemas";
import { ok, problemResponse } from "@/modules/shared/response";
import {
  getUserPreferencesService,
  updateUserPreferencesService,
} from "@/modules/users/user-preference.service";

export async function GET(request: Request) {
  const instance = new URL(request.url).pathname;

  try {
    const userId = await requireUserId();
    const preferences = await getUserPreferencesService(userId);
    return ok(preferences);
  } catch (error) {
    return problemResponse(fromUnknownError(error, instance));
  }
}

export async function PATCH(request: Request) {
  const instance = new URL(request.url).pathname;

  try {
    const userId = await requireUserId();
    const patch = userPreferencesPatchSchema.parse(await request.json());

    const updated = await updateUserPreferencesService(userId, {
      preferredBudget: patch.preferredBudget,
      preferredCities: patch.preferredCities,
      preferredInterests: patch.preferredInterests,
      savedMap: patch.savedMap,
    });

    return ok(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}
