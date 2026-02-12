import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAuthSession } from "@/lib/auth/get-session";
import { listItinerariesService } from "@/modules/itineraries/itinerary.service";

export default async function DashboardPage() {
  const session = await getAuthSession();

  return (
    <div className="min-h-screen bg-white text-[#1a1b1d]">
      <Header />
      <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8">Review your saved itineraries.</p>

        {!session?.user?.id ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
            <p className="mb-4">Sign in to view your saved trips.</p>
            <Link
              className="inline-flex items-center rounded-full bg-[#0071eb] px-5 py-2 text-white font-semibold"
              href="/api/auth/signin"
            >
              Sign In
            </Link>
          </div>
        ) : (
          <DashboardList userId={session.user.id} />
        )}
      </main>
      <Footer />
    </div>
  );
}

async function DashboardList({ userId }: { userId: string }) {
  const page = await listItinerariesService(userId, undefined, 20);

  if (page.data.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
        <p>No saved itineraries yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {page.data.map((itinerary) => (
        <article key={itinerary.id} className="rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold mb-2">{String((itinerary.generatedPlan as { title?: string })?.title ?? "Trip")}</h2>
          <p className="text-sm text-gray-500 mb-3">Status: {itinerary.status}</p>
          <p className="text-sm text-gray-600 line-clamp-3">{itinerary.notes || "No notes"}</p>
        </article>
      ))}
    </div>
  );
}
