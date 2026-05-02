"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Source } from "@/types/search";

interface SourceCardProps {
  source: Source;
  highlighted?: boolean;
  index?: number;
}

export function SourceCard({ source, highlighted = false, index = 0 }: SourceCardProps) {
  const { title, snippet, domain, id } = source;

  return (
    <motion.article
      id={`source-${id}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: index * 0.06, ease: "easeOut" }}
      className={cn(
        "group rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-cyan-200/25 hover:bg-white/[0.06] sm:p-5",
        highlighted && "border-cyan-300/70 bg-cyan-300/10 shadow-[0_0_0_1px_rgba(56,189,248,0.45)]"
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="line-clamp-2 text-sm font-medium text-zinc-100">{title}</h3>
        <a
          href={source.url}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`Open source ${id} in a new tab`}
          className="mt-0.5 rounded text-zinc-500 transition hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
        >
          <ExternalLink className="size-3.5 shrink-0" />
        </a>
      </div>
      <p className="text-xs text-cyan-200/80">{domain}</p>
      <p className="mt-2 line-clamp-3 text-xs leading-5 text-zinc-400">{snippet}</p>
    </motion.article>
  );
}
