import { parseIso } from "../utils/timestamp.utils";
import type { Clock, ClockListener, ClockOptions } from "./clock.types";

/**
 * Create a subscribable simulated clock. Pure TS — no React.
 *
 * The clock advances by `tickMs * scale` simulated milliseconds per real tick,
 * so consumers can compress or expand time. `subscribe` returns an unsubscribe
 * function; `jumpTo` bypasses interpolation and instantly moves the playhead.
 */
export const createClock = (options: ClockOptions): Clock => {
  const tickMs = options.tickMs ?? 1000;
  const scale = options.scale ?? 1;
  const autoStart = options.autoStart ?? true;

  let currentMs = parseIso(options.startAt);
  let intervalId: ReturnType<typeof setInterval> | null = null;
  const listeners = new Set<ClockListener>();

  const emit = () => {
    const nowIso = new Date(currentMs).toISOString();
    for (const listener of listeners) {
      listener(nowIso);
    }
  };

  const start = () => {
    if (intervalId !== null) return;
    if (typeof setInterval === "undefined") return;
    intervalId = setInterval(() => {
      currentMs += tickMs * scale;
      emit();
    }, tickMs);
  };

  const stop = () => {
    if (intervalId === null) return;
    clearInterval(intervalId);
    intervalId = null;
  };

  const jumpTo = (iso: string) => {
    currentMs = parseIso(iso);
    emit();
  };

  const subscribe = (listener: ClockListener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  if (autoStart) {
    start();
  }

  return {
    now: () => new Date(currentMs).toISOString(),
    nowMs: () => currentMs,
    subscribe,
    start,
    stop,
    jumpTo,
    isRunning: () => intervalId !== null,
  };
};
