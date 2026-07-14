"use client";

import { useCallback, useMemo, useState } from "react";
import type { LiveEngine } from "@/features/fake-db";
import {
  offsetIso,
  parseIso,
  useClock,
  type ReconstructedState,
  type RibbonBucket,
  type TimeWindow,
  type TimelineEvent,
} from "@/features/fake-db";
import {
  DEFAULT_PLAYBACK_RATE,
  PAST_RATIO,
  RIBBON_BUCKET_COUNT,
  ZOOM_MINUTES,
} from "../utils/zoom-presets";
import type {
  JumpPreset,
  PinSlot,
  PinState,
  PlaybackRate,
  TimelineMode,
  ZoomLevel,
} from "../types/timeline.types";

export type UseTimelineEngineOptions = {
  engine: LiveEngine;
  initialZoom?: ZoomLevel;
  initialMode?: TimelineMode;
};

export type TimelineEngineApi = {
  now: string;
  playhead: string;
  playheadRatio: number;
  window: TimeWindow;
  windowStart: string;
  windowEnd: string;
  mode: TimelineMode;
  zoom: ZoomLevel;
  playbackRate: PlaybackRate;
  pins: PinState;
  buckets: RibbonBucket[];
  events: TimelineEvent[];
  state: ReconstructedState;
  isFutureVisible: boolean;
  setPlayhead: (timestamp: string, options?: { mode?: TimelineMode }) => void;
  setZoom: (zoom: ZoomLevel) => void;
  setPlaybackRate: (rate: PlaybackRate) => void;
  play: () => void;
  pause: () => void;
  stepBy: (minutes: number) => void;
  jumpTo: (preset: JumpPreset) => void;
  returnToNow: () => void;
  pinAt: (slot: PinSlot, timestamp: string) => void;
  clearPin: (slot: PinSlot) => void;
  clearPins: () => void;
  jumpToPin: (slot: PinSlot) => void;
};

const jumpPresetMinutes: Record<JumpPreset, number | "now"> = {
  "-24h": -24 * 60,
  "-6h": -6 * 60,
  "-1h": -60,
  "-15m": -15,
  now: "now",
  "+1h": 60,
  "+6h": 6 * 60,
  "+12h": 12 * 60,
};

/**
 * The master timeline hook. Owns playhead, mode, zoom, playback rate, and
 * pins, and derives everything a timeline UI needs from the underlying live
 * engine.
 */
export const useTimelineEngine = ({
  engine,
  initialZoom = "24h",
  initialMode = "live",
}: UseTimelineEngineOptions): TimelineEngineApi => {
  const now = useClock(engine.clock);

  const [zoom, setZoomState] = useState<ZoomLevel>(initialZoom);
  const [mode, setMode] = useState<TimelineMode>(initialMode);
  const [playhead, setPlayheadState] = useState<string>(() => now);
  const [playbackRate, setPlaybackRateState] =
    useState<PlaybackRate>(DEFAULT_PLAYBACK_RATE);
  const [pins, setPinsState] = useState<PinState>({ A: null, B: null });

  // In live mode the playhead is always "now" — no need to sync via effects.
  const effectivePlayhead = mode === "live" ? now : playhead;

  const setPlayhead = useCallback(
    (timestamp: string, options?: { mode?: TimelineMode }): void => {
      setPlayheadState(timestamp);
      if (options?.mode) setMode(options.mode);
      else if (mode === "live") setMode("scrubbing");
    },
    [mode],
  );

  const setZoom = useCallback((next: ZoomLevel) => {
    setZoomState(next);
  }, []);

  const setPlaybackRate = useCallback(
    (rate: PlaybackRate) => {
      setPlaybackRateState(rate);
      engine.clock.stop();
      engine.clock.start();
    },
    [engine.clock],
  );

  const play = useCallback(() => {
    // "Play" from a paused state returns us to live — the playhead re-syncs
    // to `now` and events stream in again. Without this, `mode` would flip
    // to "playback" but `effectivePlayhead` would stay frozen at the paused
    // timestamp, so the app appeared to freeze on resume.
    if (!engine.clock.isRunning()) engine.clock.start();
    setPlayheadState(now);
    setMode("live");
  }, [engine.clock, now]);

  const pause = useCallback(() => {
    engine.clock.stop();
    setMode("scrubbing");
  }, [engine.clock]);

  const stepBy = useCallback(
    (minutes: number) => {
      const next = offsetIso(effectivePlayhead, minutes);
      setPlayheadState(next);
      if (mode === "live") setMode("scrubbing");
    },
    [effectivePlayhead, mode],
  );

  const jumpTo = useCallback(
    (preset: JumpPreset) => {
      const offset = jumpPresetMinutes[preset];
      if (offset === "now") {
        setPlayheadState(now);
        setMode("live");
        return;
      }
      const target = offsetIso(now, offset);
      setPlayheadState(target);
      setMode("scrubbing");
    },
    [now],
  );

  const returnToNow = useCallback(() => {
    // If the operator paused earlier, the clock is stopped and `now` is
    // frozen — restart it so live mode is actually live.
    if (!engine.clock.isRunning()) engine.clock.start();
    setPlayheadState(now);
    setMode("live");
  }, [engine.clock, now]);

  const pinAt = useCallback((slot: PinSlot, timestamp: string) => {
    setPinsState((current) => ({ ...current, [slot]: timestamp }));
  }, []);

  const clearPin = useCallback((slot: PinSlot) => {
    setPinsState((current) => ({ ...current, [slot]: null }));
  }, []);

  const clearPins = useCallback(() => {
    setPinsState({ A: null, B: null });
  }, []);

  const jumpToPin = useCallback((slot: PinSlot) => {
    setPinsState((current) => {
      const target = current[slot];
      if (target) {
        setPlayheadState(target);
        setMode("scrubbing");
      }
      return current;
    });
  }, []);

  const window = useMemo<TimeWindow>(() => {
    const totalMinutes = ZOOM_MINUTES[zoom];
    const pastMinutes = totalMinutes * PAST_RATIO;
    const futureMinutes = totalMinutes - pastMinutes;
    const start = offsetIso(effectivePlayhead, -pastMinutes);
    const end = offsetIso(effectivePlayhead, futureMinutes);
    return { start, end, durationMinutes: totalMinutes };
  }, [effectivePlayhead, zoom]);

  const buckets = useMemo(
    () => engine.liveRibbonBuckets(window, RIBBON_BUCKET_COUNT[zoom]),
    [engine, window, zoom],
  );

  const events = useMemo(() => engine.liveEventsInWindow(window), [engine, window]);

  const state = useMemo(
    () => engine.liveReconstructAt(effectivePlayhead),
    [engine, effectivePlayhead],
  );

  const windowStartMs = parseIso(window.start);
  const windowEndMs = parseIso(window.end);
  const playheadMs = parseIso(effectivePlayhead);
  const playheadRatio =
    (playheadMs - windowStartMs) / Math.max(1, windowEndMs - windowStartMs);

  const nowMs = parseIso(now);
  const isFutureVisible = windowEndMs > nowMs;

  return {
    now,
    playhead: effectivePlayhead,
    playheadRatio,
    window,
    windowStart: window.start,
    windowEnd: window.end,
    mode,
    zoom,
    playbackRate,
    pins,
    buckets,
    events,
    state,
    isFutureVisible,
    setPlayhead,
    setZoom,
    setPlaybackRate,
    play,
    pause,
    stepBy,
    jumpTo,
    returnToNow,
    pinAt,
    clearPin,
    clearPins,
    jumpToPin,
  };
};
