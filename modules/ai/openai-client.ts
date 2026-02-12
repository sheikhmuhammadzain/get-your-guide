import OpenAI from "openai";
import { getServerEnv } from "@/lib/env/server";

let cachedClient: OpenAI | null | undefined;

export function getOpenAIClient() {
  if (cachedClient !== undefined) {
    return cachedClient;
  }

  const { OPENAI_API_KEY } = getServerEnv();
  if (!OPENAI_API_KEY) {
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = new OpenAI({ apiKey: OPENAI_API_KEY });
  return cachedClient;
}
