import { getServerEnv } from "@/lib/env/server";
import { getCachedPayload, setCachedPayload } from "@/modules/realtime/cache.repository";

const WEATHER_TTL_MS = 1000 * 60 * 30;

interface HourlyForecast {
  time: string;
  temperatureC: number;
  description: string;
}

interface WeatherResponse {
  city: string;
  temperatureC: number;
  description: string;
  humidity: number;
  windKph: number;
  observedAt: string;
  hourly: HourlyForecast[];
  source: "openweathermap" | "fallback";
}

function createFallbackHourly(hours: number) {
  const entries: HourlyForecast[] = [];
  for (let index = 1; index <= hours; index += 1) {
    const time = new Date(Date.now() + index * 60 * 60 * 1000).toISOString();
    entries.push({
      time,
      temperatureC: 20 + (index % 4),
      description: "partly cloudy",
    });
  }
  return entries;
}

export async function getWeather(city: string, hours = 6): Promise<WeatherResponse> {
  const normalizedCity = city.trim();
  const normalizedHours = Math.max(1, Math.min(24, hours));
  const cacheKey = `weather:${normalizedCity.toLowerCase()}:${normalizedHours}`;

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
      hourly: createFallbackHourly(normalizedHours),
      source: "fallback",
    };

    await setCachedPayload("weather", cacheKey, fallback, WEATHER_TTL_MS);
    return fallback;
  }

  const currentUrl = new URL("https://api.openweathermap.org/data/2.5/weather");
  currentUrl.searchParams.set("q", normalizedCity);
  currentUrl.searchParams.set("units", "metric");
  currentUrl.searchParams.set("appid", OPENWEATHER_API_KEY);

  const forecastUrl = new URL("https://api.openweathermap.org/data/2.5/forecast");
  forecastUrl.searchParams.set("q", normalizedCity);
  forecastUrl.searchParams.set("units", "metric");
  forecastUrl.searchParams.set("appid", OPENWEATHER_API_KEY);

  const [currentResponse, forecastResponse] = await Promise.all([
    fetch(currentUrl.toString(), { method: "GET", cache: "no-store" }),
    fetch(forecastUrl.toString(), { method: "GET", cache: "no-store" }),
  ]);

  if (!currentResponse.ok || !forecastResponse.ok) {
    throw new Error(
      `Weather provider failed with status ${currentResponse.status}/${forecastResponse.status}`,
    );
  }

  const currentPayload = (await currentResponse.json()) as {
    weather?: { description: string }[];
    main?: { temp: number; humidity: number };
    wind?: { speed: number };
    dt?: number;
    name?: string;
  };

  const forecastPayload = (await forecastResponse.json()) as {
    list?: Array<{
      dt?: number;
      main?: { temp: number };
      weather?: { description: string }[];
    }>;
  };

  const hourly = (forecastPayload.list ?? []).slice(0, normalizedHours).map((item) => ({
    time: item.dt ? new Date(item.dt * 1000).toISOString() : new Date().toISOString(),
    temperatureC: item.main?.temp ?? currentPayload.main?.temp ?? 0,
    description: item.weather?.[0]?.description ?? "unknown",
  }));

  const normalized: WeatherResponse = {
    city: currentPayload.name ?? normalizedCity,
    temperatureC: currentPayload.main?.temp ?? 0,
    description: currentPayload.weather?.[0]?.description ?? "unknown",
    humidity: currentPayload.main?.humidity ?? 0,
    windKph: Math.round((currentPayload.wind?.speed ?? 0) * 3.6),
    observedAt: currentPayload.dt
      ? new Date(currentPayload.dt * 1000).toISOString()
      : new Date().toISOString(),
    hourly,
    source: "openweathermap",
  };

  await setCachedPayload("weather", cacheKey, normalized, WEATHER_TTL_MS);
  return normalized;
}