import { z } from "zod";
import { getCurrencyRate } from "@/modules/realtime/currency.service";
import { currencyQuerySchema } from "@/modules/shared/schemas";
import { fromUnknownError, fromZodError } from "@/modules/shared/problem";
import { ok, problemResponse } from "@/modules/shared/response";

export async function GET(request: Request) {
  const instance = new URL(request.url).pathname;

  try {
    const url = new URL(request.url);
    const query = currencyQuerySchema.parse({
      base: url.searchParams.get("base") ?? "USD",
      target: url.searchParams.get("target") ?? "TRY",
    });

    const currency = await getCurrencyRate(query.base, query.target);
    return ok(currency);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}
