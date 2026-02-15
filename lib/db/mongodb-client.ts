import { MongoClient } from "mongodb";
import { getServerEnv } from "@/lib/env/server";

declare global {
  var mongoClientCache:
    | {
        uri: string;
        promise: Promise<MongoClient>;
      }
    | undefined;
}

export function getMongoClientPromise() {
  const { MONGODB_URI } = getServerEnv();
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is required for auth adapter");
  }

  const parsed = new URL(MONGODB_URI);
  const hasDbName = parsed.pathname && parsed.pathname !== "/";
  if (!hasDbName) {
    parsed.pathname = "/travel_planner";
  }
  const normalizedUri = parsed.toString();

  if (globalThis.mongoClientCache?.uri === normalizedUri) {
    return globalThis.mongoClientCache.promise;
  }

  const client = new MongoClient(normalizedUri);
  const promise = client.connect();
  globalThis.mongoClientCache = {
    uri: normalizedUri,
    promise,
  };
  return promise;
}
