import { requireUserId } from "@/modules/auth/guards";
import { fromUnknownError } from "@/modules/shared/problem";
import { ok, problemResponse } from "@/modules/shared/response";
import { removeWishlistService } from "@/modules/wishlist/wishlist.service";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ productId: string }> },
) {
  const instance = new URL(request.url).pathname;

  try {
    const userId = await requireUserId();
    const { productId } = await context.params;
    const updated = await removeWishlistService(userId, productId);
    return ok(updated);
  } catch (error) {
    return problemResponse(fromUnknownError(error, instance));
  }
}
