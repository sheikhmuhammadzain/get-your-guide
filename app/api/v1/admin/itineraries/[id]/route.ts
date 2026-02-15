import { z } from "zod";
import { requireAdmin } from "@/modules/auth/guards";
import {
  deleteAdminItineraryService,
  updateAdminItineraryService,
} from "@/modules/itineraries/itinerary.service";
import { fromUnknownError, fromZodError } from "@/modules/shared/problem";
import { noContent, ok, problemResponse } from "@/modules/shared/response";

const patchSchema = z.object({
  status: z.enum(["draft", "saved", "archived"]).optional(),
  notes: z.string().trim().max(3000).optional(),
});

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const instance = new URL(request.url).pathname;

  try {
    await requireAdmin();
    const body = patchSchema.parse(await request.json());
    const { id } = await context.params;
    const updated = await updateAdminItineraryService({
      itineraryId: id,
      status: body.status,
      notes: body.notes,
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
    await requireAdmin();
    const { id } = await context.params;
    await deleteAdminItineraryService(id);
    return noContent();
  } catch (error) {
    return problemResponse(fromUnknownError(error, instance));
  }
}
