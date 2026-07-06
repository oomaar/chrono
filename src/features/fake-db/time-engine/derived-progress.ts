import type { Update } from "../types/update.types";
import { differenceInMinutes } from "../utils/timestamp.utils";

/**
 * Realistic-feel default duration for a rolling update in Chrono demos.
 */
export const DEFAULT_ROLLING_DURATION_MINUTES = 55;

/**
 * Derive a live progress percentage for an update at a given point in time.
 *
 * - queued: always 0
 * - completed: always 100
 * - failed / paused: returns the frozen progress at that point (does not advance)
 * - rolling: interpolates linearly from `startedAt` over
 *   `estimatedDurationMinutes`, clamped to [update.progress, 100].
 *
 * The interpolation only ever *increases* the reported progress so a rolling
 * update never appears to regress even if the base data drifts.
 */
export const derivedUpdateProgress = (
  update: Update,
  atIso: string,
  estimatedDurationMinutes: number = DEFAULT_ROLLING_DURATION_MINUTES,
): number => {
  if (update.stage === "queued") return 0;
  if (update.stage === "completed") return 100;
  if (update.stage === "failed" || update.stage === "paused") return update.progress;

  const elapsed = differenceInMinutes(atIso, update.startedAt);
  if (elapsed <= 0) return update.progress;

  const interpolated = Math.min(
    100,
    Math.round((elapsed / Math.max(1, estimatedDurationMinutes)) * 100),
  );
  return Math.max(update.progress, interpolated);
};
