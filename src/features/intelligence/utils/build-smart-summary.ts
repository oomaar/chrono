import type { FakeDb, Incident, TimelineEvent } from "@/features/fake-db";
import { differenceInMinutes } from "@/features/fake-db";
import type {
  IntelligenceContext,
  SmartSummary,
  SummaryHighlight,
} from "../types/intelligence.types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const hoursLabel = (minutes: number): string => {
  if (minutes < 60) return `${Math.round(minutes)}m`;
  const hours = minutes / 60;
  return hours === Math.round(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
};

/**
 * Given a set of incidents, return the office name that shows up most often
 * across their affected devices — Chrono's "hotspot" concept.
 */
const findHotspotOffice = (
  incidents: Incident[],
  db: FakeDb,
): { officeName: string | null; count: number } => {
  const counts = new Map<string, number>();
  for (const incident of incidents) {
    for (const deviceId of incident.affectedDeviceIds) {
      const device = db.devices.find((d) => d.id === deviceId);
      if (!device) continue;
      counts.set(device.officeId, (counts.get(device.officeId) ?? 0) + 1);
    }
  }
  let bestId: string | null = null;
  let bestCount = 0;
  for (const [id, count] of counts) {
    if (count > bestCount) {
      bestCount = count;
      bestId = id;
    }
  }
  if (!bestId) return { officeName: null, count: 0 };
  const office = db.offices.find((o) => o.id === bestId);
  return { officeName: office?.name ?? null, count: bestCount };
};

/**
 * Rough trend heuristic: compare crit+high events in the first half of the
 * window vs the second half.
 */
const detectTrend = (
  events: TimelineEvent[],
  nowIso: string,
  windowMinutes: number,
): SmartSummary["trend"] => {
  const windowStartMs = new Date(nowIso).getTime() - windowMinutes * 60 * 1000;
  const midpointMs = windowStartMs + (windowMinutes * 60 * 1000) / 2;

  let earlyBadness = 0;
  let lateBadness = 0;
  for (const event of events) {
    const ts = new Date(event.timestamp).getTime();
    if (ts < windowStartMs) continue;
    const weight = event.tone === "crit" ? 3 : event.tone === "warn" ? 1 : 0;
    if (weight === 0) continue;
    if (ts < midpointMs) earlyBadness += weight;
    else lateBadness += weight;
  }
  if (lateBadness === 0 && earlyBadness === 0) return "steady";
  const delta = lateBadness - earlyBadness;
  if (delta <= -2) return "improving";
  if (delta >= 2) return "deteriorating";
  return "steady";
};

const countEventsByKind = (events: TimelineEvent[]) => {
  const stats = {
    opened: 0,
    resolved: 0,
    autoRemediated: 0,
    deployed: 0,
    commands: 0,
    scheduled: 0,
  };
  for (const event of events) {
    switch (event.kind) {
      case "incident-opened":
        stats.opened += 1;
        break;
      case "incident-resolved":
      case "incident-mitigated":
        stats.resolved += 1;
        break;
      case "automation-fired":
        stats.autoRemediated += 1;
        break;
      case "update-completed":
      case "update-started":
        stats.deployed += 1;
        break;
      case "command-executed":
        stats.commands += 1;
        break;
      case "automation-scheduled":
        stats.scheduled += 1;
        break;
    }
  }
  return stats;
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a plain-English summary of what's happened in the last N minutes
 * plus the current state at the playhead. The result is intentionally
 * structured (headline + highlights) so the UI can lay it out nicely instead
 * of just dumping a paragraph.
 */
export const buildSmartSummary = (
  context: IntelligenceContext,
  windowMinutes = 6 * 60,
): SmartSummary => {
  const { db, state, events, nowIso } = context;

  const openIncidents = db.incidents.filter((incident) =>
    state.openIncidentIds.includes(incident.id),
  );

  const windowStartMs = new Date(nowIso).getTime() - windowMinutes * 60 * 1000;
  const eventsInWindow = events.filter(
    (event) => new Date(event.timestamp).getTime() >= windowStartMs,
  );

  const kindCounts = countEventsByKind(eventsInWindow);
  const trend = detectTrend(eventsInWindow, nowIso, windowMinutes);
  const hotspot = findHotspotOffice(openIncidents, db);

  const oldestOpen = openIncidents.reduce<Incident | null>((oldest, incident) => {
    if (!oldest) return incident;
    return incident.openedAt < oldest.openedAt ? incident : oldest;
  }, null);

  const oldestMinutes = oldestOpen
    ? Math.max(0, -differenceInMinutes(oldestOpen.openedAt, nowIso))
    : 0;

  const highlights: SummaryHighlight[] = [];

  if (kindCounts.opened > 0) {
    highlights.push({
      kicker: "New",
      text: `${kindCounts.opened} incident${kindCounts.opened === 1 ? "" : "s"} opened`,
      tone: kindCounts.opened >= 3 ? "crit" : "warn",
    });
  }
  if (kindCounts.resolved > 0) {
    highlights.push({
      kicker: "Cleared",
      text: `${kindCounts.resolved} incident${kindCounts.resolved === 1 ? "" : "s"} resolved`,
      tone: "ok",
    });
  }
  if (kindCounts.autoRemediated > 0) {
    highlights.push({
      kicker: "Auto",
      text: `${kindCounts.autoRemediated} automation${kindCounts.autoRemediated === 1 ? "" : "s"} fired`,
      tone: "brand",
    });
  }
  if (state.rollingUpdateIds.length > 0) {
    highlights.push({
      kicker: "In flight",
      text: `${state.rollingUpdateIds.length} rolling update${state.rollingUpdateIds.length === 1 ? "" : "s"}`,
      tone: "neutral",
    });
  }
  if (hotspot.officeName && hotspot.count >= 3 && openIncidents.length >= 2) {
    highlights.push({
      kicker: "Hotspot",
      text: `${hotspot.officeName} · ${hotspot.count} device signals`,
      tone: "warn",
    });
  }
  if (oldestOpen && oldestMinutes >= 60) {
    highlights.push({
      kicker: "Aging",
      text: `${oldestOpen.title} · open ${hoursLabel(oldestMinutes)}`,
      tone: "warn",
    });
  }

  const headlineParts: string[] = [];
  if (openIncidents.length === 0) {
    headlineParts.push("Fleet is calm.");
  } else {
    headlineParts.push(
      `${openIncidents.length} open incident${openIncidents.length === 1 ? "" : "s"}`,
    );
    if (hotspot.officeName && hotspot.count >= 2) {
      headlineParts.push(`concentrated in ${hotspot.officeName}`);
    }
  }
  if (trend === "improving") headlineParts.push("· signals easing");
  else if (trend === "deteriorating") headlineParts.push("· signals growing");

  return {
    headline: headlineParts.join(" "),
    windowMinutes,
    openIncidentCount: openIncidents.length,
    rollingUpdateCount: state.rollingUpdateIds.length,
    hotspotOffice: hotspot.officeName,
    trend,
    highlights,
  };
};
