import { Schema, model, models, type InferSchemaType, Types } from "mongoose";

const orderItemSchema = new Schema(
  {
    productId: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1, max: 10 },
    unitPrice: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "EUR" },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: false, index: true },
    customer: {
      fullName: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
    },
    items: { type: [orderItemSchema], required: true, default: [] },
    total: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "EUR" },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
      index: true,
    },
    orderCode: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true },
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ userId: 1, createdAt: -1 });

export type OrderDocument = InferSchemaType<typeof orderSchema>;

export const OrderModel = models.Order || model("Order", orderSchema, "orders");
