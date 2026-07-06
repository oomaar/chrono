"use client";

import { useSyncExternalStore } from "react";
import type { Clock } from "./clock.types";

/**
 * React hook that subscribes to a Clock and re-renders on every tick.
 * Returns the current simulated time as an ISO string.
 */
export function useClock(clock: Clock): string {
  return useSyncExternalStore(
    (listener) => clock.subscribe(listener),
    () => clock.now(),
    () => clock.now(),
  );
}
