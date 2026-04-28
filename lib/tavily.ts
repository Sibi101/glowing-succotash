import "server-only";

import type { SearchMode, Source } from "@/types/search";

const TAVILY_SEARCH_URL = "https://api.tavily.com/search";

type TavilyMode = {
  searchDepth: "basic" | "advanced";
  topic?: "general" | "news";
  maxResults: number;
  includeAnswer: boolean;
  includeRawContent: boolean;
};

const MODE_CONFIG: Record<SearchMode, TavilyMode> = {
  fast: {
    searchDepth: "basic",
    topic: "general",
    maxResults: 4,
    includeAnswer: false,
    includeRawContent: false
  },
  web: {
    searchDepth: "basic",
    topic: "general",
    maxResults: 6,
    includeAnswer: true,
    includeRawContent: false
  },
  news: {
    searchDepth: "basic",
    topic: "news",
    maxResults: 8,
    includeAnswer: true,
    includeRawContent: false
  },
  research: {
    searchDepth: "advanced",
    topic: "general",
    maxResults: 12,
    includeAnswer: true,
    includeRawContent: true
  }
};

interface TavilyResultItem {
  title?: string;
  url?: string;
  content?: string;
  raw_content?: string;
}

interface TavilySearchResponse {
  answer?: string;
  results?: TavilyResultItem[];
  error?: string;
}

export interface TavilySearchResult {
  answer: string;
  sources: Source[];
}

export async function searchTavily(query: string, mode: SearchMode): Promise<TavilySearchResult> {
  if (!query.trim()) {
    throw new Error("searchTavily: query is required.");
  }

  const runtime = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  };
  const apiKey = runtime.process?.env?.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("searchTavily: missing TAVILY_API_KEY environment variable.");
  }

  const config = MODE_CONFIG[mode];

  let response: Response;
  try {
    response = await fetch(TAVILY_SEARCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        topic: config.topic,
        search_depth: config.searchDepth,
        max_results: config.maxResults,
        include_answer: config.includeAnswer,
        include_raw_content: config.includeRawContent
      }),
      cache: "no-store"
    });
  } catch (error) {
    throw new Error(`searchTavily: network error calling Tavily (${String(error)}).`);
  }

  let payload: TavilySearchResponse;
  try {
    payload = (await response.json()) as TavilySearchResponse;
  } catch {
    throw new Error(`searchTavily: Tavily returned non-JSON response (status ${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(
      `searchTavily: Tavily API error ${response.status}${payload.error ? ` - ${payload.error}` : ""}.`
    );
  }

  const sources: Source[] = (payload.results ?? [])
    .filter((item): item is TavilyResultItem & { url: string } => typeof item.url === "string")
    .map((item, index) => {
      const domain = extractDomain(item.url);

      return {
        id: index + 1,
        title: item.title?.trim() || domain,
        url: item.url,
        domain,
        snippet: item.content?.trim() || "No snippet available.",
        content: item.raw_content?.trim() || undefined
      };
    });

  return {
    answer: payload.answer?.trim() ?? "",
    sources
  };
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "unknown-source";
  }
}
