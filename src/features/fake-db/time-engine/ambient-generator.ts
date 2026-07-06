import { TIMELINE_EVENT_KIND_TONE } from "../constants/lane.constants";
import type { FakeDb } from "../types/fake-db.types";
import type {
  TimelineEvent,
  TimelineEventKind,
  TimelineLane,
} from "../types/timeline-event.types";
import { createSeededRng } from "../utils/seeded-rng";
import { parseIso } from "../utils/timestamp.utils";

const MS_PER_MINUTE = 60_000;

export type AmbientEventGenerator = {
  /** All ambient events from the anchor up to (and including) the given ISO. */
  eventsUpTo(iso: string): TimelineEvent[];
  /** Ambient events that occurred strictly between two timestamps. */
  eventsBetween(sinceIso: string, untilIso: string): TimelineEvent[];
  /** Reset the internal cache (rarely needed). */
  reset(): void;
};

type Options = {
  /** Base seed. Same seed always yields the same ambient stream. */
  seed: string;
  /** Anchor time — minute 0 of the ambient stream. */
  anchor: string;
  /** Average events per simulated minute. Default: 1.4. */
  eventsPerMinute?: number;
};

const KIND_POOL: Array<{
  kind: TimelineEventKind;
  lane: TimelineLane;
  weight: number;
  buildSummary: (host: string) => string;
}> = [
  {
    kind: "device-online",
    lane: "connectivity",
    weight: 24,
    buildSummary: (host) => `${host} came back online`,
  },
  {
    kind: "device-offline",
    lane: "connectivity",
    weight: 18,
    buildSummary: (host) => `${host} went offline`,
  },
  {
    kind: "command-executed",
    lane: "fleet",
    weight: 20,
    buildSummary: (host) => `Diagnostics collected on ${host}`,
  },
  {
    kind: "policy-applied",
    lane: "compliance",
    weight: 14,
    buildSummary: (host) => `Policy re-applied to ${host}`,
  },
  {
    kind: "policy-drifted",
    lane: "compliance",
    weight: 10,
    buildSummary: (host) => `${host} drifted on baseline`,
  },
  {
    kind: "automation-fired",
    lane: "automation",
    weight: 8,
    buildSummary: (host) => `Automation acted on ${host}`,
  },
  {
    kind: "update-progressed",
    lane: "updates",
    weight: 6,
    buildSummary: (host) => `Update progressing on ${host}`,
  },
];

export const createAmbientEventGenerator = (
  db: FakeDb,
  options: Options,
): AmbientEventGenerator => {
  const anchorMs = parseIso(options.anchor);
  const rate = options.eventsPerMinute ?? 1.4;
  const cache = new Map<number, TimelineEvent[]>();

  const eventsForMinute = (minuteOffset: number): TimelineEvent[] => {
    const existing = cache.get(minuteOffset);
    if (existing) return existing;
    if (db.devices.length === 0) {
      cache.set(minuteOffset, []);
      return [];
    }

    // Each minute gets its own seeded RNG stream — deterministic per minute.
    const rng = createSeededRng(`${options.seed}:m${minuteOffset}`);

    // Poisson-ish sampling around the mean rate.
    const jitter = rng.float() - 0.5;
    const count = Math.max(0, Math.round(rate + jitter * 1.6));

    const events: TimelineEvent[] = [];
    for (let index = 0; index < count; index += 1) {
      const device = rng.pick(db.devices);
      const template = rng.pickWeighted(KIND_POOL);
      const withinMinuteMs = Math.floor(rng.float() * MS_PER_MINUTE);
      const timestamp = new Date(
        anchorMs + minuteOffset * MS_PER_MINUTE + withinMinuteMs,
      ).toISOString();

      events.push({
        id: rng.id("amb"),
        kind: template.kind,
        lane: template.lane,
        tone: TIMELINE_EVENT_KIND_TONE[template.kind],
        timestamp,
        summary: template.buildSummary(device.host),
        deviceIds: [device.id],
        reversible: false,
        future: false,
      });
    }

    cache.set(minuteOffset, events);
    return events;
  };

  const eventsUpTo = (iso: string): TimelineEvent[] => {
    const targetMs = parseIso(iso);
    if (targetMs < anchorMs) return [];

    const maxMinute = Math.floor((targetMs - anchorMs) / MS_PER_MINUTE);
    const all: TimelineEvent[] = [];
    for (let minute = 0; minute <= maxMinute; minute += 1) {
      const bucket = eventsForMinute(minute);
      for (const event of bucket) {
        if (parseIso(event.timestamp) <= targetMs) {
          all.push(event);
        }
      }
    }
    return all;
  };

  const eventsBetween = (sinceIso: string, untilIso: string): TimelineEvent[] => {
    const startMs = parseIso(sinceIso);
    const endMs = parseIso(untilIso);
    if (endMs < anchorMs) return [];

    const startMinute = Math.max(0, Math.floor((startMs - anchorMs) / MS_PER_MINUTE));
    const endMinute = Math.floor((endMs - anchorMs) / MS_PER_MINUTE);
    const all: TimelineEvent[] = [];
    for (let minute = startMinute; minute <= endMinute; minute += 1) {
      const bucket = eventsForMinute(minute);
      for (const event of bucket) {
        const eventMs = parseIso(event.timestamp);
        if (eventMs > startMs && eventMs <= endMs) {
          all.push(event);
        }
      }
    }
    return all;
  };

  const reset = () => {
    cache.clear();
  };

  return { eventsUpTo, eventsBetween, reset };
};
