
import { Sparkles, Calendar, MapPin, DollarSign, Clock } from 'lucide-react';

export default function ItineraryGenerator() {
  return (
    <div className="w-full bg-blue-50/50 p-6 md:p-8 rounded-2xl border border-blue-100 shadow-lg mb-8">
       <div className="flex items-center gap-4 mb-6">
         <div className="p-2.5 bg-[#0071eb] text-white rounded-xl shadow-md">
            <Sparkles className="w-6 h-6" />
         </div>
         <div>
            <h2 className="text-xl md:text-2xl font-bold text-[#1a1b1d]">AI Itinerary Planner</h2>
            <p className="text-sm text-gray-500">Plan your perfect trip to Turkey in seconds</p>
         </div>
       </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Destination */}
          <div className="relative">
             <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Where to?</label>
             <div className="relative group">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                <select className="w-full h-12 pl-11 pr-4 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-700 outline-none appearance-none cursor-pointer text-sm font-medium">
                   <option value="">Select Destination...</option>
                   <option value="cappadocia">Cappadocia</option>
                   <option value="istanbul">Istanbul</option>
                   <option value="ephesus">Ephesus</option>
                   <option value="pamukkale">Pamukkale</option>
                   <option value="antalya">Antalya</option>
                   <option value="bodrum">Bodrum</option>
                </select>
             </div>
          </div>

          {/* Duration */}
          <div className="relative">
             <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">How long?</label>
             <div className="relative group">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                <select className="w-full h-12 pl-11 pr-4 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-700 outline-none appearance-none cursor-pointer text-sm font-medium">
                   <option value="">Duration...</option>
                   <option value="1-3">1-3 Days</option>
                   <option value="4-7">4-7 Days</option>
                   <option value="8-14">8-14 Days</option>
                   <option value="15+">15+ Days</option>
                </select>
             </div>
          </div>

          {/* Interest */}
          <div className="relative">
             <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Interest</label>
             <div className="relative group">
                <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                <select className="w-full h-12 pl-11 pr-4 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-700 outline-none appearance-none cursor-pointer text-sm font-medium">
                   <option value="">Primary Interest...</option>
                   <option value="culture">Culture & History</option>
                   <option value="adventure">Adventure</option>
                   <option value="food">Food & Culinary</option>
                   <option value="nature">Nature & Scenic</option>
                   <option value="relax">Relaxation</option>
                </select>
             </div>
          </div>

          {/* Budget */}
          <div className="relative">
             <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Budget</label>
             <div className="relative group">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                <select className="w-full h-12 pl-11 pr-4 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-gray-700 outline-none appearance-none cursor-pointer text-sm font-medium">
                   <option value="">Budget Level...</option>
                   <option value="budget">Budget Friendly</option>
                   <option value="standard">Standard</option>
                   <option value="luxury">Luxury</option>
                </select>
             </div>
          </div>

       </div>

       <div className="mt-6 flex justify-end">
          <button className="bg-[#0071eb] hover:bg-[#005fb8] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 transform active:scale-95 duration-100">
             <Sparkles className="w-5 h-5 fill-current animate-pulse" />
             Generate My Itinerary
          </button>
       </div>
    </div>
  );
}
