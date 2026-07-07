import type { PlaybackRate, ZoomLevel } from "../types/timeline.types";

export const ZOOM_LEVELS: ZoomLevel[] = ["24h", "12h", "6h", "1h", "15m"];

export const ZOOM_MINUTES: Record<ZoomLevel, number> = {
  "24h": 24 * 60,
  "12h": 12 * 60,
  "6h": 6 * 60,
  "1h": 60,
  "15m": 15,
};

export const ZOOM_LABELS: Record<ZoomLevel, string> = {
  "24h": "24h",
  "12h": "12h",
  "6h": "6h",
  "1h": "1h",
  "15m": "15m",
};

/** How the window is split visually — past occupies this ratio; the rest is future. */
export const PAST_RATIO = 0.8;

/** Number of buckets in the ribbon waveform per zoom level. */
export const RIBBON_BUCKET_COUNT: Record<ZoomLevel, number> = {
  "24h": 84,
  "12h": 72,
  "6h": 60,
  "1h": 60,
  "15m": 45,
};

/** Minimum pixel distance between markers before clustering kicks in. */
export const MARKER_CLUSTER_DISTANCE_PX = 22;

/** Number of axis ticks to render per zoom level. */
export const AXIS_TICK_COUNT: Record<ZoomLevel, number> = {
  "24h": 6,
  "12h": 6,
  "6h": 6,
  "1h": 6,
  "15m": 5,
};

export const PLAYBACK_RATES: PlaybackRate[] = [1, 4, 15, 60, 240];

export const PLAYBACK_RATE_LABELS: Record<PlaybackRate, string> = {
  1: "1×",
  4: "4×",
  15: "15×",
  60: "60×",
  240: "240×",
};

export const DEFAULT_PLAYBACK_RATE: PlaybackRate = 60;

export const JUMP_PRESET_LABELS: Record<
  "-24h" | "-6h" | "-1h" | "-15m" | "now" | "+1h" | "+6h" | "+12h",
  string
> = {
  "-24h": "-24h",
  "-6h": "-6h",
  "-1h": "-1h",
  "-15m": "-15m",
  now: "now",
  "+1h": "+1h",
  "+6h": "+6h",
  "+12h": "+12h",
};
