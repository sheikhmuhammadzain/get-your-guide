import { ApiError } from "@/modules/shared/problem";
import { getAuthSession } from "@/lib/auth/get-session";
import { getServerEnv } from "@/lib/env/server";

function getAdminEmails() {
  const { ADMIN_EMAILS } = getServerEnv();
  if (!ADMIN_EMAILS) {
    return [];
  }
  return ADMIN_EMAILS.split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function isAdminSession() {
  const session = await getAuthSession();
  const email = session?.user?.email?.toLowerCase();
  if (!email) {
    return false;
  }
  const admins = getAdminEmails();
  return admins.includes(email);
}

export async function requireUserId() {
  const session = await getAuthSession();
  const userId = session?.user?.id;

  if (!userId) {
    throw new ApiError(401, "UNAUTHORIZED", "You must be authenticated to access this resource");
  }

  return userId;
}

export async function requireAdmin() {
  const session = await getAuthSession();
  const userId = session?.user?.id;
  const email = session?.user?.email?.toLowerCase();

  if (!userId || !email) {
    throw new ApiError(401, "UNAUTHORIZED", "You must be authenticated to access this resource");
  }

  const admins = getAdminEmails();
  if (!admins.includes(email)) {
    throw new ApiError(403, "FORBIDDEN", "Admin access is required");
  }

  return {
    userId,
    email,
  };
}
