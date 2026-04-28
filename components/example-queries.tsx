"use client";

interface ExampleQueriesProps {
  onPick: (query: string) => void;
}

const examples = [
  "What changed in AI regulation this week?",
  "Summarize Apple's latest product announcements",
  "Best open-source coding models in 2026",
  "Why did Nvidia stock move today?"
];

export function ExampleQueries({ onPick }: ExampleQueriesProps) {
  return (
    <section className="w-full max-w-3xl">
      <p className="mb-3 text-xs uppercase tracking-wide text-zinc-500">Try an example</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {examples.map((query) => (
          <button
            key={query}
            type="button"
            onClick={() => onPick(query)}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-zinc-300 transition hover:border-cyan-200/30 hover:text-white"
          >
            {query}
          </button>
        ))}
      </div>
    </section>
  );
}
