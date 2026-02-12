
'use client';

import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FilterBar from '@/components/FilterBar';
import ProductList from '@/components/ProductList';
import AiAssistant from '@/components/AiAssistant';
import Footer from '@/components/Footer';
import ItineraryGenerator from '@/components/ItineraryGenerator';
import { ArrowUpDown, Info, Sparkles, Map } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
   const [showMap, setShowMap] = useState(false);

   return (
      <div className="min-h-screen bg-white font-[family-name:var(--font-geist-sans)] text-[#1a1b1d]">
         <Header />

         <main className="relative">
            <HeroSection />

            {/* <FilterBar />  - Temporarily commented out as per visual design request */}

            <div className="max-w-[1320px] mx-auto px-4 md:px-6 pt-6 pb-20">

               {/* AI Generator Section - Keeping existing functionality below visual hero */}
               <ItineraryGenerator />

               {/* Results Header */}
               <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                  <h1 className="text-[#1a1b1d] font-bold text-xl md:text-2xl flex items-baseline gap-2">
                     <span className="text-gray-500 font-normal">Showing results for:</span>
                     <span>Turkey AI Itinerary</span>
                  </h1>

                  <div className="flex items-center gap-4 md:gap-6">
                     {/* Map Toggle */}
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
                  {/* Product Grid */}
                  <div className={`flex-1 transition-all duration-300 ${showMap ? 'w-full md:w-1/2 lg:w-3/5' : 'w-full'}`}>
                     <ProductList />
                  </div>

                  {/* Map Placeholder */}
                  {showMap && (
                     <div className="hidden md:block w-1/2 lg:w-2/5 sticky top-[200px] h-[calc(100vh-220px)] rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-gray-100 animate-in fade-in slide-in-from-right-10 duration-300">
                        <div className="w-full h-full relative">
                           <img
                              src="https://picsum.photos/seed/map/800/1000"
                              alt="Map of Turkey"
                              className="w-full h-full object-cover filter brightness-[0.85] grayscale-[0.2]"
                           />
                           <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                              <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg font-bold text-gray-800 flex items-center gap-2">
                                 <Map className="w-5 h-5 text-blue-600" />
                                 Interactive Map View
                              </div>
                           </div>

                           {/* Fake Pins */}
                           <div className="absolute top-1/4 left-1/3 p-2 bg-white rounded-lg shadow-md hover:scale-110 transition-transform cursor-pointer">
                              <div className="font-bold text-xs">€150</div>
                           </div>
                           <div className="absolute top-1/2 right-1/4 p-2 bg-white rounded-lg shadow-md hover:scale-110 transition-transform cursor-pointer">
                              <div className="font-bold text-xs">€45</div>
                           </div>
                           <div className="absolute bottom-1/3 left-1/4 p-2 bg-white rounded-lg shadow-md hover:scale-110 transition-transform cursor-pointer">
                              <div className="font-bold text-xs">€60</div>
                           </div>
                        </div>
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
