import { logger } from "@/lib/observability/logger";
import {
  checkProductAvailability,
  getProductDetails,
  searchProducts,
  type CheckProductAvailabilityArgs,
  type GetProductDetailsArgs,
  type SearchProductsArgs,
} from "@/modules/ai/tools/product-tools";
import {
  getAttractionDetails,
  searchAttractions,
  type GetAttractionDetailsArgs,
  type SearchAttractionsArgs,
} from "@/modules/ai/tools/attraction-tools";
import {
  deleteItinerary,
  generateItinerary,
  getItinerary,
  listItineraries,
  saveItinerary,
  updateItinerary,
  type DeleteItineraryArgs,
  type GenerateItineraryArgs,
  type GetItineraryArgs,
  type ListItinerariesArgs,
  type SaveItineraryArgs,
  type UpdateItineraryArgs,
} from "@/modules/ai/tools/itinerary-tools";
import {
  getExchangeRate,
  getTurkeyTravelInfo,
  type GetExchangeRateArgs,
  type GetTurkeyTravelInfoArgs,
} from "@/modules/ai/tools/info-tools";
import {
  getWeatherTool,
  getTransportInfoTool,
  type GetWeatherArgs,
  type GetTransportInfoArgs,
} from "@/modules/ai/tools/realtime-tools";
import {
  getWishlist,
  toggleWishlist,
  getUserProfile,
  getUserPreferences,
  updateUserPreferences,
  listOrders,
  submitFeedback,
  type ToggleWishlistArgs,
  type UpdateUserPreferencesArgs,
  type ListOrdersArgs,
  type SubmitFeedbackArgs,
} from "@/modules/ai/tools/user-tools";

export interface ToolContext {
  userId?: string;
  sessionId: string;
}

export async function executeTool(name: string, rawArgs: unknown, ctx: ToolContext): Promise<string> {
  // Cast via unknown to avoid TS overlap errors — args come from LLM JSON, types are enforced at runtime by each handler
  const a = rawArgs as unknown;

  try {
    let result: unknown;

    switch (name) {
      case "search_products":
        result = await searchProducts(a as SearchProductsArgs);
        break;

      case "get_product_details":
        result = await getProductDetails(a as GetProductDetailsArgs);
        break;

      case "check_product_availability":
        result = await checkProductAvailability(a as CheckProductAvailabilityArgs);
        break;

      case "search_attractions":
        result = await searchAttractions(a as SearchAttractionsArgs);
        break;

      case "get_attraction_details":
        result = await getAttractionDetails(a as GetAttractionDetailsArgs);
        break;

      case "generate_itinerary":
        result = await generateItinerary(a as GenerateItineraryArgs);
        break;

      case "save_itinerary":
        result = await saveItinerary(a as SaveItineraryArgs, ctx.userId);
        break;

      case "list_itineraries":
        result = await listItineraries(a as ListItinerariesArgs, ctx.userId);
        break;

      case "get_itinerary":
        result = await getItinerary(a as GetItineraryArgs, ctx.userId);
        break;

      case "update_itinerary":
        result = await updateItinerary(a as UpdateItineraryArgs, ctx.userId);
        break;

      case "delete_itinerary":
        result = await deleteItinerary(a as DeleteItineraryArgs, ctx.userId);
        break;

      case "get_exchange_rate":
        result = await getExchangeRate(a as GetExchangeRateArgs);
        break;

      case "get_turkey_travel_info":
        result = await getTurkeyTravelInfo(a as GetTurkeyTravelInfoArgs);
        break;

      case "get_weather":
        result = await getWeatherTool(a as GetWeatherArgs);
        break;

      case "get_transport_info":
        result = await getTransportInfoTool(a as GetTransportInfoArgs);
        break;

      case "get_wishlist":
        result = await getWishlist(ctx.userId);
        break;

      case "toggle_wishlist":
        result = await toggleWishlist(a as ToggleWishlistArgs, ctx.userId);
        break;

      case "get_user_profile":
        result = await getUserProfile(ctx.userId);
        break;

      case "get_user_preferences":
        result = await getUserPreferences(ctx.userId);
        break;

      case "update_user_preferences":
        result = await updateUserPreferences(a as UpdateUserPreferencesArgs, ctx.userId);
        break;

      case "list_orders":
        result = await listOrders(a as ListOrdersArgs, ctx.userId);
        break;

      case "submit_feedback":
        result = await submitFeedback(a as SubmitFeedbackArgs, ctx.userId);
        break;

      default:
        result = { error: `Unknown tool: "${name}". This tool is not available.` };
    }

    return JSON.stringify(result);
  } catch (error) {
    logger.warn(`Tool "${name}" threw an unexpected error`, {
      error: error instanceof Error ? error.message : "unknown",
      rawArgs,
    });
    return JSON.stringify({
      error: `Tool "${name}" encountered an error: ${error instanceof Error ? error.message : "unknown error"}`,
    });
  }
}

export function getToolResultSummary(name: string, resultJson: string): string {
  try {
    const data = JSON.parse(resultJson) as Record<string, unknown>;

    if (data.error) return `Error: ${data.error}`;

    switch (name) {
      case "search_products": {
        const items = Array.isArray(data) ? data : [];
        return `Found ${items.length} tour${items.length !== 1 ? "s" : ""}`;
      }
      case "get_product_details":
        return `Loaded: ${(data.title as string) ?? "product"}`;
      case "check_product_availability": {
        const opts = Array.isArray(data.options) ? data.options : [];
        return `${opts.length} option${opts.length !== 1 ? "s" : ""} available on ${data.date as string}`;
      }
      case "search_attractions": {
        const items = Array.isArray(data) ? data : [];
        return `Found ${items.length} attraction${items.length !== 1 ? "s" : ""}`;
      }
      case "get_attraction_details":
        return `Loaded: ${(data.name as string) ?? "attraction"}`;
      case "generate_itinerary":
        return `Generated ${(data.dayCount as number) ?? 0}-day itinerary`;
      case "save_itinerary":
        return "Itinerary saved";
      case "list_itineraries": {
        const count = (data.count as number) ?? 0;
        return `${count} itinerary${count !== 1 ? "ies" : "y"} found`;
      }
      case "get_itinerary":
        return "Itinerary loaded";
      case "update_itinerary":
        return "Itinerary updated";
      case "delete_itinerary":
        return "Itinerary deleted";
      case "get_exchange_rate":
        return `Rate: ${(data.example as string) ?? ""}`;
      case "get_turkey_travel_info":
        return `Info on ${(data.topic as string) ?? "travel"}`;
      case "get_weather":
        return `Weather in ${(data.city as string) ?? "city"} retrieved`;
      case "get_transport_info":
        return `Transport options found`;
      case "get_wishlist": {
        const count = (data.count as number) ?? 0;
        return `${count} item${count !== 1 ? "s" : ""} in wishlist`;
      }
      case "toggle_wishlist":
        return (data.isWishlisted as boolean) ? "Added to wishlist" : "Removed from wishlist";
      case "get_user_profile":
        return `Profile loaded for ${(data.name as string) ?? "user"}`;
      case "get_user_preferences":
        return "Preferences loaded";
      case "update_user_preferences":
        return "Preferences updated";
      case "list_orders": {
        const count = (data.count as number) ?? 0;
        return `${count} order${count !== 1 ? "s" : ""} found`;
      }
      case "submit_feedback":
        return "Feedback submitted";
      default:
        return "Done";
    }
  } catch {
    return "Done";
  }
}
