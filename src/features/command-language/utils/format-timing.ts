import type { TimingKind } from "../types/command-language.types";

export type TimingParseResult = {
  kind: TimingKind;
  offsetMinutes?: number;
  humanText?: string;
};

const IN_PATTERN = /^in\s+(\d+)\s*(m|min|minute|minutes|h|hr|hour|hours|d|day|days)$/i;
const AT_PATTERN = /^at\s+(\d{1,2}):(\d{2})$/i;
const TOMORROW_AT_PATTERN = /^tomorrow(?:\s+at\s+(\d{1,2}):(\d{2}))?$/i;

/**
 * Parse a raw timing clause like "in 30m", "at 14:00", "tomorrow at 02:00",
 * "now", or "when …". Returns a coarse kind + optional offset in minutes.
 */
export const parseTimingClause = (raw: string): TimingParseResult => {
  const text = raw.trim().toLowerCase();
  if (text === "now") return { kind: "now", offsetMinutes: 0 };
  if (text.startsWith("when")) return { kind: "when" };

  const inMatch = IN_PATTERN.exec(text);
  if (inMatch) {
    const value = Number(inMatch[1]);
    const unit = inMatch[2][0];
    const minutes = unit === "d" ? value * 24 * 60 : unit === "h" ? value * 60 : value;
    return { kind: "in", offsetMinutes: minutes };
  }

  const tomorrowMatch = TOMORROW_AT_PATTERN.exec(text);
  if (tomorrowMatch) {
    const hours = tomorrowMatch[1] ? Number(tomorrowMatch[1]) : 9;
    const minutes = tomorrowMatch[2] ? Number(tomorrowMatch[2]) : 0;
    return {
      kind: "tomorrow",
      offsetMinutes: 24 * 60 + (hours * 60 + minutes) - new Date().getUTCHours() * 60,
    };
  }

  const atMatch = AT_PATTERN.exec(text);
  if (atMatch) {
    const hours = Number(atMatch[1]);
    const minutes = Number(atMatch[2]);
    // interpret as today at HH:MM (offset computed by planner against actual now)
    return { kind: "at", offsetMinutes: hours * 60 + minutes };
  }

  if (text.startsWith("in ")) {
    return { kind: "in" };
  }
  if (text.startsWith("at ")) {
    return { kind: "at" };
  }
  if (text.startsWith("tomorrow")) {
    return { kind: "tomorrow" };
  }

  return { kind: "now" };
};

/**
 * Compute an absolute effective timestamp for a timing clause anchored to
 * `nowIso`. Falls back to `nowIso` for kinds that cannot be resolved to a
 * concrete offset (e.g. "when cpu > 80").
 */
export const resolveEffectiveAt = (nowIso: string, parsed: TimingParseResult): string => {
  const nowMs = new Date(nowIso).getTime();
  if (parsed.kind === "now" || parsed.offsetMinutes === undefined) {
    return nowIso;
  }

  if (parsed.kind === "at") {
    // interpret HH:MM offset as clock-of-day today; if past, push to tomorrow.
    const nowDate = new Date(nowIso);
    const target = new Date(nowDate);
    const hours = Math.floor(parsed.offsetMinutes / 60);
    const minutes = parsed.offsetMinutes % 60;
    target.setUTCHours(hours, minutes, 0, 0);
    if (target.getTime() <= nowMs) target.setUTCDate(target.getUTCDate() + 1);
    return target.toISOString();
  }

  if (parsed.kind === "tomorrow") {
    const target = new Date(nowIso);
    target.setUTCDate(target.getUTCDate() + 1);
    if (parsed.offsetMinutes !== undefined) {
      target.setUTCHours(Math.floor((parsed.offsetMinutes % (24 * 60)) / 60));
      target.setUTCMinutes(parsed.offsetMinutes % 60);
      target.setUTCSeconds(0, 0);
    }
    return target.toISOString();
  }

  // "in <n>m|h|d"
  return new Date(nowMs + parsed.offsetMinutes * 60_000).toISOString();
};

/** Render a scheduled offset like "-2h 15m" / "in 30m". */
export const formatTimingOffset = (targetIso: string, nowIso: string): string => {
  const deltaMs = new Date(targetIso).getTime() - new Date(nowIso).getTime();
  const minutes = Math.round(deltaMs / 60_000);
  if (Math.abs(minutes) < 1) return "now";
  const sign = minutes < 0 ? "−" : "in ";
  const abs = Math.abs(minutes);
  if (abs < 60) return `${sign}${abs}m`;
  const hours = Math.floor(abs / 60);
  const mins = abs % 60;
  const suffix = mins > 0 ? `${hours}h${String(mins).padStart(2, "0")}` : `${hours}h`;
  return `${sign}${suffix}`;
};
