import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit/memory-rate-limit";
import { logger } from "@/lib/observability/logger";
import { enhanceItineraryWithAI } from "@/modules/ai/itinerary-ai.service";
import { generateDeterministicItinerary } from "@/modules/itineraries/planner.service";
import { ApiError, fromUnknownError, fromZodError } from "@/modules/shared/problem";
import { itineraryRequestSchema } from "@/modules/shared/schemas";
import { ok, problemResponse } from "@/modules/shared/response";

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "anonymous";
  return `generate:${forwardedFor.split(",")[0].trim()}`;
}

export async function POST(request: Request) {
  const instance = new URL(request.url).pathname;

  try {
    const rateLimit = checkRateLimit({
      key: getClientKey(request),
      limit: 25,
      windowMs: 1000 * 60 * 15,
    });

    if (!rateLimit.allowed) {
      throw new ApiError(429, "RATE_LIMITED", "Too many requests. Please retry later.", {
        retryAfterSeconds: rateLimit.retryAfterSeconds,
      });
    }

    const body = itineraryRequestSchema.parse(await request.json());
    const deterministic = await generateDeterministicItinerary(body);
    const generated = await enhanceItineraryWithAI(body, deterministic);

    logger.info("Generated itinerary", {
      destinations: body.destinations,
      travelers: body.travelers,
      days: generated.days.length,
    });

    return ok({
      request: body,
      itinerary: generated,
      source: "hybrid",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}
