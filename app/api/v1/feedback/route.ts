import { z } from "zod";
import { getAuthSession } from "@/lib/auth/get-session";
import { requireAdmin } from "@/modules/auth/guards";
import { createFeedbackService, listFeedbackService } from "@/modules/feedback/feedback.service";
import { fromUnknownError, fromZodError } from "@/modules/shared/problem";
import { feedbackCreateSchema } from "@/modules/shared/schemas";
import { created, ok, problemResponse } from "@/modules/shared/response";

const listQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export async function GET(request: Request) {
  const instance = new URL(request.url).pathname;

  try {
    await requireAdmin();
    const url = new URL(request.url);
    const query = listQuerySchema.parse({
      cursor: url.searchParams.get("cursor") ?? undefined,
      limit: url.searchParams.get("limit") ?? 20,
    });

    const page = await listFeedbackService(query.cursor, query.limit);
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
    const session = await getAuthSession();
    const body = feedbackCreateSchema.parse(await request.json());

    const feedback = await createFeedbackService({
      userId: session?.user?.id,
      email: body.email ?? session?.user?.email ?? undefined,
      category: body.category,
      message: body.message,
      rating: body.rating,
    });

    return created(feedback, `/api/v1/feedback/${feedback.id}`);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}
