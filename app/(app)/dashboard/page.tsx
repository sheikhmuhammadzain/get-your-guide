import Link from "next/link";
import PageScaffold from "@/components/PageScaffold";
import { getAuthSession } from "@/lib/auth/get-session";
import { isAdminSession } from "@/modules/auth/guards";
import { itineraryTitle, parseGeneratedItinerary } from "@/modules/itineraries/presenter";
import { listItinerariesService } from "@/modules/itineraries/itinerary.service";
import { listUserOrdersService } from "@/modules/orders/order.service";

export default async function DashboardPage() {
  const session = await getAuthSession();
  const userId = session?.user?.id;
  const admin = userId ? await isAdminSession() : false;

  const data = userId
    ? await Promise.all([
        listItinerariesService(userId, undefined, 20),
        listUserOrdersService(userId, undefined, 5),
      ])
    : null;

  return (
    <PageScaffold title="Dashboard" description="Review and manage your saved itineraries.">
      {!session?.user?.id ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
          <p className="mb-4">Sign in to view your saved trips.</p>
          <Link
            className="inline-flex items-center rounded-full bg-[#0071eb] px-5 py-2 text-white font-semibold"
            href="/auth/signin"
          >
            Sign In
          </Link>
        </div>
      ) : (
        <DashboardContent
          itineraries={data?.[0] ?? { data: [], nextCursor: null }}
          orders={data?.[1] ?? { data: [], nextCursor: null }}
          isAdmin={admin}
        />
      )}
    </PageScaffold>
  );
}

function DashboardContent({
  itineraries,
  orders,
  isAdmin,
}: {
  itineraries: Awaited<ReturnType<typeof listItinerariesService>>;
  orders: Awaited<ReturnType<typeof listUserOrdersService>>;
  isAdmin: boolean;
}) {
  if (itineraries.data.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
        <p className="mb-3">No saved itineraries yet.</p>
        <Link href="/planner" className="inline-flex rounded-full bg-[#0071eb] px-5 py-2 font-semibold text-white">
          Create itinerary
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-3">
        <Link href="/user" className="inline-flex rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">
          Open User Panel
        </Link>
        {isAdmin ? (
          <Link href="/admin" className="inline-flex rounded-full bg-[#0071eb] px-4 py-2 text-sm font-semibold text-white">
            Open Admin Panel
          </Link>
        ) : null}
      </div>

      {orders.data.length > 0 ? (
        <section className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-3 text-lg font-semibold">Recent Orders</h2>
          <div className="space-y-2">
            {orders.data.map((order) => (
              <div key={order.id} className="rounded-lg border border-gray-100 p-3 text-sm">
                <p className="font-medium">{order.orderCode}</p>
                <p className="text-gray-600">
                  {order.total} {order.currency} â€¢ {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {itineraries.data.map((itinerary) => {
        const parsed = parseGeneratedItinerary(itinerary.generatedPlan);
        return (
          <article key={itinerary.id} className="rounded-xl border border-gray-200 p-5">
            <h2 className="font-bold mb-2">{itineraryTitle(itinerary.generatedPlan, "Trip")}</h2>
            <p className="text-sm text-gray-500 mb-2">
              Status: {itinerary.status} â€¢ Updated: {new Date(itinerary.updatedAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">{itinerary.notes || "No notes"}</p>
            {parsed ? (
              <p className="text-xs text-gray-500 mb-3">
                {parsed.days.length} days â€¢ {parsed.totalEstimatedCostTRY} TRY
              </p>
            ) : null}
            <Link
              href={`/itineraries/${itinerary.id}`}
              className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700"
            >
              Open itinerary
            </Link>
          </article>
        );
        })}
      </div>
    </>
  );
}
