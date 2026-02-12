import { Schema, model, models } from "mongoose";

const realtimeCacheSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    source: { type: String, required: true, index: true },
    payload: { type: Schema.Types.Mixed, required: true },
    fetchedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  {
    timestamps: true,
  },
);

realtimeCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RealtimeCacheModel =
  models.RealtimeCache || model("RealtimeCache", realtimeCacheSchema, "realtime_cache");
