import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { baseTimestampIso, offsetIso } from "../utils/timestamp.utils";
import { createClock } from "./clock";

const START = baseTimestampIso();

describe("createClock", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the starting time before any tick", () => {
    const clock = createClock({ startAt: START, autoStart: false });
    expect(clock.now()).toBe(START);
    expect(clock.isRunning()).toBe(false);
  });

  it("advances by tickMs * scale on each tick", () => {
    const clock = createClock({
      startAt: START,
      tickMs: 1000,
      scale: 60,
      autoStart: false,
    });
    clock.start();
    expect(clock.isRunning()).toBe(true);

    vi.advanceTimersByTime(3000);
    expect(clock.now()).toBe(offsetIso(START, 3));

    clock.stop();
    expect(clock.isRunning()).toBe(false);
  });

  it("emits ticks to every subscriber", () => {
    const clock = createClock({
      startAt: START,
      tickMs: 1000,
      autoStart: false,
    });
    const listenerA = vi.fn();
    const listenerB = vi.fn();
    clock.subscribe(listenerA);
    const unsubscribeB = clock.subscribe(listenerB);
    clock.start();

    vi.advanceTimersByTime(2000);
    expect(listenerA).toHaveBeenCalledTimes(2);
    expect(listenerB).toHaveBeenCalledTimes(2);

    unsubscribeB();
    vi.advanceTimersByTime(1000);
    expect(listenerA).toHaveBeenCalledTimes(3);
    expect(listenerB).toHaveBeenCalledTimes(2);

    clock.stop();
  });

  it("jumpTo overrides the current time and notifies subscribers", () => {
    const clock = createClock({ startAt: START, autoStart: false });
    const listener = vi.fn();
    clock.subscribe(listener);

    const target = offsetIso(START, 60 * 24);
    clock.jumpTo(target);
    expect(clock.now()).toBe(target);
    expect(listener).toHaveBeenCalledWith(target);
  });

  it("does not tick when stopped", () => {
    const clock = createClock({
      startAt: START,
      tickMs: 1000,
      autoStart: false,
    });
    const listener = vi.fn();
    clock.subscribe(listener);
    clock.start();
    clock.stop();

    vi.advanceTimersByTime(5000);
    expect(listener).not.toHaveBeenCalled();
    expect(clock.now()).toBe(START);
  });
});
