import { z } from "zod";
import { getAssistantSessionHistory } from "@/modules/ai/chat.service";
import { requireUserId } from "@/modules/auth/guards";
import { ApiError, fromUnknownError, fromZodError } from "@/modules/shared/problem";
import { ok, problemResponse } from "@/modules/shared/response";

const historyQuerySchema = z.object({
  sessionId: z.string().trim().min(6).max(120),
});

export async function GET(request: Request) {
  const instance = new URL(request.url).pathname;

  try {
    const userId = await requireUserId();
    const url = new URL(request.url);
    const query = historyQuerySchema.parse({
      sessionId: url.searchParams.get("sessionId"),
    });

    const history = await getAssistantSessionHistory(userId, query.sessionId);
    return ok(history);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    if (error instanceof SyntaxError) {
      return problemResponse(fromUnknownError(new ApiError(400, "INVALID_JSON", "Malformed JSON body"), instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}
