import mongoose from "mongoose";
import { getServerEnv } from "@/lib/env/server";

declare global {
  var mongooseConnection:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

const globalCache = globalThis.mongooseConnection ?? {
  conn: null,
  promise: null,
};

globalThis.mongooseConnection = globalCache;

export async function connectToDatabase() {
  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    const { MONGODB_URI } = getServerEnv();
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is required for database operations");
    }
    globalCache.promise = mongoose.connect(MONGODB_URI, {
      autoIndex: true,
      dbName: "travel_planner",
    });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}
