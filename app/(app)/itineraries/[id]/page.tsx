import Link from "next/link";
import {
  MapPin,
  Clock,
  Banknote,
  Navigation,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import ItineraryDetailClient from "@/components/ItineraryDetailClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAuthSession } from "@/lib/auth/get-session";
import { itineraryTitle, parseGeneratedItinerary } from "@/modules/itineraries/presenter";
import { getItineraryService } from "@/modules/itineraries/itinerary.service";
import { getAttractionsByIds } from "@/modules/attractions/attraction.repository";

export default async function ItineraryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return (
      <Shell title="Sign In Required">
        <div className="flex flex-col items-center py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-subtle">
            <CalendarDays className="h-6 w-6 text-text-muted" />
          </div>
          <h2 className="text-lg font-bold text-text-primary">Sign in to view your itinerary</h2>
          <p className="mt-1 text-sm text-text-muted">You need to be signed in to manage saved itineraries.</p>
          <Link href="/auth/signin" className="mt-5 inline-flex rounded-full bg-brand px-6 py-2.5 font-semibold text-white">
            Sign In
          </Link>
        </div>
      </Shell>
    );
  }

  let itinerary: Awaited<ReturnType<typeof getItineraryService>> | null = null;
  try {
    itinerary = await getItineraryService(session.user.id, id);
  } catch {
    itinerary = null;
  }

  if (!itinerary) {
    return (
      <Shell title="Not Found">
        <div className="flex flex-col items-center py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-subtle">
            <CalendarDays className="h-6 w-6 text-text-muted" />
          </div>
          <h2 className="text-lg font-bold text-text-primary">Itinerary not found</h2>
          <p className="mt-1 text-sm text-text-muted">This itinerary does not exist or you don&apos;t have access.</p>
          <Link href="/dashboard" className="mt-5 inline-flex rounded-full bg-brand px-6 py-2.5 font-semibold text-white">
            Back to Dashboard
          </Link>
        </div>
      </Shell>
    );
  }

  const generatedPlan = parseGeneratedItinerary(itinerary.generatedPlan);

  /* Resolve attraction IDs → names */
  const allAttractionIds = generatedPlan?.days.flatMap((d) => d.items.map((i) => i.attractionId)) ?? [];
  const attractionMap = allAttractionIds.length > 0
    ? await getAttractionsByIds(allAttractionIds)
    : new Map<string, { name: string; description: string; tags: string[]; avgDurationMin: number }>();

  /* Serialize attraction data for the page */
  const attractionLookup: Record<string, { name: string; description: string; tags: string[]; avgDurationMin: number }> = {};
  for (const [aid, doc] of attractionMap.entries()) {
    attractionLookup[aid] = {
      name: doc.name,
      description: doc.description,
      tags: doc.tags,
      avgDurationMin: doc.avgDurationMin,
    };
  }

  const title = itineraryTitle(itinerary.generatedPlan, "Itinerary Detail");

  return (
    <Shell title={title}>
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center gap-1.5 text-xs text-text-muted">
          <li><Link href="/" className="hover:text-brand transition-colors">Home</Link></li>
          <ChevronRight className="h-3 w-3" />
          <li><Link href="/dashboard" className="hover:text-brand transition-colors">Dashboard</Link></li>
          <ChevronRight className="h-3 w-3" />
          <li className="font-medium text-text-body">Itinerary</li>
        </ol>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        <p className="mt-1 text-sm text-text-muted">Review your daily plan, explore activities, and manage your trip.</p>
      </div>

      {generatedPlan ? (
        <>
          {/* Summary bar */}
          <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-border-soft bg-surface-base p-4">
            <div className="flex items-center gap-2 text-sm text-text-body">
              <CalendarDays className="h-4 w-4 text-brand" />
              <span className="font-semibold">{generatedPlan.days.length}</span> days
            </div>
            <div className="h-4 w-px bg-border-default" />
            <div className="flex items-center gap-2 text-sm text-text-body">
              <MapPin className="h-4 w-4 text-brand" />
              {generatedPlan.cityOrder.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(" → ")}
            </div>
            <div className="h-4 w-px bg-border-default" />
            <div className="flex items-center gap-2 text-sm text-text-body">
              <Banknote className="h-4 w-4 text-brand" />
              <span className="font-semibold">{generatedPlan.totalEstimatedCostTRY.toLocaleString()}</span> TRY estimated
            </div>
          </div>

          {/* Day-by-day timeline */}
          <div className="space-y-6">
            {generatedPlan.days.map((day) => (
              <section
                key={day.day}
                className="rounded-2xl border border-border-soft bg-surface-base overflow-hidden"
              >
                {/* Day header */}
                <div className="flex items-center gap-3 border-b border-border-subtle bg-surface-subtle px-5 py-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                    {day.day}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">
                      Day {day.day} — {day.city.charAt(0).toUpperCase() + day.city.slice(1)}
                    </h3>
                    <p className="text-[11px] text-text-muted">
                      {day.items.length} {day.items.length === 1 ? "activity" : "activities"}
                    </p>
                  </div>
                </div>

                {/* Activities */}
                <div className="divide-y divide-border-subtle">
                  {day.items.length === 0 ? (
                    <p className="px-5 py-4 text-sm text-text-muted italic">
                      No activities planned — this is a free / rest day.
                    </p>
                  ) : (
                    day.items.map((item, idx) => {
                      const attraction = attractionLookup[item.attractionId];
                      return (
                        <div key={idx} className="flex gap-4 px-5 py-4">
                          {/* Time column */}
                          <div className="flex w-20 shrink-0 flex-col items-center">
                            <span className="text-sm font-bold text-text-primary">{item.startTime}</span>
                            <div className="my-1 h-5 w-px bg-border-default" />
                            <span className="text-xs text-text-muted">{item.endTime}</span>
                          </div>

                          {/* Activity details */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-text-primary leading-snug">
                              {attraction?.name ?? `Attraction ${item.attractionId.slice(-6)}`}
                            </h4>
                            {attraction?.description && (
                              <p className="mt-1 text-xs text-text-muted leading-relaxed line-clamp-2">
                                {attraction.description}
                              </p>
                            )}

                            {/* Meta chips */}
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              {attraction?.avgDurationMin && (
                                <span className="inline-flex items-center gap-1 rounded-lg bg-surface-subtle px-2 py-0.5 text-[10px] font-medium text-text-body">
                                  <Clock className="h-3 w-3 text-brand" />
                                  {attraction.avgDurationMin} min
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1 rounded-lg bg-surface-subtle px-2 py-0.5 text-[10px] font-medium text-text-body">
                                <Banknote className="h-3 w-3 text-brand" />
                                {item.costEstimateTRY.toLocaleString()} TRY
                              </span>
                              {item.transportHint && (
                                <span className="inline-flex items-center gap-1 rounded-lg bg-surface-subtle px-2 py-0.5 text-[10px] font-medium text-text-body">
                                  <Navigation className="h-3 w-3 text-brand" />
                                  {item.transportHint}
                                </span>
                              )}
                            </div>

                            {/* Tags */}
                            {attraction?.tags && attraction.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {attraction.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="rounded-full border border-border-subtle px-2 py-0.5 text-[10px] text-text-muted"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Day notes */}
                {day.notes.length > 0 && (
                  <div className="border-t border-border-subtle bg-surface-muted px-5 py-3">
                    <p className="text-[11px] font-medium text-text-subtle">
                      💡 {day.notes.join(" · ")}
                    </p>
                  </div>
                )}
              </section>
            ))}
          </div>
        </>
      ) : (
        <div className="mb-6 rounded-2xl border border-border-soft bg-surface-subtle p-6 text-center">
          <p className="text-sm text-text-muted">No generated plan data found for this itinerary.</p>
        </div>
      )}

      {/* Notes / Status / Actions */}
      <div className="mt-8">
        <ItineraryDetailClient itinerary={itinerary} generatedPlan={generatedPlan} />
      </div>
    </Shell>
  );
}

/* Shell wrapper */
function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-text-heading transition-colors">
      <Header />
      <main className="mx-auto max-w-[900px] px-4 py-10 md:px-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}
