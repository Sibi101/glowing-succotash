"use client";

import { useEffect, useRef } from "react";
import { CornerDownLeft, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export function SearchInput({ value, onChange, onSubmit, loading = false }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";

      if (!isShortcut) {
        return;
      }

      event.preventDefault();
      inputRef.current?.focus();
    }

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="relative w-full max-w-3xl rounded-2xl border border-white/15 bg-white/[0.04] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2">
        <Sparkles className="size-4 shrink-0 text-cyan-300" />
        <input
          ref={inputRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Ask about markets, science, news, software, history..."
          className="h-11 w-full bg-transparent text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          aria-label="Search the web"
        />

        <kbd className="hidden rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-zinc-400 sm:inline-flex">
          ⌘/Ctrl + K
        </kbd>

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || !value.trim()}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium transition",
            loading || !value.trim()
              ? "cursor-not-allowed bg-white/10 text-zinc-500"
              : "bg-cyan-400/90 text-slate-900 hover:bg-cyan-300"
          )}
        >
          <CornerDownLeft className="size-4" />
          Search
        </button>
      </div>
    </div>
  );
}
