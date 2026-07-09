"use client";

import { AnimatePresence } from "motion/react";
import { EmptyState } from "@/features/design-system";
import type { DecisionItem } from "../types/intelligence.types";
import { DecisionQueueItem } from "./decision-queue-item";

type DecisionQueueProps = {
  decisions: DecisionItem[];
  onInvestigate: (incidentId: string) => void;
  onApprove?: (decision: DecisionItem) => void;
};

/**
 * Attention-ranked list of moments that need a decision. Replaces the flat
 * "needs" section — each item shows its computed attention score, its
 * cluster membership (if any), and one-click approval when a canonical
 * command is available.
 */
export function DecisionQueue({
  decisions,
  onInvestigate,
  onApprove,
}: DecisionQueueProps) {
  if (decisions.length === 0) {
    return (
      <EmptyState
        kicker="All clear"
        title="No moments need a decision right now."
        description="Automation is handling the fleet. Scrub the timeline to look back."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {decisions.map((decision, index) => (
          <DecisionQueueItem
            key={decision.incident.id}
            decision={decision}
            rank={index + 1}
            onInvestigate={onInvestigate}
            onApprove={onApprove}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
