import { Schema, model, models, type InferSchemaType, Types } from "mongoose";

const userPreferenceSchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: true, unique: true, index: true },
    preferredBudget: {
      type: String,
      enum: ["budget", "standard", "luxury"],
      default: "standard",
    },
    preferredCities: { type: [String], default: [] },
    preferredInterests: { type: [String], default: [] },
    savedMap: {
      centerLat: { type: Number, default: 39.0 },
      centerLon: { type: Number, default: 35.0 },
      zoom: { type: Number, default: 5.5 },
      highlightedCities: { type: [String], default: [] },
    },
  },
  { timestamps: true },
);

export type UserPreferenceDocument = InferSchemaType<typeof userPreferenceSchema>;

export const UserPreferenceModel =
  models.UserPreference || model("UserPreference", userPreferenceSchema, "user_preferences");
