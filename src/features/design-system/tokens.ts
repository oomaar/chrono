export const colorTokenNames = {
  bgCanvas: "--color-bg-canvas",
  bgSurface: "--color-bg-surface",
  bgElevated: "--color-bg-elevated",
  textPrimary: "--color-text-primary",
  textMuted: "--color-text-muted",
  borderSubtle: "--color-border-subtle",
  accentCyan: "--color-accent-cyan",
  accentAmber: "--color-accent-amber",
  danger: "--color-danger",
  success: "--color-success",
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
