"use client";

import { useCallback, useMemo } from "react";
import { differenceInMinutes } from "@/features/fake-db";
import type { TimelineEvent } from "@/features/fake-db";
import { useConsole } from "../../console-provider";
import { ComparisonColumn } from "./compare/comparison-column";
import { DeltaSpine } from "./compare/delta-spine";
import { EventsBetween } from "./compare/events-between";

const formatOffset = (targetIso: string, nowIso: string): string => {
  const minutes = differenceInMinutes(targetIso, nowIso);
  if (Math.abs(minutes) < 1) return "now";
  const sign = minutes < 0 ? "−" : "+";
  const abs = Math.abs(minutes);
  if (abs < 60) return `${sign}${Math.round(abs)}m`;
  return `${sign}${(abs / 60).toFixed(1)}h`;
};

/**
 * Compare two pinned moments on one fleet. Follows the wireframe pattern:
 * centered kicker, three-column A | delta | B grid, then the *why* — the
 * timeline events that landed between the two pins, each clickable to
 * investigate. Exit is via the pin bar (clear pins) — no back button.
 */
export function CompareStage() {
  const { engine, timeline, setFocusedMoment } = useConsole();
  const { pins } = timeline;

  const { stateA, stateB } = useMemo(() => {
    if (!pins.A || !pins.B) return { stateA: null, stateB: null };
    return {
      stateA: engine.liveReconstructAt(pins.A),
      stateB: engine.liveReconstructAt(pins.B),
    };
  }, [engine, pins.A, pins.B]);

  const handleInvestigateEvent = useCallback(
    (event: TimelineEvent) => {
      timeline.setPlayhead(event.timestamp, { mode: "scrubbing" });
      if (event.incidentId) {
        // Clear pins so the derived stage transitions to investigate.
        timeline.clearPins();
        setFocusedMoment(event.incidentId);
      }
    },
    [timeline, setFocusedMoment],
  );

  if (!pins.A || !pins.B || !stateA || !stateB) {
    return null;
  }

  return (
    <div className="h-full min-h-0 overflow-y-auto">
      <div className="mx-auto max-w-5xl space-y-6 px-5 py-8 sm:px-8">
        <p className="text-ink-3 text-center font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
          What changed · comparing two moments on one fleet
        </p>

        <div className="grid gap-4 md:grid-cols-[1fr_120px_1fr]">
          <ComparisonColumn
            label={`A · ${formatOffset(pins.A, timeline.now)}`}
            timeLabel={new Date(pins.A).toISOString().slice(11, 16) + " UTC"}
            state={stateA}
          />
          <DeltaSpine a={stateA} b={stateB} />
          <ComparisonColumn
            label={`B · ${formatOffset(pins.B, timeline.now)}`}
            timeLabel={new Date(pins.B).toISOString().slice(11, 16) + " UTC"}
            state={stateB}
            emphasis
          />
        </div>

        <EventsBetween
          engine={engine}
          pinA={pins.A}
          pinB={pins.B}
          onInvestigate={handleInvestigateEvent}
        />

        <p className="text-ink-3 border-line-2 border-t pt-4 text-center font-mono text-[10px] tracking-[0.14em] uppercase">
          delta is B − A · green = improvement · red = regression · clear pins in the pin
          bar to exit
        </p>
      </div>
    </div>
  );
}
