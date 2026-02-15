import {
  getWishlistByUser,
  removeWishlistProduct,
  toggleWishlistProduct,
} from "@/modules/wishlist/wishlist.repository";

export async function getWishlistService(userId: string) {
  const doc = await getWishlistByUser(userId);
  return {
    items: doc?.productIds ?? [],
    count: doc?.productIds?.length ?? 0,
  };
}

export async function toggleWishlistService(userId: string, productId: string) {
  const updated = await toggleWishlistProduct(userId, productId);
  return {
    items: updated.productIds,
    count: updated.productIds.length,
    isWishlisted: updated.isWishlisted,
  };
}

export async function removeWishlistService(userId: string, productId: string) {
  const items = await removeWishlistProduct(userId, productId);
  return {
    items,
    count: items.length,
  };
}
