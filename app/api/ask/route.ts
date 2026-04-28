import { NextResponse } from "next/server";

import { generateAnswer } from "@/lib/deepseek";
import { searchTavily } from "@/lib/tavily";
import type { ApiError, AskResponse, SearchMode } from "@/types/search";

const MAX_QUERY_LENGTH = 1000;
const ALLOWED_MODES: SearchMode[] = ["web", "news", "research", "fast"];

interface AskBody {
  query?: unknown;
  mode?: unknown;
}

export async function POST(request: Request) {
  let body: AskBody;

  try {
    body = (await request.json()) as AskBody;
  } catch {
    return NextResponse.json<ApiError>({ error: "Invalid JSON body." }, { status: 400 });
  }

  const query = typeof body.query === "string" ? body.query.trim() : "";
  const mode = normalizeMode(body.mode);

  if (!query) {
    return NextResponse.json<ApiError>({ error: "Query is required." }, { status: 400 });
  }

  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json<ApiError>(
      { error: `Query is too long. Maximum length is ${MAX_QUERY_LENGTH} characters.` },
      { status: 400 }
    );
  }

  try {
    const { sources } = await searchTavily(query, mode);
    const { answer, followUps } = await generateAnswer(query, sources, mode);

    const response: AskResponse = {
      answer,
      sources,
      followUps
    };

    return NextResponse.json<AskResponse>(response, { status: 200 });
  } catch (error) {
    const runtime = globalThis as typeof globalThis & {
      process?: { env?: Record<string, string | undefined> };
    };
    const isProduction = runtime.process?.env?.NODE_ENV === "production";
    const message = "Search provider failed. Please try again.";

    return NextResponse.json<ApiError>(
      {
        error: message,
        details: isProduction ? undefined : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json<ApiError>({ error: "Method not allowed." }, { status: 405 });
}

function normalizeMode(mode: unknown): SearchMode {
  if (typeof mode === "string" && ALLOWED_MODES.includes(mode as SearchMode)) {
    return mode as SearchMode;
  }

  return "web";
}
