import { getServerEnv } from "@/lib/env/server";
import { getCachedPayload, setCachedPayload } from "@/modules/realtime/cache.repository";

const WEATHER_TTL_MS = 1000 * 60 * 30;

interface WeatherResponse {
  city: string;
  temperatureC: number;
  description: string;
  humidity: number;
  windKph: number;
  observedAt: string;
  source: "openweathermap" | "fallback";
}

export async function getWeather(city: string): Promise<WeatherResponse> {
  const normalizedCity = city.trim();
  const cacheKey = `weather:${normalizedCity.toLowerCase()}`;

  const cached = await getCachedPayload<WeatherResponse>("weather", cacheKey);
  if (cached) {
    return cached;
  }

  const { OPENWEATHER_API_KEY } = getServerEnv();

  if (!OPENWEATHER_API_KEY) {
    const fallback: WeatherResponse = {
      city: normalizedCity,
      temperatureC: 22,
      description: "partly cloudy",
      humidity: 52,
      windKph: 12,
      observedAt: new Date().toISOString(),
      source: "fallback",
    };

    await setCachedPayload("weather", cacheKey, fallback, WEATHER_TTL_MS);
    return fallback;
  }

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("q", normalizedCity);
  url.searchParams.set("units", "metric");
  url.searchParams.set("appid", OPENWEATHER_API_KEY);

  const response = await fetch(url.toString(), {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Weather provider failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    weather?: { description: string }[];
    main?: { temp: number; humidity: number };
    wind?: { speed: number };
    dt?: number;
    name?: string;
  };

  const normalized: WeatherResponse = {
    city: payload.name ?? normalizedCity,
    temperatureC: payload.main?.temp ?? 0,
    description: payload.weather?.[0]?.description ?? "unknown",
    humidity: payload.main?.humidity ?? 0,
    windKph: Math.round((payload.wind?.speed ?? 0) * 3.6),
    observedAt: payload.dt ? new Date(payload.dt * 1000).toISOString() : new Date().toISOString(),
    source: "openweathermap",
  };

  await setCachedPayload("weather", cacheKey, normalized, WEATHER_TTL_MS);
  return normalized;
}
