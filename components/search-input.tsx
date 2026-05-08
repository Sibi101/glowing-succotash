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
    <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2">
        <Sparkles className="size-4 shrink-0 text-sky-600" />
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
          className="h-11 w-full bg-transparent text-base text-slate-700 placeholder:text-slate-400 focus:outline-none"
          aria-label="Search the web"
        />

        <kbd className="hidden rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-500 sm:inline-flex">
          ⌘/Ctrl + K
        </kbd>

        <button
          type="button"
          onClick={onSubmit}
          disabled={loading || !value.trim()}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-medium transition",
            loading || !value.trim()
              ? "cursor-not-allowed bg-slate-100 text-slate-400"
              : "bg-slate-900 text-white hover:bg-slate-700"
          )}
        >
          <CornerDownLeft className="size-4" />
          Search
        </button>
      </div>
    </div>
  );
}
