import { requireAdmin } from "@/modules/auth/guards";
import { getAdminOverviewService } from "@/modules/admin/admin.service";
import { fromUnknownError } from "@/modules/shared/problem";
import { ok, problemResponse } from "@/modules/shared/response";

export async function GET(request: Request) {
  const instance = new URL(request.url).pathname;

  try {
    await requireAdmin();
    const overview = await getAdminOverviewService();
    return ok(overview);
  } catch (error) {
    return problemResponse(fromUnknownError(error, instance));
  }
}
