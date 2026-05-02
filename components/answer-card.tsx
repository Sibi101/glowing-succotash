"use client";

import { motion } from "framer-motion";

import { parseCitationSegments } from "@/lib/citations";
import { cn } from "@/lib/utils";

interface AnswerCardProps {
  answer: string;
  availableSourceIds: number[];
  followUps: string[];
  onFollowUpClick?: (followUp: string) => void;
  onCitationClick?: (sourceId: number) => void;
}

export function AnswerCard({
  answer,
  availableSourceIds,
  followUps,
  onFollowUpClick,
  onCitationClick
}: AnswerCardProps) {
  const citationSet = new Set(availableSourceIds);
  const segments = parseCitationSegments(answer);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-7"
    >
      <p className="text-[15px] leading-8 text-zinc-100 sm:text-[17px]">
        {segments.map((segment, index) => {
          if (segment.type === "text") {
            return <span key={`text-${index}`}>{segment.value}</span>;
          }

          const isValidSource = citationSet.has(segment.sourceId);

          return (
            <button
              key={`citation-${index}-${segment.sourceId}`}
              type="button"
              onClick={() => isValidSource && onCitationClick?.(segment.sourceId)}
              className={cn(
                "mx-0.5 inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium transition",
                isValidSource
                  ? "border-cyan-200/40 bg-cyan-400/10 text-cyan-100 hover:border-cyan-200/70 hover:bg-cyan-300/20"
                  : "cursor-not-allowed border-white/15 bg-white/5 text-zinc-400"
              )}
              aria-label={isValidSource ? `Go to source ${segment.sourceId}` : `Source ${segment.sourceId} unavailable`}
              disabled={!isValidSource}
            >
              {segment.value}
            </button>
          );
        })}
      </p>

      <div className="mt-8">
        <p className="text-xs uppercase tracking-wide text-zinc-400">Follow-up ideas</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {followUps.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => onFollowUpClick?.(question)}
              className="rounded-lg border border-white/10 bg-black/20 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-cyan-200/30 hover:text-cyan-100"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
