export const colorTokenNames = {
  bg: "--color-bg",
  surface: "--color-surface",
  surface2: "--color-surface-2",
  elev: "--color-elev",
  ink: "--color-ink",
  ink2: "--color-ink-2",
  ink3: "--color-ink-3",
  line: "--color-line",
  line2: "--color-line-2",
  lineStrong: "--color-line-strong",
  brand: "--color-brand",
  ok: "--color-ok",
  warn: "--color-warn",
  crit: "--color-crit",
} as const;

export const radiusTokens = {
  xs: "0.375rem",
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
  xl: "1.5rem",
} as const;

export const motionTokens = {
  instant: 90,
  quick: 150,
  normal: 220,
  deliberate: 320,
} as const;

export const timelineTokens = {
  laneHeight: 96,
  majorTickMinutes: 30,
  minorTickMinutes: 5,
  playbackStepMs: 250,
} as const;

export const depthTokens = {
  base: 0,
  overlay: 20,
  popover: 40,
  modal: 60,
  toast: 80,
} as const;

export const designTokens = {
  colors: colorTokenNames,
  radius: radiusTokens,
  motion: motionTokens,
  timeline: timelineTokens,
  depth: depthTokens,
} as const;
