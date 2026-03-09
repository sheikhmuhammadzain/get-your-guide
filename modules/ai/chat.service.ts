import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db/mongoose";
import { logger } from "@/lib/observability/logger";
import { runAgentStream, type AgentStreamCallbacks } from "@/modules/ai/agent.service";
import { ChatSessionModel } from "@/modules/ai/chat-session.model";
import type { ToolContext } from "@/modules/ai/tools/executor";

interface ChatInput {
  userId: string;
  sessionId: string;
  message: string;
  itineraryId?: string;
}

export interface AssistantHistoryMessage {
  role: "assistant" | "user";
  content: string;
  createdAt: string;
}

type StoredMessage = { role: "user" | "assistant"; content: string; createdAt: Date };

function fallbackAssistantReply(message: string): string {
  return `I can help with Turkey trip planning. You asked: "${message}". Share your destination, days, and budget for a tailored plan.`;
}

async function loadConversation(input: ChatInput): Promise<{
  userObjectId: Types.ObjectId;
  messages: StoredMessage[];
}> {
  await connectToDatabase();

  const userObjectId = new Types.ObjectId(input.userId);
  const existing = await ChatSessionModel.findOne({
    userId: userObjectId,
    sessionId: input.sessionId,
  });

  const messages: StoredMessage[] = existing?.messages ?? [];
  messages.push({ role: "user", content: input.message, createdAt: new Date() });
  return { userObjectId, messages };
}

async function persistConversation(
  input: ChatInput,
  userObjectId: Types.ObjectId,
  messages: StoredMessage[],
): Promise<{ sessionId: string }> {
  const trimmedMessages = messages.slice(-120);

  const saved = await ChatSessionModel.findOneAndUpdate(
    { userId: userObjectId, sessionId: input.sessionId },
    {
      $set: {
        itineraryId:
          input.itineraryId && Types.ObjectId.isValid(input.itineraryId)
            ? new Types.ObjectId(input.itineraryId)
            : undefined,
        messages: trimmedMessages,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
      },
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  ).lean();

  return { sessionId: saved?.sessionId ?? input.sessionId };
}

export async function getAssistantSessionHistory(userId: string, sessionId: string) {
  await connectToDatabase();
  const userObjectId = new Types.ObjectId(userId);
  const session = await ChatSessionModel.findOne({ userId: userObjectId, sessionId }).lean();
  const rawMessages = (session?.messages ?? []) as Array<{
    role?: unknown;
    content?: unknown;
    createdAt?: unknown;
  }>;
  const messages = rawMessages
    .filter(
      (msg): msg is { role: "assistant" | "user"; content: string; createdAt?: Date } =>
        (msg.role === "assistant" || msg.role === "user") && typeof msg.content === "string",
    )
    .map((msg) => ({
      role: msg.role,
      content: msg.content,
      createdAt: (msg.createdAt ?? new Date()).toISOString(),
    })) satisfies AssistantHistoryMessage[];

  return { sessionId, messages };
}

export interface StreamCallbacks {
  onToolCall: (name: string, label: string, args: unknown) => void | Promise<void>;
  onToolResult: (name: string, summary: string) => void | Promise<void>;
  onToken: (delta: string) => void | Promise<void>;
}

export async function chatWithAssistantStream(
  input: ChatInput,
  callbacks: StreamCallbacks,
  options?: { signal?: AbortSignal },
): Promise<{ sessionId: string; reply: string }> {
  let userObjectId: Types.ObjectId | null = null;
  const fallbackMessages: StoredMessage[] = [
    { role: "user", content: input.message, createdAt: new Date() },
  ];
  let storedMessages = fallbackMessages;

  try {
    const loaded = await loadConversation(input);
    userObjectId = loaded.userObjectId;
    storedMessages = loaded.messages;
  } catch (error) {
    logger.warn("Chat stream: conversation load failed, using ephemeral context", {
      error: error instanceof Error ? error.message : "unknown",
    });
  }

  // Build conversation context for the agent (all stored messages including current user message)
  const conversationContext = storedMessages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const toolContext: ToolContext = {
    userId: input.userId,
    sessionId: input.sessionId,
  };

  const agentCallbacks: AgentStreamCallbacks = {
    onToolCall: callbacks.onToolCall,
    onToolResult: callbacks.onToolResult,
    onToken: callbacks.onToken,
  };

  let assistantReply = "";
  try {
    assistantReply = await runAgentStream(
      conversationContext,
      toolContext,
      agentCallbacks,
      options?.signal,
    );
  } catch (error) {
    logger.warn("Agent stream failed, using fallback", {
      error: error instanceof Error ? error.message : "unknown",
    });
    assistantReply = fallbackAssistantReply(input.message);
    await callbacks.onToken(assistantReply);
  }

  if (!assistantReply.trim()) {
    assistantReply = fallbackAssistantReply(input.message);
    await callbacks.onToken(assistantReply);
  }

  storedMessages.push({ role: "assistant", content: assistantReply, createdAt: new Date() });

  let sessionId = input.sessionId;
  if (userObjectId) {
    try {
      const persisted = await persistConversation(input, userObjectId, storedMessages);
      sessionId = persisted.sessionId;
    } catch (error) {
      logger.warn("Chat stream: conversation persistence failed", {
        error: error instanceof Error ? error.message : "unknown",
      });
    }
  }

  return { sessionId, reply: assistantReply };
}
