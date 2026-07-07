"use client";

import { useConsole } from "../../console-provider";
import { FleetStats } from "./fleet-stats";
import { NeedsSection } from "./needs-section";
import { RecentMomentsPanel } from "./recent-moments-panel";

/**
 * The default stage — the "Console" pane the operator lands on. Shows fleet
 * state reconstructed at the playhead + the actionable-moments list. Right
 * sidebar lists the surrounding events. Fully responsive.
 */
export function ConsoleStage() {
  const { timeline } = useConsole();

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-8 px-5 py-6 sm:px-8 sm:py-8">
          <header className="space-y-1">
            <p className="text-ink-3 font-mono text-xs tracking-[0.14em] uppercase">
              What is happening · state reconstructed at the playhead
            </p>
            <p className="text-ink-3 text-xs">
              {timeline.state.openIncidentIds.length} open incidents ·{" "}
              {timeline.state.rollingUpdateIds.length} rolling updates ·{" "}
              {timeline.state.activeAutomationIds.length} active automations
            </p>
          </header>

          <FleetStats />
          <NeedsSection />
        </div>
      </div>
      <RecentMomentsPanel />
    </div>
  );
}
