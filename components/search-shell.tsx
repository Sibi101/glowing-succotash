"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { AnimatedBackground } from "@/components/animated-background";
import { AnswerCard } from "@/components/answer-card";
import { ExampleQueries } from "@/components/example-queries";
import { SearchInput } from "@/components/search-input";
import { SearchModeTabs } from "@/components/search-mode-tabs";
import { SourceCard } from "@/components/source-card";
import type { ApiError, AskResponse, SearchMode } from "@/types/search";

type SearchPhase = "empty" | "loading" | "answer" | "error";

function isAskResponse(value: unknown): value is AskResponse {
  if (!value || typeof value !== "object") return false;

  const maybe = value as AskResponse;
  return typeof maybe.answer === "string" && Array.isArray(maybe.followUps) && Array.isArray(maybe.sources);
}

function isApiError(value: unknown): value is ApiError {
  return !!value && typeof value === "object" && typeof (value as ApiError).error === "string";
}

export function SearchShell() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("web");
  const [phase, setPhase] = useState<SearchPhase>("empty");
  const [result, setResult] = useState<AskResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [highlightedSourceId, setHighlightedSourceId] = useState<number | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    if (phase !== "loading") {
      setLoadingStep(0);
      return;
    }

    const interval = window.setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % 3);
    }, 900);

    return () => window.clearInterval(interval);
  }, [phase]);

  async function runSearch(nextQuery?: string) {
    const finalQuery = (nextQuery ?? query).trim();
    if (!finalQuery) return;

    if (nextQuery) {
      setQuery(finalQuery);
    }

    setPhase("loading");
    setErrorMessage("");
    setHighlightedSourceId(null);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: finalQuery,
          mode
        })
      });

      const payload: unknown = await response.json();

      if (!response.ok) {
        throw new Error(isApiError(payload) ? payload.error : "Something went wrong while searching.");
      }

      if (!isAskResponse(payload)) {
        throw new Error("Unexpected response shape from server.");
      }

      setResult(payload);
      setPhase("answer");
    } catch (error) {
      setPhase("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong while searching.");
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-8 sm:py-12">
      <AnimatedBackground />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-8 sm:gap-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 text-xs text-zinc-300 backdrop-blur-xl">
          <span className="size-1.5 rounded-full bg-cyan-300" />
          Aether Search
        </div>

        <section className="space-y-4 text-center">
          <h1 className="bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-6xl">
            Ask the internet anything
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-zinc-400 sm:text-base">
            Real-time AI search with fast synthesis, cited sources, and concise answers that feel like a premium research workflow.
          </p>
        </section>

        <SearchInput value={query} onChange={setQuery} onSubmit={() => void runSearch()} loading={phase === "loading"} />
        <SearchModeTabs mode={mode} onModeChange={setMode} />

        {phase === "empty" && <ExampleQueries onPick={(example) => void runSearch(example)} />}

        {phase === "loading" && (
          <section className="w-full space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-7">
              <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">Live workflow</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={loadingStep}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="mt-3 text-xl font-medium text-cyan-100 sm:text-2xl"
                >
                  {loadingStep === 0 ? "Searching..." : loadingStep === 1 ? "Reading..." : "Generating..."}
                </motion.p>
              </AnimatePresence>
              <div className="mt-4 space-y-3">
                <div className="h-4 w-4/5 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-full animate-pulse rounded bg-white/10" />
                <div className="h-4 w-3/5 animate-pulse rounded bg-white/10" />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-36 animate-pulse rounded-xl border border-white/10 bg-white/[0.03]" />
              ))}
            </div>
          </section>
        )}

        {phase === "error" && (
          <section className="w-full max-w-3xl rounded-2xl border border-rose-300/20 bg-rose-500/10 p-5 text-center backdrop-blur-xl sm:p-6">
            <h2 className="text-base font-medium text-rose-100">We hit a temporary issue.</h2>
            <p className="mt-2 text-sm text-rose-100/80">{errorMessage || "Please try again in a moment."}</p>
            <button
              type="button"
              onClick={() => void runSearch()}
              className="mt-4 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm text-zinc-100 transition hover:bg-white/20"
            >
              Retry
            </button>
          </section>
        )}

        <AnimatePresence mode="wait">
          {phase === "answer" && result && (
            <motion.section
              key="answer"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full space-y-5"
            >
              <AnswerCard
                answer={result.answer}
                availableSourceIds={result.sources.map((source) => source.id)}
                followUps={result.followUps}
                onFollowUpClick={(followUp) => void runSearch(followUp)}
                onCitationClick={(sourceId) => {
                  setHighlightedSourceId(sourceId);

                  const element = document.getElementById(`source-${sourceId}`);
                  element?.scrollIntoView({ behavior: "smooth", block: "center" });

                  window.setTimeout(() => {
                    setHighlightedSourceId((currentId) => (currentId === sourceId ? null : currentId));
                  }, 1800);
                }}
              />

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {result.sources.map((source, index) => (
                  <SourceCard
                    key={source.id}
                    source={source}
                    index={index}
                    highlighted={source.id === highlightedSourceId}
                  />
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
