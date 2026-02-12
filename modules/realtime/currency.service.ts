import { getServerEnv } from "@/lib/env/server";
import { getCachedPayload, setCachedPayload } from "@/modules/realtime/cache.repository";

const CURRENCY_TTL_MS = 1000 * 60 * 60 * 12;

interface CurrencyResponse {
  base: string;
  target: string;
  rate: number;
  asOf: string;
  source: "exchangerate-api" | "fallback";
}

export async function getCurrencyRate(base: string, target: string): Promise<CurrencyResponse> {
  const normalizedBase = base.toUpperCase();
  const normalizedTarget = target.toUpperCase();
  const cacheKey = `currency:${normalizedBase}:${normalizedTarget}`;

  const cached = await getCachedPayload<CurrencyResponse>("currency", cacheKey);
  if (cached) {
    return cached;
  }

  const { EXCHANGERATE_API_KEY } = getServerEnv();
  if (!EXCHANGERATE_API_KEY) {
    const fallback: CurrencyResponse = {
      base: normalizedBase,
      target: normalizedTarget,
      rate: normalizedBase === normalizedTarget ? 1 : 32,
      asOf: new Date().toISOString(),
      source: "fallback",
    };

    await setCachedPayload("currency", cacheKey, fallback, CURRENCY_TTL_MS);
    return fallback;
  }

  const url = `https://v6.exchangerate-api.com/v6/${EXCHANGERATE_API_KEY}/latest/${normalizedBase}`;
  const response = await fetch(url, { method: "GET", cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Currency provider failed with status ${response.status}`);
  }

  const payload = (await response.json()) as {
    conversion_rates?: Record<string, number>;
    time_last_update_utc?: string;
  };

  const rate = payload.conversion_rates?.[normalizedTarget];
  if (!rate) {
    throw new Error(`Currency rate not found for ${normalizedBase}->${normalizedTarget}`);
  }

  const normalized: CurrencyResponse = {
    base: normalizedBase,
    target: normalizedTarget,
    rate,
    asOf: payload.time_last_update_utc ?? new Date().toISOString(),
    source: "exchangerate-api",
  };

  await setCachedPayload("currency", cacheKey, normalized, CURRENCY_TTL_MS);
  return normalized;
}
