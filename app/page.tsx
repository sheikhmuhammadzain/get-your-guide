import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import LandingInteractiveSection from '@/components/LandingInteractiveSection';
import AiAssistantLazy from '@/components/AiAssistantLazy';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; destination?: string }>;
}) {
  const queryParams = await searchParams;
  const searchQuery = (queryParams.q ?? queryParams.destination ?? '').trim();

  return (
    <div className="min-h-screen bg-white font-sans text-text-heading">
      <Header />

      <main className="relative">
        <HeroSection />

        <div className="max-w-[1320px] mx-auto px-4 md:px-6 pt-6 pb-20">
          <LandingInteractiveSection searchQuery={searchQuery} />
        </div>
      </main>

      <Footer />
      <AiAssistantLazy />
    </div>
  );
}
