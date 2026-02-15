import Link from "next/link";
import PageScaffold from "@/components/PageScaffold";
import { getAdminOverviewService, listAdminItinerariesService, listAdminOrdersService, listAdminUsersService } from "@/modules/admin/admin.service";
import { requireAdmin } from "@/modules/auth/guards";
import { itineraryTitle } from "@/modules/itineraries/presenter";

export default async function AdminPanelPage() {
  try {
    await requireAdmin();
  } catch {
    return (
      <PageScaffold title="Admin Panel" description="Administrator access only.">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="mb-3 text-red-900">You do not have permission to view this page.</p>
          <Link href="/" className="inline-flex rounded-full border border-red-300 px-5 py-2 text-sm font-semibold text-red-800">
            Return Home
          </Link>
        </div>
      </PageScaffold>
    );
  }

  const [overview, users, orders, itineraries] = await Promise.all([
    getAdminOverviewService(),
    listAdminUsersService(undefined, 10),
    listAdminOrdersService(undefined, 10),
    listAdminItinerariesService(undefined, 10),
  ]);

  return (
    <PageScaffold title="Admin Panel" description="System-wide operations, users, orders, and itinerary monitoring.">
      <section className="mb-6 grid gap-4 md:grid-cols-5">
        <MetricCard label="Users" value={String(overview.totals.users)} />
        <MetricCard label="Itineraries" value={String(overview.totals.itineraries)} />
        <MetricCard label="Orders" value={String(overview.totals.orders)} />
        <MetricCard label="Feedback" value={String(overview.totals.feedback)} />
        <MetricCard label="Recent Revenue" value={`${overview.totals.recentRevenue} EUR`} />
      </section>

      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold">Users</h2>
        <div className="space-y-2">
          {users.data.map((user) => (
            <div key={user.id} className="rounded-lg border border-gray-100 p-3 text-sm">
              <p className="font-medium">{user.name}</p>
              <p className="text-gray-600">{user.email}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold">Orders</h2>
        <div className="space-y-2">
          {orders.data.map((order) => (
            <div key={order.id} className="rounded-lg border border-gray-100 p-3 text-sm">
              <p className="font-medium">
                {order.orderCode} • {order.status}
              </p>
              <p className="text-gray-600">
                {order.total} {order.currency} • {order.customer.email}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold">Itineraries</h2>
        <div className="space-y-2">
          {itineraries.data.map((item) => (
            <div key={item.id} className="rounded-lg border border-gray-100 p-3 text-sm">
              <p className="font-medium">{itineraryTitle(item.generatedPlan, "Trip")}</p>
              <p className="text-gray-600">
                {item.status} • user: {item.userId} • updated: {new Date(item.updatedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold">Recent Feedback</h2>
        {overview.recentFeedback.length === 0 ? (
          <p className="text-sm text-gray-600">No feedback received yet.</p>
        ) : (
          <div className="space-y-2">
            {overview.recentFeedback.map((item) => (
              <article key={item.id} className="rounded-lg border border-gray-100 p-3 text-sm">
                <p className="font-medium">
                  {item.category} {item.rating ? `• ${item.rating}/5` : ""}
                </p>
                <p className="text-gray-600">
                  {item.email ?? "Anonymous"} • {new Date(item.createdAt).toLocaleString()}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </PageScaffold>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs uppercase text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
