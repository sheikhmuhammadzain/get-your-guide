import { requireUserId } from "@/modules/auth/guards";
import { fromUnknownError } from "@/modules/shared/problem";
import { ok, problemResponse } from "@/modules/shared/response";
import { getAuthSession } from "@/lib/auth/get-session";

export async function GET(request: Request) {
  const instance = new URL(request.url).pathname;

  try {
    const userId = await requireUserId();
    const session = await getAuthSession();
    return ok({
      id: userId,
      name: session?.user?.name ?? null,
      email: session?.user?.email ?? null,
      image: session?.user?.image ?? null,
    });
  } catch (error) {
    return problemResponse(fromUnknownError(error, instance));
  }
}
