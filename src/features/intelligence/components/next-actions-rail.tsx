"use client";

import { AnimatePresence, motion } from "motion/react";
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

const enterTransition = (delay: number) => ({
  duration: 0.32,
  ease: [0.2, 0.7, 0.3, 1] as const,
  delay,
});

/**
 * Horizontal rail of "next best actions" — Chrono's proactive nudges based on
 * fleet state + command history. Cards stagger in as the rail populates,
 * and shift when the ranking changes, so the operator sees the AI thinking.
 */
export function NextActionsRail({ actions, onSelect }: NextActionsRailProps) {
  if (actions.length === 0) return null;

  return (
    <section className="space-y-3">
      <p className="text-ink-3 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
        Suggested next
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <AnimatePresence initial={false} mode="popLayout">
          {actions.map((action, index) => (
            <motion.button
              key={action.id}
              layout
              type="button"
              onClick={() => onSelect(action)}
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={enterTransition(index * 0.06)}
              whileHover={{ y: -2 }}
              className={cn(
                "bg-surface flex flex-col gap-3 rounded-2xl border p-4 text-left transition-colors",
                toneCardClass[action.tone],
              )}
            >
              <span className="text-brand font-mono text-[9px] font-semibold tracking-[0.14em] uppercase">
                {kindKicker[action.kind]}
              </span>
              <p className="text-ink text-sm leading-snug font-medium">
                {action.headline}
              </p>
              <p className="text-ink-3 line-clamp-2 flex-1 text-xs leading-relaxed">
                {action.detail}
              </p>
              <ConfidenceMeter score={action.confidence} size="sm" />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
