import type { InterestTag } from "@/types/travel";
import { getAttractionBySlug, listAttractions } from "@/modules/attractions/attraction.repository";

export interface SearchAttractionsArgs {
  city?: string;
  interests?: InterestTag[];
  limit?: number;
}

export interface GetAttractionDetailsArgs {
  slug: string;
}

const VALID_INTERESTS: InterestTag[] = [
  "culture",
  "history",
  "food",
  "nature",
  "adventure",
  "relaxation",
];

export async function searchAttractions(args: SearchAttractionsArgs): Promise<unknown> {
  const limit = Math.min(Math.max(args.limit ?? 8, 1), 20);

  const safeInterests = (args.interests ?? []).filter((t): t is InterestTag =>
    VALID_INTERESTS.includes(t as InterestTag),
  );

  try {
    const page = await listAttractions({
      city: args.city,
      tags: safeInterests.length > 0 ? safeInterests : undefined,
      limit,
    });

    return page.data.map((a) => ({
      id: a._id.toString(),
      slug: a.slug,
      city: a.city,
      name: a.name,
      description: a.description,
      tags: a.tags,
      openingHours: a.openingHours,
      avgDurationMin: a.avgDurationMin,
      ticketPriceRange: a.ticketPriceRange,
      popularityScore: a.popularityScore,
      url: `/attractions/${a.slug}`,
    }));
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Attraction search failed." };
  }
}

export async function getAttractionDetails(args: GetAttractionDetailsArgs): Promise<unknown> {
  try {
    const attraction = await getAttractionBySlug(args.slug);
    if (!attraction) {
      return { error: `Attraction with slug "${args.slug}" not found.` };
    }

    return {
      slug: attraction.slug,
      city: attraction.city,
      name: attraction.name,
      description: attraction.description,
      tags: attraction.tags,
      openingHours: attraction.openingHours,
      avgDurationMin: attraction.avgDurationMin,
      ticketPriceRange: attraction.ticketPriceRange,
      bestVisitMonths: attraction.bestVisitMonths,
      popularityScore: attraction.popularityScore,
      coordinates: attraction.coordinates,
      url: `/attractions/${attraction.slug}`,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Attraction lookup failed." };
  }
}
