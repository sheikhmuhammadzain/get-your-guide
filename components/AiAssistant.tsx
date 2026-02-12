
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-200">
          {/* Header */}
          <div className="bg-[#0071eb] p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Turkey AI Agent</h3>
                <p className="text-[11px] opacity-90">Online • Replies instantly</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 bg-gray-50 p-4 overflow-y-auto flex flex-col gap-4">
            <div className="flex gap-2 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200">
                <Sparkles className="w-4 h-4 text-[#0071eb]" />
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm text-sm text-gray-700">
                Merhaba! 👋 I&apos;m your AI travel assistant for Turkey. How can I help you plan your trip today?
              </div>
            </div>
            
            <div className="flex gap-2 max-w-[85%] self-end flex-row-reverse">
               <div className="bg-[#0071eb] text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-sm">
                 I need a 3-day itinerary for Cappadocia.
               </div>
            </div>

            <div className="flex gap-2 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200">
                <Sparkles className="w-4 h-4 text-[#0071eb]" />
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm text-sm text-gray-700">
                <p className="mb-2">Great choice! Here is a suggested 3-day plan:</p>
                <ul className="list-disc pl-4 space-y-1 mb-2">
                   <li><strong>Day 1:</strong> Hot Air Balloon & Open Air Museum</li>
                   <li><strong>Day 2:</strong> Underground City & Ihlara Valley</li>
                   <li><strong>Day 3:</strong> Pottery Workshop & Sunset ATV Tour</li>
                </ul>
                <p>Would you like to see available tours for these?</p>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="relative flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Ask anything about Turkey..." 
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#0071eb] text-white rounded-lg hover:bg-[#005fb8] transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 bg-[#0071eb] hover:bg-[#005fb8] text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group relative"
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <MessageSquare className="w-7 h-7 fill-current" />
        )}
        {!isOpen && (
            <span className="absolute top-0 right-0 -mr-1 -mt-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
        )}
      </button>
    </div>
  );
}
