"use client";

import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Source } from "@/types/search";

interface SourceCardProps {
  source: Source;
  highlighted?: boolean;
}

export function SourceCard({ source, highlighted = false }: SourceCardProps) {
  const { title, snippet, domain, id } = source;

  return (
    <article
      id={`source-${id}`}
      className={cn(
        "group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-cyan-200/25 hover:bg-white/[0.06]",
        highlighted && "border-cyan-300/70 bg-cyan-300/10 shadow-[0_0_0_1px_rgba(56,189,248,0.45)]"
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-sm font-medium text-zinc-100">{title}</h3>
        <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-zinc-500 transition group-hover:text-cyan-300" />
      </div>
      <p className="text-xs text-cyan-200/80">{domain}</p>
      <p className="mt-2 line-clamp-3 text-xs leading-5 text-zinc-400">{snippet}</p>
    </article>
  );
}
