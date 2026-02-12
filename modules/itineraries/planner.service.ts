import type { GeneratedItinerary, ItineraryRequest, TravelPace } from "@/types/travel";
import { getAttractionsForPlanning } from "@/modules/attractions/attraction.repository";

function daysBetween(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, days);
}

function activitiesPerDay(pace: TravelPace) {
  if (pace === "slow") return 2;
  if (pace === "fast") return 4;
  return 3;
}

function budgetMultiplier(level: ItineraryRequest["budgetLevel"]) {
  if (level === "budget") return 0.85;
  if (level === "luxury") return 1.45;
  return 1;
}

export async function generateDeterministicItinerary(request: ItineraryRequest): Promise<GeneratedItinerary> {
  const totalDays = daysBetween(request.startDate, request.endDate);
  const perDay = activitiesPerDay(request.pace);

  const byCity = await getAttractionsForPlanning(request.destinations, request.interests);

  const days: GeneratedItinerary["days"] = [];
  let totalEstimatedCostTRY = 0;

  for (let dayIndex = 0; dayIndex < totalDays; dayIndex += 1) {
    const city = request.destinations[dayIndex % request.destinations.length];
    const cityAttractions = [...(byCity.get(city) ?? [])].slice(0, perDay);

    const items = cityAttractions.map((attraction, idx) => {
      const hour = 9 + idx * 3;
      const startTime = `${String(hour).padStart(2, "0")}:00`;
      const endTime = `${String(hour + 2).padStart(2, "0")}:00`;
      const minPrice = attraction.ticketPriceRange?.min ?? 300;
      const maxPrice = attraction.ticketPriceRange?.max ?? 700;
      const baseCost = Math.round((minPrice + maxPrice) / 2);
      const adjustedCost = Math.round(baseCost * budgetMultiplier(request.budgetLevel) * request.travelers);

      totalEstimatedCostTRY += adjustedCost;

      return {
        attractionId: attraction._id.toString(),
        startTime,
        endTime,
        costEstimateTRY: adjustedCost,
        transportHint: idx === 0 ? "Start early to avoid crowds" : "Use local taxi or tram for transfer",
      };
    });

    days.push({
      day: dayIndex + 1,
      city,
      items,
      notes: [
        `Best for ${request.interests.join(", ")} in ${city}`,
        "Carry cash for smaller vendors and local transport",
      ],
    });
  }

  return {
    title: `${request.destinations.join(" -> ")} ${totalDays}-day AI itinerary`,
    cityOrder: request.destinations,
    days,
    totalEstimatedCostTRY,
  };
}
