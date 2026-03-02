import { Schema, model, models, type InferSchemaType } from "mongoose";

const productOptionSchema = new Schema(
  {
    productId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    /** Human-readable hours e.g. "9:00 AM – 6:00 PM" */
    openingHoursText: { type: String, required: true, trim: true },
    pricePerPerson: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "EUR" },
    /** Hours before the start of the activity after which no refund is given */
    cancellationHours: { type: Number, required: true, default: 24 },
    maxGroupSize: { type: Number, required: true, min: 1 },
    /** 0 = Sunday … 6 = Saturday */
    availableDaysOfWeek: [{ type: Number, min: 0, max: 6 }],
    /** Available start times in "HH:MM" 24-h format */
    timeSlots: [{ type: String }],
    /** Sort order within a product */
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

productOptionSchema.index({ productId: 1, sortOrder: 1 });

export type ProductOptionDocument = InferSchemaType<typeof productOptionSchema>;

export const ProductOptionModel =
  models.ProductOption ||
  model("ProductOption", productOptionSchema, "product_options");
