import { ApiError } from "@/modules/shared/problem";
import { getAuthSession } from "@/lib/auth/get-session";

export async function requireUserId() {
  const session = await getAuthSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new ApiError(401, "UNAUTHORIZED", "You must be authenticated to access this resource");
  }

  return userId;
}
