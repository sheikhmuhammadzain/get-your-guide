import { Schema, model, models, type InferSchemaType, Types } from "mongoose";

const wishlistSchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: true, unique: true, index: true },
    productIds: { type: [String], default: [] },
  },
  { timestamps: true },
);

wishlistSchema.index({ userId: 1 }, { unique: true });

export type WishlistDocument = InferSchemaType<typeof wishlistSchema>;

export const WishlistModel = models.Wishlist || model("Wishlist", wishlistSchema, "wishlists");
