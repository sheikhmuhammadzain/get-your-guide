import { z } from "zod";
import { requireUserId } from "@/modules/auth/guards";
import { listItinerariesService } from "@/modules/itineraries/itinerary.service";
import { listUserOrdersService } from "@/modules/orders/order.service";
import { fromUnknownError, fromZodError } from "@/modules/shared/problem";
import { ok, problemResponse } from "@/modules/shared/response";

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(8),
});

export async function GET(request: Request) {
  const instance = new URL(request.url).pathname;

  try {
    const userId = await requireUserId();
    const url = new URL(request.url);
    const query = querySchema.parse({
      limit: url.searchParams.get("limit") ?? 8,
    });

    const [itineraries, orders] = await Promise.all([
      listItinerariesService(userId, undefined, query.limit),
      listUserOrdersService(userId, undefined, query.limit),
    ]);

    return ok({
      totals: {
        itineraries: itineraries.data.length,
        orders: orders.data.length,
      },
      itineraries: itineraries.data,
      orders: orders.data,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}
