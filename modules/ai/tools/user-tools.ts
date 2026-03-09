import type { BudgetLevel } from "@/types/travel";
import { getWishlistService, toggleWishlistService } from "@/modules/wishlist/wishlist.service";
import { getUserService } from "@/modules/users/user.service";
import {
  getUserPreferencesService,
  updateUserPreferencesService,
} from "@/modules/users/user-preference.service";
import { listUserOrdersService } from "@/modules/orders/order.service";
import { createFeedbackService } from "@/modules/feedback/feedback.service";

export interface GetWishlistArgs { /* no params */ }
export interface ToggleWishlistArgs { product_id: string }
export interface GetUserProfileArgs { /* no params */ }
export interface GetUserPreferencesArgs { /* no params */ }
export interface UpdateUserPreferencesArgs {
  preferred_budget?: BudgetLevel;
  preferred_cities?: string[];
  preferred_interests?: string[];
}
export interface ListOrdersArgs { limit?: number; cursor?: string }
export interface SubmitFeedbackArgs {
  category: "ux" | "itinerary" | "assistant" | "realtime" | "other";
  message: string;
  rating?: number;
}

const VALID_BUDGETS: BudgetLevel[] = ["budget", "standard", "luxury"];
const VALID_FEEDBACK_CATEGORIES = ["ux", "itinerary", "assistant", "realtime", "other"];

export async function getWishlist(userId: string | undefined): Promise<unknown> {
  if (!userId) return { error: "You must be signed in to view your wishlist." };
  try {
    const result = await getWishlistService(userId);
    return { items: result.items, count: result.count };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Wishlist lookup failed." };
  }
}

export async function toggleWishlist(args: ToggleWishlistArgs, userId: string | undefined): Promise<unknown> {
  if (!userId) return { error: "You must be signed in to manage your wishlist." };
  if (!args.product_id) return { error: "product_id is required." };
  try {
    const result = await toggleWishlistService(userId, args.product_id);
    return {
      isWishlisted: result.isWishlisted,
      count: result.count,
      message: result.isWishlisted ? "Added to wishlist." : "Removed from wishlist.",
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Wishlist update failed." };
  }
}

export async function getUserProfile(userId: string | undefined): Promise<unknown> {
  if (!userId) return { error: "You must be signed in to view your profile." };
  try {
    const user = await getUserService(userId);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? null,
      emailVerified: user.emailVerified !== null,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Profile lookup failed." };
  }
}

export async function getUserPreferences(userId: string | undefined): Promise<unknown> {
  if (!userId) return { error: "You must be signed in to view your preferences." };
  try {
    const prefs = await getUserPreferencesService(userId);
    return {
      preferredBudget: prefs.preferredBudget,
      preferredCities: prefs.preferredCities,
      preferredInterests: prefs.preferredInterests,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Preferences lookup failed." };
  }
}

export async function updateUserPreferences(
  args: UpdateUserPreferencesArgs,
  userId: string | undefined,
): Promise<unknown> {
  if (!userId) return { error: "You must be signed in to update your preferences." };

  if (args.preferred_budget && !VALID_BUDGETS.includes(args.preferred_budget)) {
    return { error: `preferred_budget must be one of: ${VALID_BUDGETS.join(", ")}` };
  }

  try {
    const updated = await updateUserPreferencesService(userId, {
      preferredBudget: args.preferred_budget,
      preferredCities: args.preferred_cities,
      preferredInterests: args.preferred_interests,
    });
    return {
      preferredBudget: updated.preferredBudget,
      preferredCities: updated.preferredCities,
      preferredInterests: updated.preferredInterests,
      message: "Preferences updated successfully.",
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Preferences update failed." };
  }
}

export async function listOrders(args: ListOrdersArgs, userId: string | undefined): Promise<unknown> {
  if (!userId) return { error: "You must be signed in to view your orders." };
  const limit = Math.min(Math.max(args.limit ?? 10, 1), 20);
  try {
    const page = await listUserOrdersService(userId, args.cursor, limit);
    return {
      orders: page.data.map((o) => ({
        id: o.id,
        orderCode: o.orderCode,
        status: o.status,
        total: o.total,
        currency: o.currency,
        items: o.items.map((i) => ({ title: i.title, quantity: i.quantity, lineTotal: i.lineTotal })),
        createdAt: o.createdAt,
      })),
      nextCursor: page.nextCursor ?? null,
      count: page.data.length,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Orders lookup failed." };
  }
}

export async function submitFeedback(args: SubmitFeedbackArgs, userId: string | undefined): Promise<unknown> {
  if (!VALID_FEEDBACK_CATEGORIES.includes(args.category)) {
    return { error: `category must be one of: ${VALID_FEEDBACK_CATEGORIES.join(", ")}` };
  }
  if (!args.message?.trim()) return { error: "message is required." };
  if (args.rating !== undefined && (args.rating < 1 || args.rating > 5)) {
    return { error: "rating must be between 1 and 5." };
  }

  try {
    const result = await createFeedbackService({
      userId,
      category: args.category,
      message: args.message.trim(),
      rating: args.rating,
    });
    return { id: result.id, status: result.status, message: "Feedback submitted. Thank you!" };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Feedback submission failed." };
  }
}
