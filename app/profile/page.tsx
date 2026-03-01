import Link from "next/link";
import PageScaffold from "@/components/PageScaffold";
import { getAuthSession } from "@/lib/auth/get-session";

export default async function ProfilePage() {
  const session = await getAuthSession();
  const user = session?.user;

  return (
    <PageScaffold
      title="Profile"
      description="Manage account access and review your travel planning activity."
    >
      {!user?.id ? (
        <div className="rounded-xl border border-border-default bg-surface-subtle p-6">
          <p className="text-text-body">You are not signed in.</p>
          <Link
            href="/auth/signin"
            className="mt-4 inline-flex rounded-full bg-brand px-5 py-2 font-semibold text-white"
          >
            Sign In
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-border-default bg-surface-base p-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-text-muted">Name</dt>
              <dd className="font-semibold">{user.name ?? "Not set"}</dd>
            </div>
            <div>
              <dt className="text-sm text-text-muted">Email</dt>
              <dd className="font-semibold">{user.email ?? "Not set"}</dd>
            </div>
            <div>
              <dt className="text-sm text-text-muted">User ID</dt>
              <dd className="font-mono text-xs">{user.id}</dd>
            </div>
          </dl>
          <Link href="/dashboard" className="mt-5 inline-flex rounded-full border border-border-default px-5 py-2 font-semibold text-text-body">
            View Dashboard
          </Link>
        </div>
      )}
    </PageScaffold>
  );
}

