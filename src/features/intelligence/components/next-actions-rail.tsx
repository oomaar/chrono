"use client";

import { cn } from "@/features/design-system";
import type { NextAction } from "../types/intelligence.types";
import { ConfidenceMeter } from "./confidence-meter";

const toneCardClass: Record<NextAction["tone"], string> = {
  brand: "border-brand/40 hover:border-brand",
  warn: "border-warn/40 hover:border-warn",
  crit: "border-crit/40 hover:border-crit",
  neutral: "border-line hover:border-line-strong",
};

const kindKicker: Record<NextAction["kind"], string> = {
  "retry-failed": "retry",
  escalate: "escalate",
  "verify-fix": "verify",
  "pin-and-compare": "compare",
  "investigate-hotspot": "investigate",
  "batch-apply": "batch",
};

type NextActionsRailProps = {
  actions: NextAction[];
  onSelect: (action: NextAction) => void;
};

/**
 * Horizontal rail of "next best actions" — Chrono's proactive nudges based on
 * fleet state + command history. Empty when the fleet doesn't need proactive
 * help.
 */
export function NextActionsRail({ actions, onSelect }: NextActionsRailProps) {
  if (actions.length === 0) return null;

  return (
    <section className="space-y-3">
      <p className="text-ink-3 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
        Suggested next
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => onSelect(action)}
            className={cn(
              "bg-surface flex flex-col gap-3 rounded-2xl border p-4 text-left transition-colors",
              toneCardClass[action.tone],
            )}
          >
            <span className="text-brand font-mono text-[9px] font-semibold tracking-[0.14em] uppercase">
              {kindKicker[action.kind]}
            </span>
            <p className="text-ink text-sm leading-snug font-medium">{action.headline}</p>
            <p className="text-ink-3 line-clamp-2 flex-1 text-xs leading-relaxed">
              {action.detail}
            </p>
            <ConfidenceMeter score={action.confidence} size="sm" />
          </button>
        ))}
      </div>
    </section>
  );
}
