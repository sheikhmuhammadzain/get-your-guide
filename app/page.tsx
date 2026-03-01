import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import LandingInteractiveSection from '@/components/LandingInteractiveSection';
import AiAssistantLazy from '@/components/AiAssistantLazy';

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-text-heading transition-colors">
      <Header />

      <main className="relative">
        <HeroSection />

        <div className="max-w-[1320px] mx-auto px-4 md:px-6 pt-6 pb-20">
          <LandingInteractiveSection />
        </div>
      </main>

      <Footer />
      <AiAssistantLazy />
    </div>
  );
}
