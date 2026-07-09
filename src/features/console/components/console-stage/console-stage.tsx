"use client";

import { useCallback } from "react";
import { useCommandLanguage } from "@/features/command-language";
import {
  DecisionQueue,
  NextActionsRail,
  SmartSummaryCard,
  useIntelligence,
  type DecisionItem,
  type NextAction,
} from "@/features/intelligence";
import { useConsole } from "../../console-provider";
import { CommandActivitySection } from "./command-activity-section";
import { FleetStats } from "./fleet-stats";
import { RecentMomentsPanel } from "./recent-moments-panel";

/**
 * The default "Console" pane. Blends the fleet snapshot with the intelligence
 * layer: smart summary at the top, ranked decision queue, and proactive next
 * actions. Right sidebar keeps the recent-moments feed.
 */
export function ConsoleStage() {
  const { setFocusedMoment, timeline } = useConsole();
  const { openExecute } = useCommandLanguage();
  const { summary, decisions, nextActions } = useIntelligence();

  const handleInvestigate = useCallback(
    (incidentId: string) => {
      setFocusedMoment(incidentId);
      const decision = decisions.find((d) => d.incident.id === incidentId);
      if (decision) {
        timeline.setPlayhead(decision.incident.openedAt, { mode: "scrubbing" });
      }
    },
    [decisions, setFocusedMoment, timeline],
  );

  const handleApprove = useCallback(
    (decision: DecisionItem) => {
      const command = decision.recommendation?.command;
      if (command) openExecute(command);
    },
    [openExecute],
  );

  const handleNextAction = useCallback(
    (action: NextAction) => {
      if (action.command) {
        openExecute(action.command);
        return;
      }
      if (action.incidentId) {
        setFocusedMoment(action.incidentId);
      }
    },
    [openExecute, setFocusedMoment],
  );

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-8 px-5 py-6 sm:px-8 sm:py-8">
          <SmartSummaryCard summary={summary} />

          <FleetStats />

          <section className="space-y-4">
            <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-ink text-sm font-semibold tracking-tight">
                Decision queue
              </h2>
              {decisions.length > 0 ? (
                <span className="text-crit font-mono text-xs font-semibold">
                  {decisions.length} open · ranked by attention
                </span>
              ) : null}
              <span className="text-ink-3 text-xs">
                — everything else is handled automatically
              </span>
            </header>
            <DecisionQueue
              decisions={decisions}
              onInvestigate={handleInvestigate}
              onApprove={handleApprove}
            />
          </section>

          <NextActionsRail actions={nextActions} onSelect={handleNextAction} />

          <CommandActivitySection />
        </div>
      </div>
      <RecentMomentsPanel />
    </div>
  );
}
