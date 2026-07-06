export type ClockListener = (now: string) => void;

export type Clock = {
  /** Current simulated time as ISO string. */
  now(): string;
  /** Subscribe to clock ticks. Returns unsubscribe. */
  subscribe(listener: ClockListener): () => void;
  /** Begin ticking. Safe to call repeatedly. */
  start(): void;
  /** Stop ticking. */
  stop(): void;
  /** Jump the simulated time to an arbitrary point. Emits a tick. */
  jumpTo(iso: string): void;
  /** Whether the clock is currently ticking. */
  isRunning(): boolean;
  /** Current simulated time as milliseconds. */
  nowMs(): number;
};

export type ClockOptions = {
  /** Simulated starting time (ISO). */
  startAt: string;
  /** How often to fire a tick in real-world milliseconds. Default: 1000. */
  tickMs?: number;
  /**
   * How much simulated time passes per tick.
   * 1 = realtime (1 sim second per 1 real second).
   * 60 = 1 real second = 1 sim minute.
   */
  scale?: number;
  /** If false, do not auto-start. Default: true. */
  autoStart?: boolean;
};
