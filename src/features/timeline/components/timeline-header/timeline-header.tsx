"use client";

import { differenceInMinutes } from "@/features/fake-db";
import { JumpMenu } from "./jump-menu";
import { LiveBadge } from "./live-badge";
import { PlaybackControls } from "./playback-controls";
import { ZoomControls } from "../zoom-controls";
import type { JumpPreset, TimelineMode, ZoomLevel } from "../../types/timeline.types";

type TimelineHeaderProps = {
  mode: TimelineMode;
  now: string;
  playhead: string;
  zoom: ZoomLevel;
  eventsPerMinute: number;
  onSetZoom: (zoom: ZoomLevel) => void;
  onPlay: () => void;
  onPause: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReturnToNow: () => void;
  onJump: (preset: JumpPreset) => void;
  onToggleLive: () => void;
};

const formatOffset = (playhead: string, now: string): string => {
  const minutes = differenceInMinutes(playhead, now);
  if (Math.abs(minutes) < 0.5) return "now · live";
  const sign = minutes < 0 ? "-" : "+";
  const abs = Math.abs(minutes);
  if (abs < 60) return `${sign}${Math.round(abs)}m from now`;
  const hours = abs / 60;
  return `${sign}${hours.toFixed(1)}h from now`;
};

export function TimelineHeader({
  mode,
  now,
  playhead,
  zoom,
  eventsPerMinute,
  onSetZoom,
  onPlay,
  onPause,
  onStepBack,
  onStepForward,
  onReturnToNow,
  onJump,
  onToggleLive,
}: TimelineHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-ink-3 font-mono text-[10px] tracking-[0.22em] uppercase">
          Fleet health
        </p>
        <span className="text-ink-2 text-sm">
          {mode === "live"
            ? "Reconstructed at the playhead — live"
            : mode === "playback"
              ? "Replaying"
              : "Scrubbing"}
          <span className="text-ink-3 ml-2 font-mono">
            · {formatOffset(playhead, now)}
          </span>
        </span>
        <div className="ml-auto flex items-center gap-2">
          <LiveBadge
            mode={mode}
            eventsPerMinute={eventsPerMinute}
            onClick={onToggleLive}
          />
          <span className="text-ink-2 font-mono text-xs tabular-nums">
            {new Date(now).toISOString().slice(11, 19)}
            <span className="text-ink-3"> UTC</span>
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <PlaybackControls
          mode={mode}
          onPlay={onPlay}
          onPause={onPause}
          onStepBack={onStepBack}
          onStepForward={onStepForward}
          onReturnToNow={onReturnToNow}
        />
        <ZoomControls zoom={zoom} onChange={onSetZoom} />
        <JumpMenu onJump={onJump} />
      </div>
    </div>
  );
}
