import { z } from "zod";
import { getProductById } from "@/lib/data";
import { getAvailabilityService } from "@/modules/products/product-option.service";
import { ApiError, fromUnknownError, fromZodError } from "@/modules/shared/problem";
import { ok, problemResponse } from "@/modules/shared/response";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD"),
  travelers: z.coerce.number().int().min(1).max(20).default(1),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const instance = new URL(request.url).pathname;

  try {
    const { id } = await params;
    const product = getProductById(id);
    if (!product) {
      throw new ApiError(404, "NOT_FOUND", "Product not found");
    }

    const url = new URL(request.url);
    const query = querySchema.parse({
      date: url.searchParams.get("date") ?? "",
      travelers: url.searchParams.get("travelers") ?? 1,
    });

    const options = await getAvailabilityService(id, query.date, query.travelers);
    return ok({ date: query.date, travelers: query.travelers, options });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}
