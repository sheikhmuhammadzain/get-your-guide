import Link from "next/link";
import PageScaffold from "@/components/PageScaffold";
import { getAuthSession } from "@/lib/auth/get-session";
import { formatUtcDateTime } from "@/lib/format/date";
import { listItinerariesService } from "@/modules/itineraries/itinerary.service";
import { itineraryTitle, parseGeneratedItinerary } from "@/modules/itineraries/presenter";

export default async function ItinerariesPage() {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return (
      <PageScaffold
        title="My Itineraries"
        description="Access saved itineraries and continue trip planning."
      >
        <div className="rounded-xl border border-border-default bg-surface-muted p-6">
          <p className="mb-4">Sign in to view your itineraries.</p>
          <Link
            href="/auth/signin"
            className="inline-flex rounded-full bg-brand px-5 py-2 font-semibold text-white"
          >
            Sign In
          </Link>
        </div>
      </PageScaffold>
    );
  }

  const page = await listItinerariesService(session.user.id, undefined, 50);

  return (
    <PageScaffold
      title="My Itineraries"
      description="Your saved plans with quick access to detail and editing."
    >
      {page.data.length === 0 ? (
        <div className="rounded-xl border border-border-default bg-surface-muted p-6">
          <p className="mb-3">No itineraries saved yet.</p>
          <Link href="/planner" className="inline-flex rounded-full bg-brand px-5 py-2 font-semibold text-white">
            Generate First Itinerary
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {page.data.map((item) => {
            const parsed = parseGeneratedItinerary(item.generatedPlan);
            return (
              <article key={item.id} className="rounded-xl border border-border-default bg-surface-base p-5">
                <h2 className="font-semibold">{itineraryTitle(item.generatedPlan, "Turkey trip")}</h2>
                <p className="mt-1 text-sm text-text-body">
                  Status: {item.status} • Updated: {formatUtcDateTime(item.updatedAt)}
                </p>
                {parsed ? (
                  <p className="mt-2 text-sm text-text-body">
                    {parsed.days.length} days • {parsed.cityOrder.join(" -> ")} • {parsed.totalEstimatedCostTRY} TRY
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-text-body">Stored itinerary data available.</p>
                )}
                <div className="mt-4">
                  <Link
                    href={`/itineraries/${item.id}`}
                    className="inline-flex rounded-full border border-border-strong px-4 py-2 text-sm font-semibold text-text-body"
                  >
                    Open Detail
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </PageScaffold>
  );
}
