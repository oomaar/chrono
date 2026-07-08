"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/features/design-system";
import type { Suggestion } from "../../types/command-language.types";

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
    <div className="border-line-strong bg-elev absolute bottom-full left-0 z-30 mb-2 w-full overflow-hidden rounded-xl border p-2 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
      <ul ref={listRef} className="max-h-64 overflow-y-auto">
        {suggestions.map((suggestion, index) => (
          <li
            key={suggestion.id}
            onMouseEnter={() => onHover(index)}
            onMouseDown={(event) => {
              event.preventDefault();
              onSelect(suggestion);
            }}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors",
              index === activeIndex ? "bg-surface-2" : "hover:bg-surface-2/60",
            )}
          >
            <span
              className={cn(
                "w-16 shrink-0 font-mono text-[9px] font-semibold tracking-[0.14em] uppercase",
                kindClass[suggestion.kind],
              )}
            >
              {suggestion.kind}
            </span>
            <span className="text-ink font-mono text-[13px]">{suggestion.label}</span>
            {suggestion.description ? (
              <span className="text-ink-3 ml-auto text-[11px]">
                {suggestion.description}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
      <div className="border-line-2 text-ink-3 mt-1 flex items-center gap-3 border-t px-2 pt-2 font-mono text-[10px] tracking-[0.14em] uppercase">
        <span>↑ ↓ navigate</span>
        <span>tab · ⏎ complete</span>
        <span>esc dismiss</span>
      </div>
    </div>
  );
}
