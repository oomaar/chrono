"use client";

import { AnimatePresence } from "motion/react";
import { EmptyState } from "@/features/design-system";
import { useConsole } from "../../console-provider";
import { useNeeds } from "../../hooks/use-needs";
import { NeedCard } from "./need-card";

/**
 * "Moments that need a decision" — the operator's action list at the current
 * playhead. Shows the highest-severity open incidents with recommendations.
 */
export function NeedsSection() {
  const needs = useNeeds();
  const { setFocusedMoment, timeline } = useConsole();

  const handleInvestigate = (incidentId: string) => {
    setFocusedMoment(incidentId);
    // find the incident and jump the playhead there
    const need = needs.find((n) => n.incident.id === incidentId);
    if (need) timeline.setPlayhead(need.incident.openedAt, { mode: "scrubbing" });
  };

  return (
    <section className="space-y-4">
      <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-ink text-sm font-semibold tracking-tight">
          Moments that need a decision
        </h2>
        {needs.length > 0 ? (
          <span className="text-crit font-mono text-xs font-semibold">
            {needs.length} open
          </span>
        ) : null}
        <span className="text-ink-3 text-xs">
          — everything else is handled automatically
        </span>
      </header>

      {needs.length === 0 ? (
        <EmptyState
          kicker="All clear"
          title="No moments need a decision right now."
          description="Automation is handling the fleet. Scrub the timeline to look back."
        />
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {needs.map((need) => (
              <NeedCard
                key={need.incident.id}
                need={need}
                onInvestigate={handleInvestigate}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
