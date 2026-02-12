import { Schema, model, models, type InferSchemaType } from "mongoose";

const pointSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator(value: number[]) {
          return Array.isArray(value) && value.length === 2;
        },
        message: "Coordinates must be [longitude, latitude]",
      },
    },
  },
  { _id: false },
);

const attractionSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tags: [{ type: String, required: true, trim: true, index: true }],
    coordinates: { type: pointSchema, required: true },
    openingHours: { type: String, required: true, trim: true },
    avgDurationMin: { type: Number, required: true, min: 30, max: 720 },
    ticketPriceRange: {
      min: { type: Number, required: true, min: 0 },
      max: { type: Number, required: true, min: 0 },
      currency: { type: String, required: true, default: "TRY" },
    },
    bestVisitMonths: [{ type: Number, required: true, min: 1, max: 12 }],
    popularityScore: { type: Number, required: true, min: 0, max: 100, default: 50 },
  },
  {
    timestamps: true,
  },
);

attractionSchema.index({ city: 1, tags: 1 });
attractionSchema.index({ coordinates: "2dsphere" });
attractionSchema.index({ name: "text", description: "text" });

export type AttractionDocument = InferSchemaType<typeof attractionSchema>;

export const AttractionModel =
  models.Attraction || model("Attraction", attractionSchema, "attractions");
