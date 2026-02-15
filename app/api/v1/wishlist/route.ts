import { z } from "zod";
import { requireUserId } from "@/modules/auth/guards";
import { fromUnknownError, fromZodError } from "@/modules/shared/problem";
import { ok, problemResponse } from "@/modules/shared/response";
import { getWishlistService, toggleWishlistService } from "@/modules/wishlist/wishlist.service";

const toggleSchema = z.object({
  productId: z.string().trim().min(1),
});

export async function GET(request: Request) {
  const instance = new URL(request.url).pathname;

  try {
    const userId = await requireUserId();
    const wishlist = await getWishlistService(userId);
    return ok(wishlist);
  } catch (error) {
    return problemResponse(fromUnknownError(error, instance));
  }
}

export async function POST(request: Request) {
  const instance = new URL(request.url).pathname;

  try {
    const userId = await requireUserId();
    const body = toggleSchema.parse(await request.json());
    const updated = await toggleWishlistService(userId, body.productId);
    return ok(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}
