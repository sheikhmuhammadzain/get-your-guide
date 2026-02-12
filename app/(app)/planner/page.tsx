import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ItineraryGenerator from "@/components/ItineraryGenerator";

export default function PlannerPage() {
  return (
    <div className="min-h-screen bg-white text-[#1a1b1d]">
      <Header />
      <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Plan Your Turkey Trip</h1>
        <p className="text-gray-600 mb-8">
          Generate a personalized itinerary, then save it to your account.
        </p>
        <ItineraryGenerator />
      </main>
      <Footer />
    </div>
  );
}
