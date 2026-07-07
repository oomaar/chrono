import type { TimelineEvent } from "@/features/fake-db";

export type TimelineMode = "live" | "scrubbing" | "playback";

export type ZoomLevel = "24h" | "12h" | "6h" | "1h" | "15m";

export type PlaybackRate = 1 | 4 | 15 | 60 | 240;

export type EventCluster = {
  id: string;
  representative: TimelineEvent;
  events: TimelineEvent[];
  timestamp: string;
  ratio: number;
  criticalCount: number;
  warnCount: number;
  okCount: number;
  brandCount: number;
};

export type JumpPreset = "-24h" | "-6h" | "-1h" | "-15m" | "now" | "+1h" | "+6h" | "+12h";
