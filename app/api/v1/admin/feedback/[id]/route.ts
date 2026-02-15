import { z } from "zod";
import { requireAdmin } from "@/modules/auth/guards";
import { deleteFeedbackService, updateFeedbackService } from "@/modules/feedback/feedback.service";
import { fromUnknownError, fromZodError } from "@/modules/shared/problem";
import { noContent, ok, problemResponse } from "@/modules/shared/response";

const patchSchema = z.object({
  status: z.enum(["new", "reviewed"]).optional(),
  message: z.string().trim().min(10).max(2000).optional(),
  rating: z.number().int().min(1).max(5).optional(),
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
    const updated = await updateFeedbackService(id, body);
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
    await deleteFeedbackService(id);
    return noContent();
  } catch (error) {
    return problemResponse(fromUnknownError(error, instance));
  }
}
