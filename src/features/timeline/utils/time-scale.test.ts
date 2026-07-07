import { describe, expect, it } from "vitest";
import { isoFromOffset } from "@/features/fake-db";
import {
  isWithinWindow,
  pointerRatio,
  ratioToTimestamp,
  timestampToRatio,
} from "./time-scale";

const window = {
  start: isoFromOffset(-60),
  end: isoFromOffset(60),
  durationMinutes: 120,
};

describe("time-scale", () => {
  it("maps the window start to ratio 0 and end to ratio 1", () => {
    expect(timestampToRatio(window.start, window)).toBe(0);
    expect(timestampToRatio(window.end, window)).toBe(1);
  });

  it("maps the midpoint to ratio 0.5", () => {
    expect(timestampToRatio(isoFromOffset(0), window)).toBeCloseTo(0.5, 5);
  });

  it("ratioToTimestamp is the inverse of timestampToRatio", () => {
    const timestamp = isoFromOffset(-15);
    const ratio = timestampToRatio(timestamp, window);
    expect(ratioToTimestamp(ratio, window)).toBe(timestamp);
  });

  it("clamps ratioToTimestamp inputs to [0, 1]", () => {
    expect(ratioToTimestamp(-0.5, window)).toBe(window.start);
    expect(ratioToTimestamp(1.5, window)).toBe(window.end);
  });

  it("isWithinWindow correctly detects membership", () => {
    expect(isWithinWindow(isoFromOffset(-30), window)).toBe(true);
    expect(isWithinWindow(isoFromOffset(200), window)).toBe(false);
  });

  it("pointerRatio maps clientX into [0, 1]", () => {
    const rect = { left: 100, width: 400 } as DOMRect;
    expect(pointerRatio(100, rect)).toBe(0);
    expect(pointerRatio(300, rect)).toBe(0.5);
    expect(pointerRatio(500, rect)).toBe(1);
    expect(pointerRatio(50, rect)).toBe(0);
    expect(pointerRatio(600, rect)).toBe(1);
  });
});
