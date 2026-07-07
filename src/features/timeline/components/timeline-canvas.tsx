"use client";

import { useCallback } from "react";
import type { LiveEngine, TimelineEvent } from "@/features/fake-db";
import { PinBar } from "./pin-bar";
import { TimelineAxis } from "./timeline-axis";
import { TimelineHeader } from "./timeline-header/timeline-header";
import { TimelineLanes } from "./timeline-lanes/timeline-lanes";
import { TimelineRibbon } from "./timeline-ribbon/timeline-ribbon";
import { useTimelineEngine } from "../hooks/use-timeline-engine";
import { useTimelineShortcuts } from "../hooks/use-timeline-shortcuts";
import type { EventCluster, TimelineMode, ZoomLevel } from "../types/timeline.types";

export type TimelineCanvasProps = {
  engine: LiveEngine;
  initialZoom?: ZoomLevel;
  initialMode?: TimelineMode;
  onMomentSelected?: (event: TimelineEvent) => void;
};

/**
 * Standalone Timeline Console — composes the header, ribbon, axis, and lanes
 * and drives them from the useTimelineEngine hook. Also binds keyboard
 * shortcuts and renders a pin bar for A/B compare pins.
 */
export function TimelineCanvas({
  engine,
  initialZoom,
  initialMode,
  onMomentSelected,
}: TimelineCanvasProps) {
  const timeline = useTimelineEngine({
    engine,
    initialZoom,
    initialMode,
  });

  useTimelineShortcuts(timeline);

  const eventsPerMinute =
    Math.round(
      (timeline.events.length / Math.max(1, timeline.window.durationMinutes)) * 10,
    ) / 10;

  const handleScrub = useCallback(
    (timestamp: string) => {
      timeline.setPlayhead(timestamp, { mode: "scrubbing" });
    },
    [timeline],
  );

  const handleMarkerClick = useCallback(
    (cluster: EventCluster) => {
      timeline.setPlayhead(cluster.timestamp, { mode: "scrubbing" });
      onMomentSelected?.(cluster.representative);
    },
    [timeline, onMomentSelected],
  );

  const handleToggleLive = useCallback(() => {
    if (timeline.mode === "live") {
      timeline.pause();
    } else {
      timeline.returnToNow();
    }
  }, [timeline]);

  return (
    <section className="border-line bg-surface flex flex-col gap-4 rounded-2xl border p-6">
      <TimelineHeader
        mode={timeline.mode}
        now={timeline.now}
        playhead={timeline.playhead}
        zoom={timeline.zoom}
        eventsPerMinute={eventsPerMinute}
        onSetZoom={timeline.setZoom}
        onPlay={timeline.play}
        onPause={timeline.pause}
        onStepBack={() => timeline.stepBy(-5)}
        onStepForward={() => timeline.stepBy(5)}
        onReturnToNow={timeline.returnToNow}
        onJump={timeline.jumpTo}
        onToggleLive={handleToggleLive}
      />

      <div className="flex flex-wrap items-center gap-2">
        <PinBar
          pins={timeline.pins}
          now={timeline.now}
          onJumpToPin={timeline.jumpToPin}
          onClearPin={timeline.clearPin}
          onClearAll={timeline.clearPins}
        />
        <span className="text-ink-3 ml-auto font-mono text-[10px] tracking-[0.14em] uppercase">
          keys: space play · arrows step · esc now · a/b pin
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <TimelineAxis window={timeline.window} now={timeline.now} zoom={timeline.zoom} />
        <TimelineRibbon
          window={timeline.window}
          buckets={timeline.buckets}
          events={timeline.events}
          playheadRatio={timeline.playheadRatio}
          mode={timeline.mode}
          isFutureVisible={timeline.isFutureVisible}
          pins={timeline.pins}
          onScrub={handleScrub}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      <TimelineLanes events={timeline.events} window={timeline.window} />

      <footer className="border-line-2 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3 text-xs">
        <span className="text-ink-3 font-mono text-[10px] tracking-[0.14em] uppercase">
          Reconstructed at playhead
        </span>
        <span className="text-ink">
          <span className="text-brand font-mono font-semibold tabular-nums">
            {timeline.state.fleet.online.toLocaleString()}
          </span>{" "}
          online
        </span>
        <span className="text-ink">
          <span className="text-warn font-mono font-semibold tabular-nums">
            {timeline.state.fleet.degraded.toLocaleString()}
          </span>{" "}
          degraded
        </span>
        <span className="text-ink">
          <span className="text-crit font-mono font-semibold tabular-nums">
            {timeline.state.fleet.offline.toLocaleString()}
          </span>{" "}
          offline
        </span>
        <span className="text-ink-3 ml-auto">
          {timeline.state.openIncidentIds.length} open incidents ·{" "}
          {timeline.state.rollingUpdateIds.length} rolling updates ·{" "}
          {timeline.state.activeAutomationIds.length} active automations
        </span>
      </footer>
    </section>
  );
}
