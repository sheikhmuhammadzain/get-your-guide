'use client';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProductList from '@/components/ProductList';
import AiAssistant from '@/components/AiAssistant';
import Footer from '@/components/Footer';
import ItineraryGenerator from '@/components/ItineraryGenerator';
import { ArrowUpDown, Info, Sparkles, Map } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const TurkeyMap = dynamic(() => import('@/components/TurkeyMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
      Loading map...
    </div>
  ),
});

export default function Home() {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-geist-sans)] text-[#1a1b1d]">
      <Header />

      <main className="relative">
        <HeroSection />

        <div className="max-w-[1320px] mx-auto px-4 md:px-6 pt-6 pb-20">
          <ItineraryGenerator />

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <h1 className="text-[#1a1b1d] font-bold text-xl md:text-2xl flex items-baseline gap-2">
              <span className="text-gray-500 font-normal">Showing results for:</span>
              <span>Turkey AI Itinerary</span>
            </h1>

            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                <Map className="w-4 h-4" />
                {showMap ? 'Hide Map' : 'Show Map'}
              </button>

              <div className="flex items-center gap-1 text-sm text-[#1a1b1d]">
                <Info className="w-4 h-4" />
                <span className="mr-1">Sort by:</span>
                <span className="font-bold border-b border-dotted border-black cursor-pointer flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  AI Recommended
                </span>
                <ArrowUpDown className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>

          <div className="flex gap-6 relative">
            <div className={`flex-1 transition-all duration-300 ${showMap ? 'w-full md:w-1/2 lg:w-3/5' : 'w-full'}`}>
              <ProductList />
            </div>

            {showMap && (
              <div className="hidden md:block w-1/2 lg:w-2/5 sticky top-[200px] h-[calc(100vh-220px)] rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-gray-100 animate-in fade-in slide-in-from-right-10 duration-300">
                <TurkeyMap />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <AiAssistant />
    </div>
  );
}
