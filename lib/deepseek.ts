import "server-only";

import { buildDeepseekUserPrompt, DEEPSEEK_SYSTEM_PROMPT } from "@/lib/prompts";
import type { Source } from "@/types/search";

const DEEPSEEK_CHAT_COMPLETIONS_URL = "https://api.deepseek.com/chat/completions";

interface ChatCompletionChoice {
  message?: {
    content?: string;
  };
}

interface DeepseekChatResponse {
  choices?: ChatCompletionChoice[];
  error?: {
    message?: string;
  };
}

export interface DeepseekAnswerResult {
  answer: string;
  followUps: string[];
}

export async function generateAnswer(
  query: string,
  sources: Source[]
): Promise<DeepseekAnswerResult> {
  if (!query.trim()) {
    throw new Error("generateAnswer: query is required.");
  }

  const runtime = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  };
  const apiKey = runtime.process?.env?.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error("generateAnswer: missing DEEPSEEK_API_KEY environment variable.");
  }

  const userPrompt = buildDeepseekUserPrompt(query, sources);

  let response: Response;
  try {
    response = await fetch(DEEPSEEK_CHAT_COMPLETIONS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-v4-flash",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: DEEPSEEK_SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ]
      }),
      cache: "no-store"
    });
  } catch (error) {
    throw new Error(`generateAnswer: network error calling DeepSeek (${String(error)}).`);
  }

  let payload: DeepseekChatResponse;
  try {
    payload = (await response.json()) as DeepseekChatResponse;
  } catch {
    throw new Error(`generateAnswer: DeepSeek returned non-JSON response (status ${response.status}).`);
  }

  if (!response.ok) {
    const message = payload.error?.message || "Unknown DeepSeek API error.";
    throw new Error(`generateAnswer: DeepSeek API error ${response.status} - ${message}`);
  }

  const rawContent = payload.choices?.[0]?.message?.content?.trim();
  if (!rawContent) {
    throw new Error("generateAnswer: DeepSeek returned an empty completion.");
  }

  return parseAnswerContent(rawContent);
}

function parseAnswerContent(rawContent: string): DeepseekAnswerResult {
  try {
    const parsed = JSON.parse(rawContent) as Partial<DeepseekAnswerResult>;

    const answer = typeof parsed.answer === "string" && parsed.answer.trim()
      ? parsed.answer.trim()
      : "I could not produce a grounded answer from the provided sources.";

    const followUps = Array.isArray(parsed.followUps)
      ? parsed.followUps.filter((item): item is string => typeof item === "string" && item.trim().length > 0).slice(0, 4)
      : [];

    return {
      answer,
      followUps: followUps.length >= 2 ? followUps : defaultFollowUps()
    };
  } catch {
    return fallbackFromPlainText(rawContent);
  }
}

function fallbackFromPlainText(rawContent: string): DeepseekAnswerResult {
  const cleanAnswer = rawContent
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  return {
    answer: cleanAnswer || "I could not produce a grounded answer from the provided sources.",
    followUps: defaultFollowUps()
  };
}

function defaultFollowUps(): string[] {
  return [
    "Which source is strongest for this claim?",
    "What details are still unverified?",
    "Would you like a shorter summary with only key facts?"
  ];
}
