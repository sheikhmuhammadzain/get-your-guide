import { z } from "zod";
import { requireUserId } from "@/modules/auth/guards";
import {
  createItineraryService,
  listItinerariesService,
} from "@/modules/itineraries/itinerary.service";
import { itineraryQuerySchema, itinerarySaveSchema } from "@/modules/shared/schemas";
import { fromUnknownError, fromZodError } from "@/modules/shared/problem";
import { created, ok, problemResponse } from "@/modules/shared/response";

export async function GET(request: Request) {
  const instance = new URL(request.url).pathname;

  try {
    const userId = await requireUserId();
    const url = new URL(request.url);
    const query = itineraryQuerySchema.parse({
      cursor: url.searchParams.get("cursor") ?? undefined,
      limit: url.searchParams.get("limit") ?? 10,
    });

    const page = await listItinerariesService(userId, query.cursor, query.limit);
    return ok(page);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}

export async function POST(request: Request) {
  const instance = new URL(request.url).pathname;

  try {
    const userId = await requireUserId();
    const body = itinerarySaveSchema.parse(await request.json());

    const createdItinerary = await createItineraryService({
      userId,
      requestSnapshot: body.requestSnapshot,
      generatedPlan: body.generatedPlan,
      notes: body.notes,
      status: body.status,
    });

    return created(createdItinerary, `/api/v1/itineraries/${createdItinerary.id}`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}
