import { connectToDatabase } from "@/lib/db/mongoose";
import { ProductOptionModel } from "./product-option.model";

export async function getOptionsByProductId(productId: string) {
  await connectToDatabase();
  return ProductOptionModel.find({ productId }).sort({ sortOrder: 1 }).lean();
}
