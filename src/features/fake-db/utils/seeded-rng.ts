export type SeededRng = {
  seed: string;
  float: () => number;
  int: (min: number, max: number) => number;
  bool: (truthyProbability?: number) => boolean;
  pick: <T>(items: readonly T[]) => T;
  shuffle: <T>(items: readonly T[]) => T[];
  id: (prefix: string) => string;
};

const xmur3 = (source: string): (() => number) => {
  let hash = 1779033703 ^ source.length;

  for (let index = 0; index < source.length; index += 1) {
    hash = Math.imul(hash ^ source.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    hash ^= hash >>> 16;
    return hash >>> 0;
  };
};

const mulberry32 = (seed: number): (() => number) => {
  let state = seed;

  return () => {
    state += 0x6d2b79f5;
    let temp = state;
    temp = Math.imul(temp ^ (temp >>> 15), temp | 1);
    temp ^= temp + Math.imul(temp ^ (temp >>> 7), temp | 61);
    return ((temp ^ (temp >>> 14)) >>> 0) / 4294967296;
  };
};

const normalizeSeed = (seed: string | number): string => {
  if (typeof seed === "number") {
    return String(seed);
  }

  return seed;
};

export const createSeededRng = (seedInput: string | number): SeededRng => {
  const seed = normalizeSeed(seedInput);
  const hashSeed = xmur3(seed)();
  const random = mulberry32(hashSeed);

  const float = () => random();

  const int = (min: number, max: number) => {
    if (max < min) {
      throw new Error("Expected max to be greater than or equal to min");
    }

    return Math.floor(float() * (max - min + 1)) + min;
  };

  const bool = (truthyProbability = 0.5) => {
    return float() <= truthyProbability;
  };

  const pick = <T>(items: readonly T[]): T => {
    if (items.length === 0) {
      throw new Error("Cannot pick from an empty list");
    }

    return items[int(0, items.length - 1)];
  };

  const shuffle = <T>(items: readonly T[]): T[] => {
    const next = [...items];

    for (let index = next.length - 1; index > 0; index -= 1) {
      const target = int(0, index);
      const current = next[index];
      next[index] = next[target];
      next[target] = current;
    }

    return next;
  };

  const id = (prefix: string) => {
    return `${prefix}_${Math.floor(float() * 1_000_000_000)
      .toString(36)
      .padStart(6, "0")}`;
  };

  return {
    seed,
    float,
    int,
    bool,
    pick,
    shuffle,
    id,
  };
};
