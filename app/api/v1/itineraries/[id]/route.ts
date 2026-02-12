import { z } from "zod";
import { requireUserId } from "@/modules/auth/guards";
import {
  deleteItineraryService,
  getItineraryService,
  updateItineraryService,
} from "@/modules/itineraries/itinerary.service";
import { fromUnknownError, fromZodError } from "@/modules/shared/problem";
import { noContent, ok, problemResponse } from "@/modules/shared/response";

const patchSchema = z.object({
  notes: z.string().trim().max(3000).optional(),
  status: z.enum(["draft", "saved", "archived"]).optional(),
});

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const instance = new URL(request.url).pathname;

  try {
    const userId = await requireUserId();
    const { id } = await context.params;

    const itinerary = await getItineraryService(userId, id);
    return ok(itinerary);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const instance = new URL(request.url).pathname;

  try {
    const userId = await requireUserId();
    const { id } = await context.params;
    const body = patchSchema.parse(await request.json());

    const updated = await updateItineraryService({
      userId,
      itineraryId: id,
      notes: body.notes,
      status: body.status,
    });

    return ok(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const instance = new URL(request.url).pathname;

  try {
    const userId = await requireUserId();
    const { id } = await context.params;

    await deleteItineraryService(userId, id);
    return noContent();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}
