export const DEFAULT_FAKE_DB_SEED = "chrono-v1";

/** Anchor "now" for deterministic universe generation. */
export const BASE_TIMESTAMP_MS = Date.UTC(2026, 6, 1, 12, 0, 0);

/** Default reconstruction window: 24h past. */
export const DEFAULT_WINDOW_MINUTES = 24 * 60;

/** How far into the future scheduled/predicted events extend. */
export const FUTURE_WINDOW_MINUTES = 12 * 60;

export const ENTITY_COUNTS = {
  teams: 5,
  users: 32,
  devices: 250,
  policies: 12,
  updates: 11,
  incidents: 20,
  commands: 80,
  automations: 10,
} as const;
