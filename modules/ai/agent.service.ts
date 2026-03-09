import type OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { logger } from "@/lib/observability/logger";
import { getOpenAIClient } from "@/modules/ai/openai-client";
import { agentTools, TOOL_LABELS } from "@/modules/ai/tools/definitions";
import { executeTool, getToolResultSummary, type ToolContext } from "@/modules/ai/tools/executor";

const MAX_TOOL_ITERATIONS = 5;

export interface AgentStreamCallbacks {
  onToolCall: (name: string, label: string, args: unknown) => void | Promise<void>;
  onToolResult: (name: string, summary: string) => void | Promise<void>;
  onToken: (delta: string) => void | Promise<void>;
}

function getAgentModel(): string | null {
  return (
    process.env.AGENT_MODEL ||
    process.env.OPENROUTER_MODEL ||
    null
  );
}

function buildSystemPrompt(ctx: ToolContext): string {
  const today = new Date().toISOString().split("T")[0];
  const signedIn = Boolean(ctx.userId);

  return [
    "You are a professional Turkey travel assistant for Smart Trip AI.",
    `Today's date: ${today}.`,
    "Always use tools to fetch real data — never guess product IDs, prices, or availability.",
    "For tour/activity recommendations: call search_products.",
    "For landmarks and attractions: call search_attractions or get_attraction_details.",
    "For a day-by-day trip plan: call generate_itinerary, then offer to save it.",
    "For currency conversion questions: call get_exchange_rate.",
    "For travel tips, city guides, food, transport, safety advice: call get_turkey_travel_info.",
    signedIn
      ? "The user is signed in — all itinerary CRUD tools are available."
      : "The user is NOT signed in — itinerary save/list/get/update/delete tools will return an auth error.",
    "Be helpful, concise, and use markdown formatting. After receiving tool results, synthesize them into a clear friendly answer.",
  ].join(" ");
}

/**
 * Runs the tool-calling agentic loop then streams the final response.
 * Tool calls are executed non-streaming; only the final answer is streamed token-by-token.
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

  // Build full message history (keep last 30 turns)
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: buildSystemPrompt(context) },
    ...conversationMessages.slice(-30).map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  // Phase 1: Tool execution loop (non-streaming)
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
        temperature: 0.3,
        max_tokens: 800,
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

    // No tool calls → stop looping, proceed to streaming final answer
    if (finish_reason !== "tool_calls" || !message.tool_calls?.length) {
      break;
    }

    toolsWereUsed = true;

    // Append assistant message containing tool_calls to history
    messages.push(message as ChatCompletionMessageParam);

    // Execute each requested tool
    for (const toolCall of message.tool_calls) {
      if (signal?.aborted) break;

      const toolName = toolCall.function.name;
      const label = TOOL_LABELS[toolName] ?? `Running ${toolName}...`;

      let parsedArgs: unknown = {};
      try {
        parsedArgs = JSON.parse(toolCall.function.arguments);
      } catch {
        // Leave as empty object
      }

      await callbacks.onToolCall(toolName, label, parsedArgs);

      const resultJson = await executeTool(toolName, parsedArgs, context);
      const summary = getToolResultSummary(toolName, resultJson);

      await callbacks.onToolResult(toolName, summary);

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: resultJson,
      });
    }
  }

  if (signal?.aborted) return "";

  // Phase 2: Stream the final answer (no tools allowed so it just generates text)
  let fullReply = "";
  try {
    const streamResponse = await client.chat.completions.create({
      model,
      messages,
      // Disable tools so the model writes a final answer instead of calling more tools
      tool_choice: toolsWereUsed ? "none" : "auto",
      tools: toolsWereUsed ? undefined : agentTools,
      temperature: 0.3,
      max_tokens: 1000,
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
    logger.warn("Agent final streaming failed", {
      error: error instanceof Error ? error.message : "unknown",
    });
    // Fallback: one non-streaming call, chunk the output
    try {
      const fallbackResponse = await client.chat.completions.create({
        model,
        messages,
        tool_choice: "none",
        temperature: 0.3,
        max_tokens: 1000,
        stream: false,
      });
      fullReply = fallbackResponse.choices[0]?.message?.content ?? "";
      const chunks = fullReply.match(/.{1,20}(\s|$)/g) ?? [fullReply];
      for (const chunk of chunks) {
        if (signal?.aborted) break;
        await callbacks.onToken(chunk);
        await new Promise<void>((resolve) => setTimeout(resolve, 12));
      }
    } catch (innerError) {
      logger.warn("Agent fallback call also failed", {
        error: innerError instanceof Error ? innerError.message : "unknown",
      });
    }
  }

  if (!fullReply.trim()) {
    const fallback =
      "I was unable to generate a response. Please try rephrasing your question.";
    await callbacks.onToken(fallback);
    return fallback;
  }

  return fullReply;
}
