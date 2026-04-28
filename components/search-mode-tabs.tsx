"use client";

import { Globe, type LucideIcon, Newspaper, Rocket, Telescope } from "lucide-react";

import { cn } from "@/lib/utils";
import type { SearchMode } from "@/types/search";

const modes: Array<{ key: SearchMode; label: string; icon: LucideIcon }> = [
  { key: "web", label: "Web", icon: Globe },
  { key: "news", label: "News", icon: Newspaper },
  { key: "research", label: "Research", icon: Telescope },
  { key: "fast", label: "Fast", icon: Rocket }
];

interface SearchModeTabsProps {
  mode: SearchMode;
  onModeChange: (mode: SearchMode) => void;
}

export function SearchModeTabs({ mode, onModeChange }: SearchModeTabsProps) {
  return (
    <div className="inline-flex w-full max-w-xl items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1 backdrop-blur-xl">
      {modes.map(({ key, label, icon: Icon }) => {
        const active = mode === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => onModeChange(key)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-300 transition sm:text-sm",
              active ? "bg-white/12 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12)]" : "hover:bg-white/8"
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
