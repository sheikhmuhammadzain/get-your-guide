import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import { AttractionModel, type AttractionDocument } from "@/modules/attractions/attraction.model";
import { decodeCursor, encodeCursor } from "@/modules/shared/pagination";
import type { BudgetLevel, CursorPage, InterestTag } from "@/types/travel";

export interface AttractionListFilters {
  city?: string;
  tags?: string[];
  budgetLevel?: BudgetLevel;
  cursor?: string;
  limit: number;
}

function budgetMaxMap(budgetLevel: BudgetLevel) {
  if (budgetLevel === "budget") return 900;
  if (budgetLevel === "standard") return 2500;
  return 10000;
}

export async function listAttractions(filters: AttractionListFilters): Promise<CursorPage<AttractionDocument & { _id: Types.ObjectId }>> {
  await connectToDatabase();

  const decoded = decodeCursor(filters.cursor);
  const query: Record<string, unknown> = {};

  if (filters.city) {
    query.city = filters.city;
  }

  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }

  if (filters.budgetLevel) {
    query["ticketPriceRange.max"] = { $lte: budgetMaxMap(filters.budgetLevel) };
  }

  if (decoded?.id && Types.ObjectId.isValid(decoded.id)) {
    query._id = { $lt: new Types.ObjectId(decoded.id) };
  }

  const docs = await AttractionModel.find(query)
    .sort({ _id: -1 })
    .limit(filters.limit + 1)
    .lean();

  const hasMore = docs.length > filters.limit;
  const sliced = hasMore ? docs.slice(0, filters.limit) : docs;
  const nextCursor = hasMore ? encodeCursor({ id: sliced[sliced.length - 1]._id.toString() }) : null;

  return {
    data: sliced,
    nextCursor,
  };
}

export async function getAttractionsForPlanning(cities: string[], interests: InterestTag[]) {
  await connectToDatabase();

  const docs = await AttractionModel.find({
    city: { $in: cities },
    tags: { $in: interests },
  })
    .sort({ popularityScore: -1 })
    .lean();

  const byCity = new Map<string, (AttractionDocument & { _id: Types.ObjectId })[]>();
  for (const doc of docs) {
    const city = doc.city;
    const current = byCity.get(city) ?? [];
    current.push(doc);
    byCity.set(city, current);
  }

  return byCity;
}
