"use client";

import { useCallback } from "react";
import {
  JumpMenu,
  PlaybackControls,
  TimelineAxis,
  TimelineLanes,
  TimelineRibbon,
  ZoomControls,
  type EventCluster,
} from "@/features/timeline";
import { useConsole } from "../console-provider";

/**
 * The always-present timeline spine: kicker + slim toolbar, axis, ribbon,
 * lane strips. Consumes state from ConsoleProvider so all interactions ripple
 * to the top rail and the stage.
 */
export function TimelineSpine() {
  const { timeline, setFocusedMoment } = useConsole();

  const handleScrub = useCallback(
    (timestamp: string) => {
      timeline.setPlayhead(timestamp, { mode: "scrubbing" });
    },
    [timeline],
  );

  const handleMarker = useCallback(
    (cluster: EventCluster) => {
      timeline.setPlayhead(cluster.timestamp, { mode: "scrubbing" });
      setFocusedMoment(cluster.representative.id);
    },
    [timeline, setFocusedMoment],
  );

  return (
    <div className="flex flex-col gap-3 px-4 py-4 sm:px-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-ink-3 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
          Fleet health · last 24h · drag to scrub, click a marker to investigate
        </p>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <PlaybackControls
            mode={timeline.mode}
            onPlay={timeline.play}
            onPause={timeline.pause}
            onStepBack={() => timeline.stepBy(-5)}
            onStepForward={() => timeline.stepBy(5)}
            onReturnToNow={timeline.returnToNow}
          />
          <ZoomControls zoom={timeline.zoom} onChange={timeline.setZoom} />
          <div className="hidden lg:block">
            <JumpMenu onJump={timeline.jumpTo} />
          </div>
        </div>
      </div>

      <TimelineAxis window={timeline.window} now={timeline.now} zoom={timeline.zoom} />
      <TimelineRibbon
        window={timeline.window}
        buckets={timeline.buckets}
        events={timeline.events}
        playheadRatio={timeline.playheadRatio}
        mode={timeline.mode}
        isFutureVisible={timeline.isFutureVisible}
        onScrub={handleScrub}
        onMarkerClick={handleMarker}
      />

      <div className="hidden md:block">
        <TimelineLanes events={timeline.events} window={timeline.window} />
      </div>
    </div>
  );
}
