"use client";

import { Button } from "@/features/design-system";
import type { IncidentRecommendation } from "@/features/fake-db";

type RecommendationCardProps = {
  recommendation: IncidentRecommendation;
  onApprove?: () => void;
  onSnooze?: () => void;
};

/**
 * "Recommended fix" card — the actionable center of the Investigate stage.
 * Presents the fix, confidence, reversibility footnote, and two decisions.
 */
export function RecommendationCard({
  recommendation,
  onApprove,
  onSnooze,
}: RecommendationCardProps) {
  return (
    <aside className="border-line bg-surface w-full flex-none rounded-2xl border p-5 md:sticky md:top-0 md:w-80">
      <header className="flex items-center gap-2">
        <p className="text-brand font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
          Recommended fix
        </p>
        <span className="text-brand ml-auto font-mono text-xs font-semibold">
          {recommendation.confidence}% confident
        </span>
      </header>
      <p className="text-ink mt-3 text-sm leading-snug font-semibold">
        {recommendation.title}
      </p>
      <p className="text-ink-3 mt-2 text-xs leading-relaxed">{recommendation.detail}</p>
      <div className="mt-4 flex gap-2">
        <Button size="sm" onClick={onApprove} className="flex-1">
          Approve &amp; run
        </Button>
        <Button size="sm" variant="ghost" onClick={onSnooze}>
          Snooze
        </Button>
      </div>
      <p className="text-ink-3 mt-3 font-mono text-[10px] tracking-[0.14em]">
        ↳ commit drops a receipt on the timeline ·{" "}
        {recommendation.reversible ? "reversible" : "not reversible"}
      </p>
    </aside>
  );
}
