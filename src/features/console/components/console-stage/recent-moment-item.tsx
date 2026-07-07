"use client";

import { cn } from "@/features/design-system";
import type { RecentMomentItem } from "../../types/console.types";

const toneClass: Record<RecentMomentItem["event"]["tone"], string> = {
  crit: "bg-crit",
  warn: "bg-warn",
  ok: "bg-ok",
  brand: "bg-brand",
  neutral: "bg-ink-3",
};

const formatAge = (minutes: number): string => {
  if (minutes < 1) return "now";
  if (minutes < 60) return `-${Math.round(minutes)}m`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `-${hours}h${String(mins).padStart(2, "0")}` : `-${hours}h`;
};

type RecentMomentItemRowProps = {
  item: RecentMomentItem;
  onClick: (event: RecentMomentItem["event"]) => void;
};

export function RecentMomentItemRow({ item, onClick }: RecentMomentItemRowProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(item.event)}
      className="group border-line-2 flex w-full items-start gap-3 border-b py-2.5 text-left transition-opacity last:border-0 hover:opacity-90"
    >
      <span className="text-ink-3 w-12 shrink-0 pt-0.5 font-mono text-[10px] tracking-[0.14em] tabular-nums">
        {formatAge(item.ageMinutes)}
      </span>
      <span
        className={cn(
          "mt-1.5 h-1.5 w-1.5 flex-none rounded-full",
          toneClass[item.event.tone],
        )}
      />
      <span className="text-ink-2 group-hover:text-ink min-w-0 flex-1 text-xs leading-snug">
        {item.event.summary}
      </span>
    </button>
  );
}
