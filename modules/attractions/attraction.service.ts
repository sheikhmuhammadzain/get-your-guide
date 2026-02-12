import type { BudgetLevel, InterestTag } from "@/types/travel";
import { listAttractions, type AttractionListFilters } from "@/modules/attractions/attraction.repository";

export interface ListAttractionsInput {
  city?: string;
  tags?: string;
  budgetLevel?: BudgetLevel;
  cursor?: string;
  limit: number;
}

function parseTags(tags?: string): string[] | undefined {
  if (!tags) {
    return undefined;
  }

  const values = tags
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  return values.length > 0 ? values : undefined;
}

export async function listAttractionsService(input: ListAttractionsInput) {
  const filters: AttractionListFilters = {
    city: input.city,
    tags: parseTags(input.tags),
    budgetLevel: input.budgetLevel,
    cursor: input.cursor,
    limit: input.limit,
  };

  const page = await listAttractions(filters);

  return {
    data: page.data.map((item) => ({
      id: item._id.toString(),
      slug: item.slug,
      city: item.city,
      name: item.name,
      description: item.description,
      tags: item.tags,
      coordinates: item.coordinates,
      openingHours: item.openingHours,
      avgDurationMin: item.avgDurationMin,
      ticketPriceRange: item.ticketPriceRange,
      bestVisitMonths: item.bestVisitMonths,
      popularityScore: item.popularityScore,
    })),
    nextCursor: page.nextCursor,
  };
}

export const supportedInterestTags: InterestTag[] = [
  "culture",
  "history",
  "food",
  "nature",
  "adventure",
  "relaxation",
];
