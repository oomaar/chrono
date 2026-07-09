"use client";

import { useState } from "react";
import { Button } from "@/features/design-system";
import type { Incident, IncidentRecommendation } from "@/features/fake-db";
import {
  ConfidenceMeter,
  explainRecommendationConfidence,
} from "@/features/intelligence";

type RecommendationCardProps = {
  recommendation: IncidentRecommendation;
  incident: Incident;
  onApprove?: () => void;
  onSnooze?: () => void;
};

/**
 * "Recommended fix" card — the actionable center of the Investigate stage.
 * Shows the fix, a visual confidence meter, and an expandable factor
 * breakdown so operators can see *why* the score is what it is.
 */
export function RecommendationCard({
  recommendation,
  incident,
  onApprove,
  onSnooze,
}: RecommendationCardProps) {
  const [showFactors, setShowFactors] = useState(false);
  const breakdown = explainRecommendationConfidence(incident);

  return (
    <aside className="border-line bg-surface w-full flex-none rounded-2xl border p-5 md:sticky md:top-0 md:w-80">
      <header>
        <p className="text-brand font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
          Recommended fix
        </p>
      </header>
      <p className="text-ink mt-3 text-sm leading-snug font-semibold">
        {recommendation.title}
      </p>
      <p className="text-ink-3 mt-2 text-xs leading-relaxed">{recommendation.detail}</p>

      <div className="mt-4">
        <ConfidenceMeter score={recommendation.confidence} />
        <button
          type="button"
          onClick={() => setShowFactors((v) => !v)}
          className="text-ink-3 hover:text-ink mt-2 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors"
        >
          {showFactors ? "hide" : "why?"} · {breakdown.factors.length} factors
        </button>
        {showFactors ? (
          <ul className="border-line-2 mt-2 space-y-1.5 border-t pt-2">
            {breakdown.factors.map((factor) => (
              <li key={factor.label} className="flex items-baseline gap-2">
                <span className="text-ink-2 flex-1 text-[11px]">{factor.label}</span>
                <span className="text-ink-3 flex-1 text-[10px] leading-tight">
                  {factor.detail}
                </span>
                <span className="text-ink font-mono text-[11px] tabular-nums">
                  +{factor.contribution}
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

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
