"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/features/design-system";
import type { Suggestion } from "../types/command-language.types";

const kindClass: Record<Suggestion["kind"], string> = {
  verb: "text-brand",
  scope: "text-ok",
  modifier: "text-warn",
  timing: "text-ink-2",
  example: "text-ink-3",
};

type SuggestionListProps = {
  suggestions: Suggestion[];
  activeIndex: number;
  onHover: (index: number) => void;
  onSelect: (suggestion: Suggestion) => void;
};

export function SuggestionList({
  suggestions,
  activeIndex,
  onHover,
  onSelect,
}: SuggestionListProps) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const item = listRef.current?.children[activeIndex] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (suggestions.length === 0) return null;

  return (
    <div className="border-line bg-surface absolute bottom-full left-0 z-30 mb-2 w-full max-w-lg overflow-hidden rounded-xl border shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
      <ul ref={listRef} className="max-h-64 overflow-y-auto py-1">
        {suggestions.map((suggestion, index) => (
          <li
            key={suggestion.id}
            onMouseEnter={() => onHover(index)}
            onMouseDown={(event) => {
              event.preventDefault();
              onSelect(suggestion);
            }}
            className={cn(
              "flex cursor-pointer items-center gap-3 px-3 py-1.5 text-xs transition-colors",
              index === activeIndex && "bg-elev",
            )}
          >
            <span
              className={cn(
                "w-14 shrink-0 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase",
                kindClass[suggestion.kind],
              )}
            >
              {suggestion.kind}
            </span>
            <span className="text-ink font-mono text-sm">{suggestion.label}</span>
            {suggestion.description ? (
              <span className="text-ink-3 ml-auto text-[11px]">
                {suggestion.description}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
      <div className="border-line-2 text-ink-3 flex items-center gap-3 border-t px-3 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase">
        <span>↑ ↓ navigate</span>
        <span>tab · ⏎ complete</span>
        <span>esc dismiss</span>
      </div>
    </div>
  );
}
