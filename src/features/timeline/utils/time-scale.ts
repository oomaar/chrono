import type { TimeWindow } from "@/features/fake-db";
import { parseIso } from "@/features/fake-db";

/**
 * Convert a timestamp into a ratio in [0, 1] representing its position inside
 * the given window. Values below 0 or above 1 mean "off-window."
 */
export const timestampToRatio = (timestamp: string, window: TimeWindow): number => {
  const startMs = parseIso(window.start);
  const endMs = parseIso(window.end);
  const targetMs = parseIso(timestamp);
  const span = Math.max(1, endMs - startMs);
  return (targetMs - startMs) / span;
};

/** Inverse of `timestampToRatio`. */
export const ratioToTimestamp = (ratio: number, window: TimeWindow): string => {
  const startMs = parseIso(window.start);
  const endMs = parseIso(window.end);
  const clamped = Math.max(0, Math.min(1, ratio));
  const targetMs = startMs + clamped * (endMs - startMs);
  return new Date(targetMs).toISOString();
};

/** Convert a pointer clientX inside a bounding rect into a ratio. */
export const pointerRatio = (clientX: number, rect: DOMRect): number => {
  if (rect.width <= 0) return 0;
  const raw = (clientX - rect.left) / rect.width;
  return Math.max(0, Math.min(1, raw));
};

export const isWithinWindow = (timestamp: string, window: TimeWindow): boolean => {
  return timestamp >= window.start && timestamp <= window.end;
};
