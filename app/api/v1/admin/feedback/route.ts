import { z } from "zod";
import { listAdminFeedbackService } from "@/modules/admin/admin.service";
import { requireAdmin } from "@/modules/auth/guards";
import { itineraryQuerySchema } from "@/modules/shared/schemas";
import { fromUnknownError, fromZodError } from "@/modules/shared/problem";
import { ok, problemResponse } from "@/modules/shared/response";

export async function GET(request: Request) {
  const instance = new URL(request.url).pathname;

  try {
    await requireAdmin();
    const url = new URL(request.url);
    const query = itineraryQuerySchema.parse({
      cursor: url.searchParams.get("cursor") ?? undefined,
      limit: url.searchParams.get("limit") ?? 20,
    });

    const feedback = await listAdminFeedbackService(query.cursor, query.limit);
    return ok(feedback);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}
