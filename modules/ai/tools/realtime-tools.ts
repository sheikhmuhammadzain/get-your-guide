import { getWeather } from "@/modules/realtime/weather.service";
import { getTransportGuidance } from "@/modules/realtime/transport.service";

export interface GetWeatherArgs {
  city: string;
  hours?: number;
}

export interface GetTransportInfoArgs {
  from: string;
  to: string;
  mode?: "car" | "bus" | "flight";
  departure_date?: string;
}

export async function getWeatherTool(args: GetWeatherArgs): Promise<unknown> {
  try {
    const result = await getWeather(args.city, args.hours ?? 6);
    return {
      city: result.city,
      temperatureC: result.temperatureC,
      description: result.description,
      humidity: result.humidity,
      windKph: result.windKph,
      observedAt: result.observedAt,
      source: result.source,
      // Return compact hourly (skip full array to save tokens)
      hourlyPreview: result.hourly.slice(0, 4).map((h) => ({
        time: h.time,
        tempC: h.temperatureC,
        desc: h.description,
      })),
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Weather lookup failed." };
  }
}

export async function getTransportInfoTool(args: GetTransportInfoArgs): Promise<unknown> {
  const mode = args.mode ?? "bus";
  const validModes = ["car", "bus", "flight"];
  if (!validModes.includes(mode)) {
    return { error: "mode must be one of: car, bus, flight" };
  }

  try {
    const result = await getTransportGuidance(
      args.from,
      args.to,
      mode,
      args.departure_date,
    );
    return {
      from: result.from,
      to: result.to,
      mode: result.mode,
      distanceKm: result.distanceKm,
      estimatedDurationHours: result.estimatedDurationHours,
      recommendation: result.recommendation,
      source: result.source,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Transport lookup failed." };
  }
}
