import { z } from "zod";
import { getProductById } from "@/lib/data";
import { ApiError, fromUnknownError, fromZodError } from "@/modules/shared/problem";
import { created, problemResponse } from "@/modules/shared/response";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1),
        quantity: z.coerce.number().int().min(1).max(10),
      }),
    )
    .min(1),
  customer: z.object({
    fullName: z.string().trim().min(2),
    email: z.string().trim().email(),
    phone: z.string().trim().min(6),
    country: z.string().trim().min(2),
  }),
});

export async function POST(request: Request) {
  const instance = new URL(request.url).pathname;

  try {
    const body = checkoutSchema.parse(await request.json());

    const normalized = body.items.map((item) => {
      const product = getProductById(item.productId);
      if (!product) {
        throw new ApiError(400, "INVALID_PRODUCT", `Unknown product: ${item.productId}`);
      }
      return {
        productId: product.id,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity,
      };
    });

    const total = normalized.reduce((sum, item) => sum + item.lineTotal, 0);
    const orderId = `GYG-${Date.now()}`;

    return created(
      {
        orderId,
        status: "confirmed",
        total,
        currency: getProductById(normalized[0].productId)?.currency ?? "EUR",
      },
      `/checkout/success?orderId=${encodeURIComponent(orderId)}`,
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}
