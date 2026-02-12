import { z } from "zod";
import { requireUserId } from "@/modules/auth/guards";
import { listUserOrdersService } from "@/modules/orders/order.service";
import { itineraryQuerySchema } from "@/modules/shared/schemas";
import { fromUnknownError, fromZodError } from "@/modules/shared/problem";
import { ok, problemResponse } from "@/modules/shared/response";

export async function GET(request: Request) {
  const instance = new URL(request.url).pathname;

  try {
    const userId = await requireUserId();
    const url = new URL(request.url);
    const query = itineraryQuerySchema.parse({
      cursor: url.searchParams.get("cursor") ?? undefined,
      limit: url.searchParams.get("limit") ?? 20,
    });

    const page = await listUserOrdersService(userId, query.cursor, query.limit);
    return ok(page);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}
