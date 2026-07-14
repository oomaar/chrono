"use client";

import { ChevronLeft, ChevronRight, Pause, Play, SkipBack } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/features/design-system";
import type { TimelineMode } from "../../types/timeline.types";

type PlaybackControlsProps = {
  mode: TimelineMode;
  onPlay: () => void;
  onPause: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReturnToNow: () => void;
};

const buttonBase =
  "inline-flex h-7 w-7 items-center justify-center rounded-md border border-line bg-surface text-ink-2 transition-colors hover:border-line-strong hover:bg-elev hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40";

export function PlaybackControls({
  mode,
  onPlay,
  onPause,
  onStepBack,
  onStepForward,
  onReturnToNow,
}: PlaybackControlsProps) {
  const isPlaying = mode === "playback" || mode === "live";

  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={onStepBack}
        aria-label="Step 5 minutes back"
        className={buttonBase}
      >
        <ChevronLeft size={13} />
      </button>
      <button
        type="button"
        onClick={isPlaying ? onPause : onPlay}
        aria-label={isPlaying ? "Pause playback" : "Start playback"}
        className={cn(
          buttonBase,
          "relative",
          isPlaying && "border-brand/40 bg-brand/10 text-brand",
        )}
      >
        {isPlaying ? (
          <>
            <motion.span
              aria-hidden
              className="border-brand/30 pointer-events-none absolute inset-0 rounded-md border"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <Pause size={13} />
          </>
        ) : (
          <Play size={13} />
        )}
      </button>
      <button
        type="button"
        onClick={onStepForward}
        aria-label="Step 5 minutes forward"
        className={buttonBase}
      >
        <ChevronRight size={13} />
      </button>
      <span className="bg-line-2 mx-1 h-4 w-px" />
      <button
        type="button"
        onClick={onReturnToNow}
        aria-label="Return to now"
        className={cn(
          buttonBase,
          "w-auto min-w-fit gap-1.5 px-2.5 text-[10px] font-semibold tracking-[0.14em] uppercase",
        )}
      >
        <SkipBack size={11} />
        now
      </button>
    </div>
  );
}
