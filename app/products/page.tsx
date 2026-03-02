import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductsPageClient from "@/components/ProductsPageClient";

export const metadata = {
  title: "All Experiences — Smart Trip AI",
  description:
    "Browse all tours and activities in Turkey. Filter by city, category, and sort by price or rating.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; category?: string }>;
}) {
  const { city, category } = await searchParams;

  return (
    <div className="min-h-screen bg-surface-muted text-text-heading">
      <Header />
      <main className="mx-auto max-w-300 px-4 py-10 md:px-6">
        <ProductsPageClient initialCity={city} initialCategory={category} />
      </main>
      <Footer />
    </div>
  );
}
