import { ok } from "@/modules/shared/response";

export async function GET() {
  return ok({
    status: "ok",
    service: "travel-planner-api",
    version: "v1",
    timestamp: new Date().toISOString(),
  });
}
