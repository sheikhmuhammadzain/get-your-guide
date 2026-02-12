import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/modules/auth/options";

export async function getAuthSession() {
  return getServerSession(getAuthOptions());
}
