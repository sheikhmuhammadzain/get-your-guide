import { Schema, model, models, type InferSchemaType, Types } from "mongoose";

const itinerarySchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: true, index: true },
    requestSnapshot: { type: Schema.Types.Mixed, required: true },
    generatedPlan: { type: Schema.Types.Mixed, required: true },
    notes: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["draft", "saved", "archived"],
      default: "saved",
      index: true,
    },
    version: { type: Number, default: 1 },
  },
  { timestamps: true },
);

itinerarySchema.index({ userId: 1, updatedAt: -1 });

export type ItineraryDocument = InferSchemaType<typeof itinerarySchema>;

export const ItineraryModel =
  models.Itinerary || model("Itinerary", itinerarySchema, "itineraries");
