import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit/memory-rate-limit";
import { chatWithAssistant } from "@/modules/ai/chat.service";
import { requireUserId } from "@/modules/auth/guards";
import { ApiError, fromUnknownError, fromZodError } from "@/modules/shared/problem";
import { chatRequestSchema } from "@/modules/shared/schemas";
import { ok, problemResponse } from "@/modules/shared/response";

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "anonymous";
  return `chat:${forwardedFor.split(",")[0].trim()}`;
}

export async function POST(request: Request) {
  const instance = new URL(request.url).pathname;

  try {
    const userId = await requireUserId();

    const rateLimit = checkRateLimit({
      key: getClientKey(request),
      limit: 60,
      windowMs: 1000 * 60 * 15,
    });

    if (!rateLimit.allowed) {
      throw new ApiError(429, "RATE_LIMITED", "Too many chat messages. Please retry later.", {
        retryAfterSeconds: rateLimit.retryAfterSeconds,
      });
    }

    const body = chatRequestSchema.parse(await request.json());
    const response = await chatWithAssistant({
      userId,
      sessionId: body.sessionId,
      message: body.message,
      itineraryId: body.itineraryId,
    });

    return ok(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}
