"use client";

import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Merhaba. I am your Turkey travel assistant. Tell me destination, days, and budget and I will tailor your plan.",
    },
  ]);

  const sessionId = useMemo(() => `session-${Date.now()}`, []);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || isSending) {
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/v1/assistant/chat", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          message: trimmed,
        }),
      });

      if (response.status === 401) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sign in to use the persistent AI assistant. You can still use the itinerary generator without sign-in.",
          },
        ]);
        return;
      }

      const body = (await response.json()) as { reply?: string; detail?: string };
      if (!response.ok || !body.reply) {
        throw new Error(body.detail ?? "Assistant failed to respond");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: body.reply ?? "" }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I could not reach the assistant endpoint. Please try again.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <div className="w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-200">
          <div className="bg-[#0071eb] p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Turkey AI Agent</h3>
                <p className="text-[11px] opacity-90">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 bg-gray-50 p-4 overflow-y-auto flex flex-col gap-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={
                  message.role === "assistant"
                    ? "flex gap-2 max-w-[85%]"
                    : "flex gap-2 max-w-[85%] self-end flex-row-reverse"
                }
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200">
                    <Sparkles className="w-4 h-4 text-[#0071eb]" />
                  </div>
                )}
                <div
                  className={
                    message.role === "assistant"
                      ? "bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm text-sm text-gray-700"
                      : "bg-[#0071eb] text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-sm"
                  }
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-white border-t border-gray-100">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder="Ask anything about Turkey..."
                className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm"
              />
              <button
                disabled={isSending}
                onClick={() => void sendMessage()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#0071eb] text-white rounded-lg hover:bg-[#005fb8] transition-colors disabled:opacity-70"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-14 w-14 bg-[#0071eb] hover:bg-[#005fb8] text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group relative"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7 fill-current" />}
      </button>
    </div>
  );
}
