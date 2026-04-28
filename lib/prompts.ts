import type { SearchMode, Source } from "@/types/search";

const MODE_GUIDANCE: Record<SearchMode, string> = {
  fast: "Prioritize the most directly relevant facts first and keep the answer compact.",
  web: "Provide a balanced, general-purpose summary grounded in the supplied sources.",
  news: "Emphasize timeliness and clearly attribute claims to the cited sources.",
  research: "Provide a deeper synthesis with key nuances while remaining concise."
};

export const DEEPSEEK_SYSTEM_PROMPT = `You are a Perplexity-style answer engine.
Rules:
1) Use only the provided sources.
2) Cite factual claims with source IDs like [1], [2].
3) Never invent sources or citations.
4) If sources are insufficient, explicitly say what cannot be verified.
5) Be concise, useful, and well-structured.
6) Produce 2-4 follow-up questions.
7) Return valid JSON only with shape: {"answer": string, "followUps": string[]}.`;

export function buildDeepseekUserPrompt(query: string, sources: Source[], mode: SearchMode): string {
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
    `Mode: ${mode}`,
    `Mode guidance: ${MODE_GUIDANCE[mode]}`,
    `User query: ${query}`,
    "Sources:",
    renderedSources || "(No sources provided)",
    "\nOutput instructions:",
    "- Return JSON with keys: answer, followUps.",
    "- followUps must contain 2 to 4 concise questions.",
    "- Use inline citations like [1], [2] in answer text when making claims."
  ].join("\n");
}
