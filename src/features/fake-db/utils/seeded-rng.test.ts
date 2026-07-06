import { describe, expect, it } from "vitest";
import { createSeededRng } from "./seeded-rng";

describe("createSeededRng", () => {
  it("produces the same float sequence for the same seed", () => {
    const rngA = createSeededRng("chrono-test");
    const rngB = createSeededRng("chrono-test");

    const sequenceA = Array.from({ length: 5 }, () => rngA.float());
    const sequenceB = Array.from({ length: 5 }, () => rngB.float());

    expect(sequenceA).toEqual(sequenceB);
  });

  it("produces different sequences for different seeds", () => {
    const rngA = createSeededRng("chrono-a");
    const rngB = createSeededRng("chrono-b");

    const sequenceA = Array.from({ length: 5 }, () => rngA.float());
    const sequenceB = Array.from({ length: 5 }, () => rngB.float());

    expect(sequenceA).not.toEqual(sequenceB);
  });

  it("returns integers within the requested inclusive range", () => {
    const rng = createSeededRng("chrono-int");

    for (let i = 0; i < 100; i += 1) {
      const value = rng.int(5, 10);
      expect(value).toBeGreaterThanOrEqual(5);
      expect(value).toBeLessThanOrEqual(10);
      expect(Number.isInteger(value)).toBe(true);
    }
  });

  it("picks an element from the provided list", () => {
    const rng = createSeededRng("chrono-pick");
    const items = ["a", "b", "c", "d"] as const;

    for (let i = 0; i < 20; i += 1) {
      expect(items).toContain(rng.pick(items));
    }
  });

  it("shuffle returns a permutation of the input", () => {
    const rng = createSeededRng("chrono-shuffle");
    const input = [1, 2, 3, 4, 5];
    const shuffled = rng.shuffle(input);

    expect(shuffled).toHaveLength(input.length);
    expect([...shuffled].sort()).toEqual([...input].sort());
  });

  it("throws when picking from an empty list", () => {
    const rng = createSeededRng("chrono-empty");
    expect(() => rng.pick([])).toThrow();
  });

  it("throws when int range is invalid", () => {
    const rng = createSeededRng("chrono-invalid");
    expect(() => rng.int(10, 5)).toThrow();
  });
});
