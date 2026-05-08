import type { Source } from "@/types/search";

export const DEEPSEEK_SYSTEM_PROMPT = `You are a Perplexity-style answer engine.
Rules:
1) Use only the provided sources.
2) Cite factual claims with source IDs like [1], [2].
3) Never invent sources or citations.
4) If sources are insufficient, explicitly say what cannot be verified.
5) Be concise, useful, and well-structured.
6) Produce 2-4 follow-up questions.
7) Return valid JSON only with shape: {"answer": string, "followUps": string[]}.`;

export function buildDeepseekUserPrompt(query: string, sources: Source[]): string {
  const renderedSources = sources
    .map((source) => {
      return [
        `[${source.id}] ${source.title}`,
        `URL: ${source.url}`,
        `Domain: ${source.domain}`,
        `Snippet: ${source.snippet}`,
        source.content ? `Content: ${source.content}` : ""
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n");

  return [
    "Mode guidance: Provide a balanced, general-purpose summary grounded in the supplied sources.",
    `User query: ${query}`,
    "Sources:",
    renderedSources || "(No sources provided)",
    "\nOutput instructions:",
    "- Return JSON with keys: answer, followUps.",
    "- followUps must contain 2 to 4 concise questions.",
    "- Use inline citations like [1], [2] in answer text when making claims."
  ].join("\n");
}
