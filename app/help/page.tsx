import FeedbackForm from "@/components/FeedbackForm";
import PageScaffold from "@/components/PageScaffold";

export default function HelpPage() {
  return (
    <PageScaffold
      title="Help Center"
      description="Support resources for planning and booking your Turkey travel."
    >
      <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-700">
        <p>
          For itinerary issues, account access, or API-related travel data problems, contact
          support@getyourguide.local and include your itinerary ID.
        </p>
      </div>
      <FeedbackForm />
    </PageScaffold>
  );
}
