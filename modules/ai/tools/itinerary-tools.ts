import type { BudgetLevel, InterestTag, TravelPace } from "@/types/travel";
import { generateDeterministicItinerary } from "@/modules/itineraries/planner.service";
import { enhanceItineraryWithAI } from "@/modules/ai/itinerary-ai.service";
import {
  createItineraryService,
  listItinerariesService,
  getItineraryService,
  updateItineraryService,
  deleteItineraryService,
} from "@/modules/itineraries/itinerary.service";

export interface GenerateItineraryArgs {
  destinations: string[];
  start_date: string;
  end_date: string;
  budget_level: BudgetLevel;
  interests: InterestTag[];
  travelers: number;
  pace: TravelPace;
}

export interface SaveItineraryArgs {
  request_snapshot: unknown;
  generated_plan: unknown;
  notes?: string;
  status?: "draft" | "saved" | "archived";
}

export interface ListItinerariesArgs {
  limit?: number;
  cursor?: string;
}

export interface GetItineraryArgs {
  itinerary_id: string;
}

export interface UpdateItineraryArgs {
  itinerary_id: string;
  notes?: string;
  status?: "draft" | "saved" | "archived";
}

export interface DeleteItineraryArgs {
  itinerary_id: string;
}

const VALID_BUDGET_LEVELS: BudgetLevel[] = ["budget", "standard", "luxury"];
const VALID_PACES: TravelPace[] = ["slow", "balanced", "fast"];
const VALID_INTERESTS: InterestTag[] = [
  "culture",
  "history",
  "food",
  "nature",
  "adventure",
  "relaxation",
];

export async function generateItinerary(args: GenerateItineraryArgs): Promise<unknown> {
  if (!args.destinations || args.destinations.length === 0) {
    return { error: "At least one destination is required." };
  }

  if (!VALID_BUDGET_LEVELS.includes(args.budget_level)) {
    return { error: `Invalid budget_level. Must be one of: ${VALID_BUDGET_LEVELS.join(", ")}` };
  }

  if (!VALID_PACES.includes(args.pace)) {
    return { error: `Invalid pace. Must be one of: ${VALID_PACES.join(", ")}` };
  }

  const safeInterests = (args.interests ?? []).filter((t): t is InterestTag =>
    VALID_INTERESTS.includes(t as InterestTag),
  );

  if (safeInterests.length === 0) {
    return { error: "At least one valid interest is required." };
  }

  const request = {
    destinations: args.destinations.map((d) => d.toLowerCase()),
    startDate: args.start_date,
    endDate: args.end_date,
    budgetLevel: args.budget_level,
    interests: safeInterests,
    travelers: Math.min(Math.max(Math.round(args.travelers), 1), 20),
    pace: args.pace,
  };

  try {
    const deterministicPlan = await generateDeterministicItinerary(request);
    const finalPlan = await enhanceItineraryWithAI(request, deterministicPlan);

    return {
      request,
      itinerary: finalPlan,
      dayCount: finalPlan.days.length,
      totalEstimatedCostTRY: finalPlan.totalEstimatedCostTRY,
      title: finalPlan.title,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Itinerary generation failed." };
  }
}

export async function saveItinerary(args: SaveItineraryArgs, userId: string | undefined): Promise<unknown> {
  if (!userId) {
    return { error: "You must be signed in to save an itinerary." };
  }

  try {
    const doc = await createItineraryService({
      userId,
      requestSnapshot: args.request_snapshot,
      generatedPlan: args.generated_plan,
      notes: args.notes,
      status: args.status ?? "draft",
    });

    return {
      id: doc.id,
      status: doc.status,
      notes: doc.notes,
      url: `/itineraries/${doc.id}`,
      message: "Itinerary saved successfully.",
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to save itinerary." };
  }
}

export async function listItineraries(args: ListItinerariesArgs, userId: string | undefined): Promise<unknown> {
  if (!userId) {
    return { error: "You must be signed in to view your itineraries." };
  }

  const limit = Math.min(Math.max(args.limit ?? 10, 1), 20);

  try {
    const page = await listItinerariesService(userId, args.cursor, limit);

    return {
      items: page.data.map((item) => ({
        id: item.id,
        title: (item.generatedPlan as { title?: string })?.title ?? "Untitled itinerary",
        status: item.status,
        notes: item.notes ?? null,
        dayCount: (item.generatedPlan as { days?: unknown[] })?.days?.length ?? 0,
        createdAt: item.createdAt,
        url: `/itineraries/${item.id}`,
      })),
      nextCursor: page.nextCursor ?? null,
      count: page.data.length,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to list itineraries." };
  }
}

export async function getItinerary(args: GetItineraryArgs, userId: string | undefined): Promise<unknown> {
  if (!userId) {
    return { error: "You must be signed in to view an itinerary." };
  }

  try {
    const doc = await getItineraryService(userId, args.itinerary_id);
    return {
      id: doc.id,
      requestSnapshot: doc.requestSnapshot,
      generatedPlan: doc.generatedPlan,
      notes: doc.notes ?? null,
      status: doc.status,
      version: doc.version,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      url: `/itineraries/${doc.id}`,
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to fetch itinerary." };
  }
}

export async function updateItinerary(args: UpdateItineraryArgs, userId: string | undefined): Promise<unknown> {
  if (!userId) {
    return { error: "You must be signed in to update an itinerary." };
  }

  if (!args.notes && !args.status) {
    return { error: "Provide at least one field to update: notes or status." };
  }

  try {
    const doc = await updateItineraryService({
      userId,
      itineraryId: args.itinerary_id,
      notes: args.notes,
      status: args.status,
    });

    return {
      id: doc.id,
      status: doc.status,
      notes: doc.notes ?? null,
      updatedAt: doc.updatedAt,
      message: "Itinerary updated successfully.",
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to update itinerary." };
  }
}

export async function deleteItinerary(args: DeleteItineraryArgs, userId: string | undefined): Promise<unknown> {
  if (!userId) {
    return { error: "You must be signed in to delete an itinerary." };
  }

  try {
    await deleteItineraryService(userId, args.itinerary_id);
    return { deleted: true, id: args.itinerary_id, message: "Itinerary deleted successfully." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Failed to delete itinerary." };
  }
}
