import { z } from "zod";
import { listAttractionsService } from "@/modules/attractions/attraction.service";
import { attractionQuerySchema } from "@/modules/shared/schemas";
import { fromUnknownError, fromZodError } from "@/modules/shared/problem";
import { ok, problemResponse } from "@/modules/shared/response";

export async function GET(request: Request) {
  const instance = new URL(request.url).pathname;

  try {
    const url = new URL(request.url);
    const parsed = attractionQuerySchema.parse({
      city: url.searchParams.get("city") ?? undefined,
      tags: url.searchParams.get("tags") ?? undefined,
      budgetLevel: url.searchParams.get("budgetLevel") ?? undefined,
      cursor: url.searchParams.get("cursor") ?? undefined,
      limit: url.searchParams.get("limit") ?? 20,
    });

    const page = await listAttractionsService(parsed);
    return ok(page);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}
