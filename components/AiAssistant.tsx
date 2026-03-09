"use client";

import { MessageSquare, X, Send, Bot, ChevronDown, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  ts: number;
}

interface ToolStatus {
  tool: string;
  label: string;
  summary?: string;
  done: boolean;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "assistant-welcome",
  role: "assistant",
  content:
    "Merhaba! I'm your Turkey travel AI — powered by real data.\n\nAsk me to **plan a trip**, **find tours**, **check availability**, or **save an itinerary**.",
  ts: Date.now(),
};

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [toolStatuses, setToolStatuses] = useState<ToolStatus[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const SESSION_KEY = "gyg_assistant_session_id_v1";

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isSending, toolStatuses]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 80);
  }, [isOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) { setSessionId(existing); return; }
    const generated = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    window.localStorage.setItem(SESSION_KEY, generated);
    setSessionId(generated);
  }, []);

  useEffect(() => {
    if (!isOpen || historyLoaded || !sessionId) return;
    const sid = sessionId;
    let cancelled = false;

    async function loadHistory() {
      try {
        const res = await fetch(`/api/v1/assistant/chat?sessionId=${encodeURIComponent(sid)}`, { cache: "no-store" });
        if (res.status === 401 || !res.ok) { setHistoryLoaded(true); return; }
        const payload = (await res.json()) as {
          messages?: Array<{ role: "assistant" | "user"; content: string; createdAt: string }>;
        };
        if (cancelled) return;
        if (!payload.messages?.length) { setMessages([WELCOME_MESSAGE]); setHistoryLoaded(true); return; }
        setMessages(payload.messages.map((m, i) => ({
          id: `${m.role}-${i}-${m.createdAt}`,
          role: m.role,
          content: m.content,
          ts: new Date(m.createdAt).getTime(),
        })));
        setHistoryLoaded(true);
      } catch { if (!cancelled) setHistoryLoaded(true); }
    }

    void loadHistory();
    return () => { cancelled = true; };
  }, [historyLoaded, isOpen, sessionId]);

  function appendToMessage(id: string, delta: string) {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, content: m.content + delta } : m));
  }

  function replaceMessage(id: string, content: string) {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, content } : m));
  }

  function parseSseChunk(chunk: string) {
    let event = "message";
    const dataLines: string[] = [];
    for (const line of chunk.split("\n")) {
      const l = line.replace(/\r$/, "");
      if (l.startsWith(":")) continue;
      if (l.startsWith("event:")) { event = l.slice(6).trim(); continue; }
      if (l.startsWith("data:")) dataLines.push(l.slice(5).trimStart());
    }
    return { event, data: dataLines.join("\n") };
  }

  function findDelimiter(buf: string) {
    const lf = buf.indexOf("\n\n");
    const crlf = buf.indexOf("\r\n\r\n");
    if (lf === -1) return crlf;
    if (crlf === -1) return lf;
    return Math.min(lf, crlf);
  }

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || isSending || !sessionId) return;

    const now = Date.now();
    const userMsg: ChatMessage = { id: `user-${now}`, role: "user", content: trimmed, ts: now };
    const aId = `assistant-${now}`;
    const aPlaceholder: ChatMessage = { id: aId, role: "assistant", content: "", ts: now };
    setMessages((prev) => [...prev, userMsg, aPlaceholder]);
    setToolStatuses([]);
    setInput("");
    setIsSending(true);

    try {
      const res = await fetch("/api/v1/assistant/chat/stream", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId, message: trimmed }),
      });

      if (res.status === 401) {
        replaceMessage(aId, "**Sign in** to use the AI assistant. The itinerary generator works without sign-in.");
        return;
      }
      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let reply = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        while (true) {
          const di = findDelimiter(buf);
          if (di === -1) break;
          const raw = buf.slice(0, di);
          buf = buf.slice(di + (buf.slice(di).startsWith("\r\n\r\n") ? 4 : 2));
          const { event, data } = parseSseChunk(raw);

          if (event === "tool_call") {
            try {
              const p = JSON.parse(data) as { tool: string; label: string };
              setToolStatuses((prev) => [
                ...prev.filter((s) => s.tool !== p.tool),
                { tool: p.tool, label: p.label, done: false },
              ]);
            } catch { /* ignore */ }
            continue;
          }
          if (event === "tool_result") {
            try {
              const p = JSON.parse(data) as { tool: string; summary: string };
              setToolStatuses((prev) =>
                prev.map((s) => s.tool === p.tool ? { ...s, summary: p.summary, done: true } : s),
              );
            } catch { /* ignore */ }
            continue;
          }
          if (event === "token") {
            try {
              const p = JSON.parse(data) as { delta?: string };
              if (p.delta) { reply += p.delta; appendToMessage(aId, p.delta); }
            } catch { /* ignore */ }
            continue;
          }
          if (event === "done") {
            try {
              const p = JSON.parse(data) as { reply?: string };
              if (p.reply) { reply = p.reply; replaceMessage(aId, p.reply); }
            } catch { /* ignore */ }
            setToolStatuses([]);
            continue;
          }
          if (event === "error") {
            try {
              const p = JSON.parse(data) as { message?: string };
              replaceMessage(aId, p.message ?? "Assistant stream failed");
            } catch { replaceMessage(aId, "Assistant stream failed"); }
            setToolStatuses([]);
          }
        }
      }

      if (buf.trim()) {
        const { event, data } = parseSseChunk(buf);
        if (event === "done") {
          try {
            const p = JSON.parse(data) as { reply?: string };
            if (p.reply) { reply = p.reply; replaceMessage(aId, p.reply); }
          } catch { /* ignore */ }
          setToolStatuses([]);
        }
      }

      if (!reply.trim()) replaceMessage(aId, "I could not reach the assistant. Please try again.");
    } catch {
      replaceMessage(aId, "I could not reach the assistant. Please try again.");
      setToolStatuses([]);
    } finally {
      setIsSending(false);
    }
  }

  const lastMsg = messages[messages.length - 1];
  const showStandaloneTyping = isSending && lastMsg?.role === "user";

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {/* Chat window */}
      {isOpen && (
        <div
          className="flex flex-col overflow-hidden rounded-2xl border border-border-default bg-surface-base"
          style={{
            width: "min(96vw, 480px)",
            height: "min(85vh, 680px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header */}
          <div className="relative flex items-center justify-between px-4 py-3 border-b border-border-soft bg-surface-base">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-brand shadow-sm">
                <Bot className="h-4.5 w-4.5 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-surface-base" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary leading-tight">Turkey AI Agent</p>
                <p className="text-[11px] text-text-muted leading-tight">Powered by real-time data</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-text-subtle transition-colors hover:bg-surface-subtle hover:text-text-body"
                aria-label="Minimise"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-text-subtle transition-colors hover:bg-surface-subtle hover:text-text-body"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4"
            style={{ scrollbarWidth: "thin", scrollbarColor: "var(--border-default) transparent" }}
          >
            {messages.map((msg, idx) => {
              const isLast = idx === messages.length - 1;
              return (
                <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  {/* Avatar */}
                  {msg.role === "assistant" && (
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 border border-brand/20">
                      <Bot className="h-3.5 w-3.5 text-brand" />
                    </div>
                  )}

                  <div className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"} max-w-[84%]`}>
                    <div
                      className={
                        msg.role === "user"
                          ? "rounded-2xl rounded-tr-sm bg-brand px-3.5 py-2.5 text-sm text-white shadow-sm"
                          : "rounded-2xl rounded-tl-sm border border-border-soft bg-surface-muted px-3.5 py-2.5 text-sm text-text-body"
                      }
                    >
                      {msg.role === "assistant" ? (
                        msg.content ? (
                          <div className="prose-chat">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        ) : (isLast && isSending) ? (
                          <TypingDots />
                        ) : null
                      ) : (
                        <span>{msg.content}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Tool status chips */}
            {toolStatuses.length > 0 && (
              <div className="flex flex-col gap-1.5 pl-9">
                {toolStatuses.map((s) => <ToolChip key={s.tool} status={s} />)}
              </div>
            )}

            {/* Standalone typing indicator */}
            {showStandaloneTyping && (
              <div className="flex gap-2.5">
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand/10 border border-brand/20">
                  <Bot className="h-3.5 w-3.5 text-brand" />
                </div>
                <div className="rounded-2xl rounded-tl-sm border border-border-soft bg-surface-muted px-3.5 py-2.5">
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border-soft bg-surface-base px-3 pb-3 pt-2.5">
            <div className="flex items-center gap-2 rounded-xl border border-border-default bg-surface-subtle px-3 py-2 transition-all focus-within:border-brand/50 focus-within:bg-surface-base focus-within:ring-2 focus-within:ring-brand/10">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void sendMessage(); }
                }}
                placeholder="Ask about tours, itineraries, tips…"
                disabled={isSending}
                className="flex-1 bg-transparent text-sm text-text-body placeholder:text-text-subtle focus:outline-none disabled:opacity-60"
              />
              <button
                disabled={isSending || !input.trim()}
                onClick={() => void sendMessage()}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand text-white transition-all hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send"
              >
                {isSending
                  ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  : <Send className="h-3.5 w-3.5" />}
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-text-subtle">
              Calls real tools · Saves itineraries · Checks live availability
            </p>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-all hover:bg-brand-hover hover:shadow-xl active:scale-95"
        aria-label={isOpen ? "Close assistant" : "Open assistant"}
      >
        {isOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <>
            <MessageSquare className="h-5 w-5 fill-current" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-surface-base">
              <Sparkles className="h-2.5 w-2.5 text-white" />
            </span>
          </>
        )}
      </button>
    </div>
  );
}

function ToolChip({ status }: { status: ToolStatus }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 self-start rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-300 ${
        status.done
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800"
          : "bg-brand/8 text-brand border border-brand/15"
      }`}
    >
      {status.done
        ? <CheckCircle2 className="h-3 w-3 shrink-0" />
        : <Loader2 className="h-3 w-3 shrink-0 animate-spin" />}
      <span>{status.done && status.summary ? status.summary : status.label}</span>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-text-subtle animate-bounce"
          style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }}
        />
      ))}
    </span>
  );
}
