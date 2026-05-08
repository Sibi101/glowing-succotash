import { NextResponse } from "next/server";

import { generateAnswer } from "@/lib/deepseek";
import { searchTavily } from "@/lib/tavily";
import type { ApiError, AskResponse } from "@/types/search";

const MAX_QUERY_LENGTH = 1000;

interface AskBody {
  query?: unknown;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json<ApiError>({ error: "Content-Type must be application/json." }, { status: 415 });
  }

  let body: AskBody;

  try {
    body = (await request.json()) as AskBody;
  } catch {
    return NextResponse.json<ApiError>({ error: "Invalid JSON body." }, { status: 400 });
  }

  const query = typeof body.query === "string" ? body.query.trim() : "";
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
    const { sources } = await searchTavily(query);
    const { answer, followUps } = await generateAnswer(query, sources);

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
    console.error("POST /api/ask failed", {
      queryLength: query.length,
      error: String(error)
    });
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
