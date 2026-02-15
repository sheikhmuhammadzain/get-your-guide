import { ApiError } from "@/modules/shared/problem";
import { deleteUserById, listUsers, updateUserById } from "@/modules/users/user.repository";

export async function listUsersService(cursor: string | undefined, limit: number) {
  const page = await listUsers(cursor, limit);
  return {
    data: page.data.map((item) => ({
      id: item._id.toString(),
      name: item.name ?? "Unknown",
      email: item.email ?? "",
      image: item.image ?? null,
      emailVerified: item.emailVerified ?? null,
    })),
    nextCursor: page.nextCursor,
  };
}

export async function updateUserService(userId: string, patch: { name?: string; email?: string }) {
  const updated = await updateUserById(userId, patch);
  if (!updated) {
    throw new ApiError(404, "USER_NOT_FOUND", "User not found");
  }

  return {
    id: updated._id.toString(),
    name: updated.name ?? "Unknown",
    email: updated.email ?? "",
    image: updated.image ?? null,
    emailVerified: updated.emailVerified ?? null,
  };
}

export async function deleteUserService(userId: string) {
  const deleted = await deleteUserById(userId);
  if (!deleted) {
    throw new ApiError(404, "USER_NOT_FOUND", "User not found");
  }
}
