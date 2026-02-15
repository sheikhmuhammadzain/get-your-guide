import { z } from "zod";
import { getWeather } from "@/modules/realtime/weather.service";
import { weatherQuerySchema } from "@/modules/shared/schemas";
import { fromUnknownError, fromZodError } from "@/modules/shared/problem";
import { ok, problemResponse } from "@/modules/shared/response";

export async function GET(request: Request) {
  const instance = new URL(request.url).pathname;

  try {
    const url = new URL(request.url);
    const query = weatherQuerySchema.parse({
      city: url.searchParams.get("city"),
      hours: url.searchParams.get("hours") ?? 6,
    });

    const weather = await getWeather(query.city, query.hours);
    return ok(weather);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}
