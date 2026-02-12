import { listUsers } from "@/modules/users/user.repository";

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
