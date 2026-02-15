import { Schema, model, models, type InferSchemaType, Types } from "mongoose";

const feedbackSchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: false, index: true },
    email: { type: String, required: false, trim: true, lowercase: true },
    category: {
      type: String,
      enum: ["ux", "itinerary", "assistant", "realtime", "other"],
      required: true,
      index: true,
    },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    rating: { type: Number, min: 1, max: 5 },
    status: {
      type: String,
      enum: ["new", "reviewed"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true },
);

feedbackSchema.index({ createdAt: -1 });

export type FeedbackDocument = InferSchemaType<typeof feedbackSchema>;

export const FeedbackModel = models.Feedback || model("Feedback", feedbackSchema, "feedback");
