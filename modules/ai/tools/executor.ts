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

export interface ToolContext {
  userId?: string;
  sessionId: string;
}

export async function executeTool(name: string, rawArgs: unknown, ctx: ToolContext): Promise<string> {
  const args = rawArgs as Record<string, unknown>;

  try {
    let result: unknown;

    switch (name) {
      case "search_products":
        result = await searchProducts(args as SearchProductsArgs);
        break;

      case "get_product_details":
        result = await getProductDetails(args as GetProductDetailsArgs);
        break;

      case "check_product_availability":
        result = await checkProductAvailability(args as CheckProductAvailabilityArgs);
        break;

      case "search_attractions":
        result = await searchAttractions(args as SearchAttractionsArgs);
        break;

      case "get_attraction_details":
        result = await getAttractionDetails(args as GetAttractionDetailsArgs);
        break;

      case "generate_itinerary":
        result = await generateItinerary(args as GenerateItineraryArgs);
        break;

      case "save_itinerary":
        result = await saveItinerary(args as SaveItineraryArgs, ctx.userId);
        break;

      case "list_itineraries":
        result = await listItineraries(args as ListItinerariesArgs, ctx.userId);
        break;

      case "get_itinerary":
        result = await getItinerary(args as GetItineraryArgs, ctx.userId);
        break;

      case "update_itinerary":
        result = await updateItinerary(args as UpdateItineraryArgs, ctx.userId);
        break;

      case "delete_itinerary":
        result = await deleteItinerary(args as DeleteItineraryArgs, ctx.userId);
        break;

      case "get_exchange_rate":
        result = await getExchangeRate(args as GetExchangeRateArgs);
        break;

      case "get_turkey_travel_info":
        result = await getTurkeyTravelInfo(args as GetTurkeyTravelInfoArgs);
        break;

      default:
        result = { error: `Unknown tool: "${name}". This tool is not available.` };
    }

    return JSON.stringify(result);
  } catch (error) {
    logger.warn(`Tool "${name}" threw an unexpected error`, {
      error: error instanceof Error ? error.message : "unknown",
      args,
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
      default:
        return "Done";
    }
  } catch {
    return "Done";
  }
}
