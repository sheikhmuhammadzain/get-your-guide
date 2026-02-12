import { z } from "zod";
import { listAdminOrdersService } from "@/modules/admin/admin.service";
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

    const orders = await listAdminOrdersService(query.cursor, query.limit);
    return ok(orders);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}
