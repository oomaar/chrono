"use client";

import { useCallback, useMemo } from "react";
import { cn } from "@/features/design-system";
import type { TimelineEvent, TimeWindow } from "@/features/fake-db";
import { RibbonFutureShade } from "./ribbon-future-shade";
import { RibbonHoverGhost } from "./ribbon-hover-ghost";
import { RibbonMarkers } from "./ribbon-markers";
import { RibbonPlayhead } from "./ribbon-playhead";
import { RibbonWaveform } from "./ribbon-waveform";
import { useElementWidth } from "../../hooks/use-element-width";
import { useEventGroups } from "../../hooks/use-event-groups";
import { useScrubber } from "../../hooks/use-scrubber";
import type { EventCluster, TimelineMode } from "../../types/timeline.types";
import type { RibbonBucket } from "@/features/fake-db";

type TimelineRibbonProps = {
  window: TimeWindow;
  buckets: RibbonBucket[];
  events: TimelineEvent[];
  playheadRatio: number;
  mode: TimelineMode;
  isFutureVisible: boolean;
  onScrub: (timestamp: string) => void;
  onMarkerClick: (cluster: EventCluster) => void;
};

/**
 * The scrubbable ribbon. Composes future shade + waveform + markers + hover
 * ghost + playhead into a single interactive surface driven by useScrubber.
 */
export function TimelineRibbon({
  window,
  buckets,
  events,
  playheadRatio,
  mode,
  isFutureVisible,
  onScrub,
  onMarkerClick,
}: TimelineRibbonProps) {
  const {
    ref,
    hoverRatio,
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerLeave,
  } = useScrubber({ window, onScrub });
  const width = useElementWidth(ref);
  const clusters = useEventGroups({
    events,
    window,
    ribbonWidthPx: width,
  });

  const handleMarkerClick = useCallback(
    (cluster: EventCluster) => {
      onMarkerClick(cluster);
    },
    [onMarkerClick],
  );

  const animated = useMemo(() => mode !== "scrubbing", [mode]);
  const hoverGhostRatio = isDragging ? null : hoverRatio;

  return (
    <div
      ref={ref}
      role="slider"
      aria-label="Timeline scrubber"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(playheadRatio * 100)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      className={cn(
        "border-line bg-bg relative h-20 overflow-hidden rounded-xl border select-none",
        isDragging ? "cursor-grabbing" : "cursor-ew-resize",
      )}
    >
      <RibbonFutureShade visible={isFutureVisible} />
      <RibbonWaveform buckets={buckets} />
      <RibbonMarkers clusters={clusters} onMarkerClick={handleMarkerClick} />
      <RibbonHoverGhost ratio={hoverGhostRatio} />
      <RibbonPlayhead ratio={playheadRatio} mode={mode} animated={animated} />
    </div>
  );
}
