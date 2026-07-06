import { BASE_TIMESTAMP_MS } from "../constants/fake-db.constants";

const MS_PER_MINUTE = 60_000;

/** Anchor timestamp for the deterministic universe. */
export const baseTimestampMs = (): number => BASE_TIMESTAMP_MS;

export const baseTimestampIso = (): string => new Date(BASE_TIMESTAMP_MS).toISOString();

/**
 * Convert an offset (minutes) relative to the base timestamp into an ISO string.
 * Positive offset = future, negative = past.
 */
export const isoFromOffset = (minutesFromBase: number): string =>
  new Date(BASE_TIMESTAMP_MS + minutesFromBase * MS_PER_MINUTE).toISOString();

/** Convenience: N minutes ago (positive number). */
export const isoMinutesAgo = (minutesAgo: number): string =>
  isoFromOffset(-Math.abs(minutesAgo));

/** Convenience: N minutes in the future (positive number). */
export const isoMinutesAhead = (minutesAhead: number): string =>
  isoFromOffset(Math.abs(minutesAhead));

export const parseIso = (iso: string): number => new Date(iso).getTime();

export const differenceInMinutes = (later: string, earlier: string): number =>
  (parseIso(later) - parseIso(earlier)) / MS_PER_MINUTE;

export const offsetIso = (iso: string, minutes: number): string =>
  new Date(parseIso(iso) + minutes * MS_PER_MINUTE).toISOString();

export const clampToWindow = (
  iso: string,
  windowStart: string,
  windowEnd: string,
): string => {
  const value = parseIso(iso);
  const start = parseIso(windowStart);
  const end = parseIso(windowEnd);
  return new Date(Math.max(start, Math.min(end, value))).toISOString();
};
