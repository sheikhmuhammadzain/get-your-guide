import { compareSync, hashSync } from "bcryptjs";
import { z } from "zod";
import { getMongoClientPromise } from "@/lib/db/mongodb-client";
import { ok, problemResponse } from "@/modules/shared/response";
import { fromUnknownError, fromZodError, ApiError } from "@/modules/shared/problem";

const schema = z.object({
  email: z.string().email(),
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(1),
});

export async function POST(request: Request) {
  const instance = new URL(request.url).pathname;

  try {
    const payload = schema.parse(await request.json());

    if (payload.newPassword !== payload.confirmPassword) {
      throw new ApiError(400, "PASSWORD_MISMATCH", "New password and confirmation do not match");
    }

    const client = await getMongoClientPromise();
    const db = client.db();
    const users = db.collection<{
      _id: unknown;
      email?: string | null;
      passwordHash?: string;
    }>("users");

    const user = await users.findOne({ email: payload.email.toLowerCase().trim() });

    // Use same error for missing user and wrong password to avoid email enumeration
    if (!user || !user.passwordHash) {
      throw new ApiError(400, "INVALID_CREDENTIALS", "Email or current password is incorrect");
    }

    if (!compareSync(payload.currentPassword, user.passwordHash)) {
      throw new ApiError(400, "INVALID_CREDENTIALS", "Email or current password is incorrect");
    }

    await users.updateOne(
      { _id: user._id },
      { $set: { passwordHash: hashSync(payload.newPassword, 10) } },
    );

    return ok({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return problemResponse(fromZodError(error, instance));
    }
    return problemResponse(fromUnknownError(error, instance));
  }
}
