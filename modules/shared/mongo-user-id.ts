import { createHash } from "node:crypto";
import { Types } from "mongoose";

export function toMongoUserId(userId: string) {
  if (Types.ObjectId.isValid(userId)) {
    return new Types.ObjectId(userId);
  }

  const deterministicHex = createHash("sha256").update(userId).digest("hex").slice(0, 24);
  return new Types.ObjectId(deterministicHex);
}
