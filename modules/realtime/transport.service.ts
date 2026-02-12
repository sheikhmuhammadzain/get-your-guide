import { getCachedPayload, setCachedPayload } from "@/modules/realtime/cache.repository";

const TRANSPORT_TTL_MS = 1000 * 60 * 60 * 24;

const cityCoordinates: Record<string, [number, number]> = {
  istanbul: [41.0082, 28.9784],
  ankara: [39.9334, 32.8597],
  izmir: [38.4237, 27.1428],
  antalya: [36.8969, 30.7133],
  cappadocia: [38.6431, 34.8272],
  konya: [37.8746, 32.4932],
  bodrum: [37.0344, 27.4305],
  trabzon: [41.0027, 39.7168],
};

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function haversineKm(from: [number, number], to: [number, number]) {
  const earthRadiusKm = 6371;
  const latDiff = toRadians(to[0] - from[0]);
  const lonDiff = toRadians(to[1] - from[1]);

  const a =
    Math.sin(latDiff / 2) ** 2 +
    Math.cos(toRadians(from[0])) * Math.cos(toRadians(to[0])) * Math.sin(lonDiff / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(earthRadiusKm * c);
}

function speedByMode(mode: "car" | "bus" | "flight") {
  if (mode === "flight") return 650;
  if (mode === "car") return 75;
  return 55;
}

export async function getTransportGuidance(from: string, to: string, mode: "car" | "bus" | "flight") {
  const normalizedFrom = from.trim().toLowerCase();
  const normalizedTo = to.trim().toLowerCase();
  const cacheKey = `transport:${normalizedFrom}:${normalizedTo}:${mode}`;

  const cached = await getCachedPayload<{
    from: string;
    to: string;
    mode: string;
    distanceKm: number;
    estimatedDurationHours: number;
    recommendation: string;
    source: "heuristic";
  }>("transport", cacheKey);

  if (cached) {
    return cached;
  }

  const fromCoordinates = cityCoordinates[normalizedFrom] ?? cityCoordinates.istanbul;
  const toCoordinates = cityCoordinates[normalizedTo] ?? cityCoordinates.ankara;

  const distanceKm = haversineKm(fromCoordinates, toCoordinates);
  const estimatedDurationHours = Number((distanceKm / speedByMode(mode)).toFixed(1));

  const recommendation =
    mode === "flight"
      ? "Book at least 2 weeks early for better domestic fares."
      : mode === "car"
        ? "Plan for toll roads and rest stops on long intercity drives."
        : "Use overnight buses for long routes to save accommodation cost.";

  const payload = {
    from,
    to,
    mode,
    distanceKm,
    estimatedDurationHours,
    recommendation,
    source: "heuristic" as const,
  };

  await setCachedPayload("transport", cacheKey, payload, TRANSPORT_TTL_MS);
  return payload;
}
