import Link from "next/link";
import PageScaffold from "@/components/PageScaffold";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <PageScaffold
      title="Booking Confirmed"
      description="Your order has been created successfully."
    >
      <div className="rounded-xl border border-green-200 bg-green-50 p-6">
        <p className="text-green-900">
          Confirmation ID: <span className="font-mono font-semibold">{orderId ?? "pending"}</span>
        </p>
        <p className="mt-2 text-sm text-green-800">
          A confirmation email with traveler details and itinerary references has been sent.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/dashboard" className="rounded-full bg-brand px-5 py-2 font-semibold text-white">
            Open Dashboard
          </Link>
          <Link href="/" className="rounded-full border border-gray-300 px-5 py-2 font-semibold text-gray-700">
            Continue Exploring
          </Link>
        </div>
      </div>
    </PageScaffold>
  );
}

