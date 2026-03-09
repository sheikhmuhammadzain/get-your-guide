import type OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { logger } from "@/lib/observability/logger";
import { getOpenAIClient } from "@/modules/ai/openai-client";
import { agentTools, TOOL_LABELS } from "@/modules/ai/tools/definitions";
import { executeTool, getToolResultSummary, type ToolContext } from "@/modules/ai/tools/executor";

const MAX_TOOL_ITERATIONS = 4;
// Keep history short to reduce prompt tokens → lower latency
const MAX_HISTORY_TURNS = 16;
// Compact tool result payloads to avoid blowing the context window
const MAX_TOOL_RESULT_CHARS = 4000;

export interface AgentStreamCallbacks {
  onToolCall: (name: string, label: string, args: unknown) => void | Promise<void>;
  onToolResult: (name: string, summary: string) => void | Promise<void>;
  onToken: (delta: string) => void | Promise<void>;
}

function getAgentModel(): string | null {
  return process.env.AGENT_MODEL || process.env.OPENROUTER_MODEL || null;
}

function buildSystemPrompt(ctx: ToolContext): string {
  const today = new Date().toISOString().split("T")[0];
  const signedIn = Boolean(ctx.userId);
  return [
    "You are a professional Turkey travel assistant for Smart Trip AI.",
    `Today: ${today}.`,
    "Always call tools for real data — never invent product IDs, prices, or availability.",

    // Product & discovery
    "Tours/activities → search_products (can filter by location, category, max_price).",
    "Product details → get_product_details. Slot availability → check_product_availability.",

    // Attractions
    "Landmarks/museums/sites → search_attractions or get_attraction_details (by slug).",

    // Itinerary
    "Day-by-day plan → generate_itinerary, then offer to save_itinerary.",
    signedIn
      ? "User is signed in — save_itinerary, list_itineraries, get_itinerary, update_itinerary, delete_itinerary are all available."
      : "User is NOT signed in — itinerary CRUD (save/list/get/update/delete) tools will return an auth error.",

    // Info
    "Currency conversion → get_exchange_rate. Travel tips / city guides / food / safety → get_turkey_travel_info.",
    "Current weather in a city → get_weather. How to travel between cities → get_transport_info.",

    // User account (signed in only)
    signedIn
      ? "Wishlist → get_wishlist or toggle_wishlist. User profile → get_user_profile. Preferences → get_user_preferences / update_user_preferences. Past bookings → list_orders. Accept feedback → submit_feedback."
      : "Wishlist, profile, preferences, orders, and feedback tools require the user to sign in.",

    "Be concise, use markdown. Synthesize tool results into a clear, friendly answer. Never expose raw JSON to the user.",
  ].join(" ");
}

function truncateToolResult(json: string): string {
  if (json.length <= MAX_TOOL_RESULT_CHARS) return json;
  // Truncate and note it was trimmed
  return json.slice(0, MAX_TOOL_RESULT_CHARS) + '..."(truncated)"}';
}

/**
 * Latency optimisations vs previous version:
 * 1. Parallel tool execution — all tools in one LLM response run concurrently
 * 2. Shorter history window (16 vs 30 turns) → fewer prompt tokens
 * 3. Lower max_tokens for tool-loop calls (400 — just enough for tool_calls JSON)
 * 4. Tool result payloads capped at 4 KB to prevent context bloat
 */
export async function runAgentStream(
  conversationMessages: Array<{ role: "user" | "assistant"; content: string }>,
  context: ToolContext,
  callbacks: AgentStreamCallbacks,
  signal?: AbortSignal,
): Promise<string> {
  const client = getOpenAIClient();
  const model = getAgentModel();

  if (!client || !model) {
    const msg = "I am unable to connect to the AI service right now. Please check your API configuration.";
    await callbacks.onToken(msg);
    return msg;
  }

  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: buildSystemPrompt(context) },
    ...conversationMessages.slice(-MAX_HISTORY_TURNS).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  // Phase 1: Tool execution loop (non-streaming, parallel tool calls)
  let toolsWereUsed = false;

  for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
    if (signal?.aborted) break;

    let response: OpenAI.Chat.Completions.ChatCompletion;
    try {
      response = await client.chat.completions.create({
        model,
        messages,
        tools: agentTools,
        tool_choice: "auto",
        temperature: 0.2,
        max_tokens: 400, // Only need room for tool_call JSON, not prose
        stream: false,
      });
    } catch (error) {
      logger.warn("Agent tool-loop LLM call failed", {
        error: error instanceof Error ? error.message : "unknown",
        iteration: i,
      });
      break;
    }

    const choice = response.choices[0];
    if (!choice) break;

    const { finish_reason, message } = choice;

    if (finish_reason !== "tool_calls" || !message.tool_calls?.length) break;

    toolsWereUsed = true;
    messages.push(message as ChatCompletionMessageParam);

    // Fire tool_call events and execute ALL tools in this batch concurrently
    await Promise.all(
      message.tool_calls.filter((tc) => tc.type === "function").map(async (toolCall) => {
        if (signal?.aborted) return;

        const fn = (toolCall as { type: "function"; function: { name: string; arguments: string } }).function;
        const toolName = fn.name;
        const label = TOOL_LABELS[toolName] ?? `Running ${toolName}...`;

        let parsedArgs: unknown = {};
        try {
          parsedArgs = JSON.parse(fn.arguments);
        } catch { /* leave as {} */ }

        await callbacks.onToolCall(toolName, label, parsedArgs);

        const rawResult = await executeTool(toolName, parsedArgs, context);
        const resultJson = truncateToolResult(rawResult);
        const summary = getToolResultSummary(toolName, resultJson);

        await callbacks.onToolResult(toolName, summary);

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: resultJson,
        });
      }),
    );
  }

  if (signal?.aborted) return "";

  // Phase 2: Stream the final answer
  let fullReply = "";
  try {
    const streamResponse = await client.chat.completions.create({
      model,
      messages,
      tool_choice: "none", // Force text answer, no more tool calls
      temperature: 0.3,
      max_tokens: 900,
      stream: true,
    });

    for await (const chunk of streamResponse) {
      if (signal?.aborted) break;
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        fullReply += delta;
        await callbacks.onToken(delta);
      }
    }
  } catch (error) {
    logger.warn("Agent final streaming failed, falling back to non-streaming", {
      error: error instanceof Error ? error.message : "unknown",
    });
    try {
      const fallback = await client.chat.completions.create({
        model,
        messages,
        tool_choice: "none",
        temperature: 0.3,
        max_tokens: 900,
        stream: false,
      });
      fullReply = fallback.choices[0]?.message?.content ?? "";
      // Emit in small chunks to keep SSE alive
      for (const chunk of (fullReply.match(/.{1,30}(\s|$)/g) ?? [fullReply])) {
        if (signal?.aborted) break;
        await callbacks.onToken(chunk);
        await new Promise<void>((r) => setTimeout(r, 10));
      }
    } catch (inner) {
      logger.warn("Agent fallback also failed", {
        error: inner instanceof Error ? inner.message : "unknown",
      });
    }
  }

  if (!fullReply.trim()) {
    const fallback = "I was unable to generate a response. Please try rephrasing your question.";
    await callbacks.onToken(fallback);
    return fallback;
  }

  return fullReply;
}
