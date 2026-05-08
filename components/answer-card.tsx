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
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
    >
      <p className="text-[15px] leading-8 text-slate-800 sm:text-[17px]">
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
                  ? "border-sky-200 bg-sky-50 text-sky-700 hover:border-sky-300"
                  : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
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
        <p className="text-xs uppercase tracking-wide text-slate-500">Follow-up ideas</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {followUps.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => onFollowUpClick?.(question)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
