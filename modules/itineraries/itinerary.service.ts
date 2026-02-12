import {
  createUserItinerary,
  deleteUserItineraryById,
  getUserItineraryById,
  listAllItineraries,
  listUserItineraries,
  updateUserItineraryById,
} from "@/modules/itineraries/itinerary.repository";

export async function listItinerariesService(userId: string, cursor: string | undefined, limit: number) {
  const page = await listUserItineraries(userId, cursor, limit);

  return {
    data: page.data.map((doc) => ({
      id: doc._id.toString(),
      requestSnapshot: doc.requestSnapshot,
      generatedPlan: doc.generatedPlan,
      notes: doc.notes,
      status: doc.status,
      version: doc.version,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })),
    nextCursor: page.nextCursor,
  };
}

export async function listAllItinerariesService(cursor: string | undefined, limit: number) {
  const page = await listAllItineraries(cursor, limit);

  return {
    data: page.data.map((doc) => ({
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      requestSnapshot: doc.requestSnapshot,
      generatedPlan: doc.generatedPlan,
      notes: doc.notes,
      status: doc.status,
      version: doc.version,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    })),
    nextCursor: page.nextCursor,
  };
}

export async function createItineraryService(params: {
  userId: string;
  requestSnapshot: unknown;
  generatedPlan: unknown;
  notes?: string;
  status?: "draft" | "saved" | "archived";
}) {
  const doc = await createUserItinerary(params);

  return {
    id: doc._id.toString(),
    requestSnapshot: doc.requestSnapshot,
    generatedPlan: doc.generatedPlan,
    notes: doc.notes,
    status: doc.status,
    version: doc.version,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function getItineraryService(userId: string, itineraryId: string) {
  const doc = await getUserItineraryById(userId, itineraryId);
  return {
    id: doc._id.toString(),
    requestSnapshot: doc.requestSnapshot,
    generatedPlan: doc.generatedPlan,
    notes: doc.notes,
    status: doc.status,
    version: doc.version,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function updateItineraryService(params: {
  userId: string;
  itineraryId: string;
  notes?: string;
  status?: "draft" | "saved" | "archived";
}) {
  const doc = await updateUserItineraryById(params);
  return {
    id: doc._id.toString(),
    requestSnapshot: doc.requestSnapshot,
    generatedPlan: doc.generatedPlan,
    notes: doc.notes,
    status: doc.status,
    version: doc.version,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function deleteItineraryService(userId: string, itineraryId: string) {
  await deleteUserItineraryById(userId, itineraryId);
}
