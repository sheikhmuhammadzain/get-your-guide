import { Schema, model, models, Types } from "mongoose";

const chatMessageSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const chatSessionSchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    itineraryId: { type: Types.ObjectId, required: false },
    messages: [chatMessageSchema],
    summary: { type: String, default: "" },
    expiresAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

chatSessionSchema.index({ userId: 1, updatedAt: -1 });
chatSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const ChatSessionModel =
  models.ChatSession || model("ChatSession", chatSessionSchema, "chat_sessions");
