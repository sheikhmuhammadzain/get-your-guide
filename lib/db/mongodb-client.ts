import { MongoClient } from "mongodb";
import { getServerEnv } from "@/lib/env/server";

declare global {
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

export function getMongoClientPromise() {
  if (globalThis.mongoClientPromise) {
    return globalThis.mongoClientPromise;
  }

  const { MONGODB_URI } = getServerEnv();
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is required for auth adapter");
  }

  const client = new MongoClient(MONGODB_URI, { dbName: "travel_planner" });
  globalThis.mongoClientPromise = client.connect();
  return globalThis.mongoClientPromise;
}
