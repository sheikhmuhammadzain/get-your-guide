import {
  countFeedback,
  createFeedback,
  deleteFeedbackById,
  listFeedback,
  updateFeedbackById,
} from "@/modules/feedback/feedback.repository";
import { ApiError } from "@/modules/shared/problem";

function mapFeedback(doc: {
  _id: { toString(): string };
  userId?: { toString(): string } | null;
  email?: string | null;
  category: string;
  message: string;
  rating?: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: doc._id.toString(),
    userId: doc.userId ? doc.userId.toString() : null,
    email: doc.email ?? null,
    category: doc.category,
    message: doc.message,
    rating: doc.rating ?? null,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function createFeedbackService(input: {
  userId?: string;
  email?: string;
  category: "ux" | "itinerary" | "assistant" | "realtime" | "other";
  message: string;
  rating?: number;
}) {
  const doc = await createFeedback(input);
  return mapFeedback(doc);
}

export async function listFeedbackService(cursor: string | undefined, limit: number) {
  const page = await listFeedback(cursor, limit);
  return {
    data: page.data.map((doc) => mapFeedback(doc)),
    nextCursor: page.nextCursor,
  };
}

export async function countFeedbackService() {
  return countFeedback();
}

export async function updateFeedbackService(
  feedbackId: string,
  patch: { status?: "new" | "reviewed"; message?: string; rating?: number },
) {
  const updated = await updateFeedbackById(feedbackId, patch);
  if (!updated) {
    throw new ApiError(404, "FEEDBACK_NOT_FOUND", "Feedback not found");
  }
  return mapFeedback(updated);
}

export async function deleteFeedbackService(feedbackId: string) {
  const deleted = await deleteFeedbackById(feedbackId);
  if (!deleted) {
    throw new ApiError(404, "FEEDBACK_NOT_FOUND", "Feedback not found");
  }
}
