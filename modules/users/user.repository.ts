import { ObjectId } from "mongodb";
import { getMongoClientPromise } from "@/lib/db/mongodb-client";
import { decodeCursor, encodeCursor } from "@/modules/shared/pagination";

interface UserCollectionRow {
  _id: ObjectId;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  emailVerified?: Date | null;
}

export async function listUsers(cursor: string | undefined, limit: number) {
  const client = await getMongoClientPromise();
  const db = client.db();
  const collection = db.collection<UserCollectionRow>("users");

  const query: Record<string, unknown> = {};
  const decoded = decodeCursor(cursor);
  if (decoded?.id && ObjectId.isValid(decoded.id)) {
    query._id = { $lt: new ObjectId(decoded.id) };
  }

  const docs = await collection.find(query).sort({ _id: -1 }).limit(limit + 1).toArray();
  const hasMore = docs.length > limit;
  const rows = hasMore ? docs.slice(0, limit) : docs;

  return {
    data: rows,
    nextCursor: hasMore ? encodeCursor({ id: rows[rows.length - 1]._id.toString() }) : null,
  };
}

export async function countUsers() {
  const client = await getMongoClientPromise();
  const db = client.db();
  return db.collection("users").countDocuments();
}
