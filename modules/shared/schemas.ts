import { z } from "zod";

export const budgetLevelSchema = z.enum(["budget", "standard", "luxury"]);
export const interestTagSchema = z.enum([
  "culture",
  "history",
  "food",
  "nature",
  "adventure",
  "relaxation",
]);
export const travelPaceSchema = z.enum(["slow", "balanced", "fast"]);

export const itineraryRequestSchema = z.object({
  destinations: z.array(z.string().trim().min(1)).min(1).max(4),
  startDate: z.string().date(),
  endDate: z.string().date(),
  budgetLevel: budgetLevelSchema,
  interests: z.array(interestTagSchema).min(1).max(4),
  travelers: z.number().int().min(1).max(10),
  pace: travelPaceSchema,
});

export const itinerarySaveSchema = z.object({
  requestSnapshot: itineraryRequestSchema,
  generatedPlan: z.unknown(),
  notes: z.string().trim().max(3000).optional(),
  status: z.enum(["draft", "saved", "archived"]).default("saved"),
});

export const itineraryQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const attractionQuerySchema = z.object({
  city: z.string().trim().min(1).optional(),
  tags: z.string().trim().optional(),
  budgetLevel: budgetLevelSchema.optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const chatRequestSchema = z.object({
  sessionId: z.string().trim().min(6).max(120),
  message: z.string().trim().min(1).max(2000),
  itineraryId: z.string().trim().optional(),
});

export const weatherQuerySchema = z.object({
  city: z.string().trim().min(1),
});

export const currencyQuerySchema = z.object({
  base: z.string().trim().length(3).default("USD"),
  target: z.string().trim().length(3).default("TRY"),
});

export const transportQuerySchema = z.object({
  from: z.string().trim().min(1),
  to: z.string().trim().min(1),
  mode: z.enum(["car", "bus", "flight"]).default("bus"),
});
