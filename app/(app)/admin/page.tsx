import Link from "next/link";
import AdminPanelClient from "@/components/admin/AdminPanelClient";
import PageScaffold from "@/components/PageScaffold";
import {
  getAdminOverviewService,
  listAdminFeedbackService,
  listAdminItinerariesService,
  listAdminOrdersService,
  listAdminUsersService,
} from "@/modules/admin/admin.service";
import { requireAdmin } from "@/modules/auth/guards";

export default async function AdminPanelPage() {
  try {
    await requireAdmin();
  } catch {
    return (
      <PageScaffold title="Admin Panel" description="Administrator access only.">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="mb-3 text-red-900">You do not have permission to view this page.</p>
          <Link
            href="/"
            className="inline-flex rounded-full border border-red-300 px-5 py-2 text-sm font-semibold text-red-800"
          >
            Return Home
          </Link>
        </div>
      </PageScaffold>
    );
  }

  const [overview, users, orders, itineraries, feedback] = await Promise.all([
    getAdminOverviewService(),
    listAdminUsersService(undefined, 50),
    listAdminOrdersService(undefined, 50),
    listAdminItinerariesService(undefined, 50),
    listAdminFeedbackService(undefined, 50),
  ]);

  return (
    <PageScaffold title="Admin Panel" description="Professional operations console with CRUD workflows.">
      <AdminPanelClient
        overview={overview}
        users={users}
        orders={orders}
        itineraries={itineraries}
        feedback={feedback}
      />
    </PageScaffold>
  );
}
