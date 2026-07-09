"use client";

import { useEffect, useState } from "react";
import { AnimatedCounter } from "../components/animated-counter";
import { ShowcaseRow, ShowcaseSection } from "./showcase-section";

/**
 * The `AnimatedCounter` primitive tweens between numeric values via
 * `motion/react` instead of snapping — used across Chrono for fleet stats,
 * attention scores, and any counter that should feel alive.
 */
export function AnimatedCounterShowcase() {
  // Auto-incrementing counter — increments every 1.4s to demo the tween.
  const [ticker, setTicker] = useState(2884);
  useEffect(() => {
    const id = window.setInterval(() => {
      setTicker((v) => v + Math.floor(Math.random() * 6) - 2);
    }, 1400);
    return () => window.clearInterval(id);
  }, []);

  // Randomized counter — jumps between wildly different values.
  const [scramble, setScramble] = useState(72);
  useEffect(() => {
    const id = window.setInterval(() => {
      setScramble(Math.floor(Math.random() * 100));
    }, 1800);
    return () => window.clearInterval(id);
  }, []);

  // Rate counter — decimal formatting.
  const [rate, setRate] = useState(1.6);
  useEffect(() => {
    const id = window.setInterval(() => {
      setRate(Number((0.8 + Math.random() * 3.2).toFixed(1)));
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <ShowcaseSection
      kicker="Motion · counters"
      title="AnimatedCounter"
      description="Tweens between numeric values via motion/react. Used for fleet stats, attention scores, and any counter that should breathe instead of snap."
    >
      <ShowcaseRow label="Static">
        <AnimatedCounter
          value={2884}
          className="text-brand font-mono text-3xl font-semibold tracking-tight"
        />
      </ShowcaseRow>

      <ShowcaseRow label="Live · ticking">
        <div className="flex flex-col gap-1">
          <AnimatedCounter
            value={ticker}
            className="text-ink font-mono text-3xl font-semibold tracking-tight"
          />
          <span className="text-ink-3 font-mono text-[10px] tracking-[0.14em] uppercase">
            +/-2 every 1.4s
          </span>
        </div>
      </ShowcaseRow>

      <ShowcaseRow label="Attention score">
        <div className="flex flex-col gap-1">
          <AnimatedCounter
            value={scramble}
            className="text-ink font-mono text-lg font-semibold tabular-nums"
          />
          <span className="text-ink-3 font-mono text-[10px] tracking-[0.14em] uppercase">
            0 – 100, resamples every 1.8s
          </span>
        </div>
      </ShowcaseRow>

      <ShowcaseRow label="Rate · decimal">
        <AnimatedCounter
          value={rate}
          durationMs={320}
          format={(v) => v.toFixed(1)}
          suffix="/min"
          className="text-ink-2 font-mono text-sm tracking-widest tabular-nums"
        />
      </ShowcaseRow>

      <ShowcaseRow label="Prefix + suffix">
        <div className="flex flex-wrap items-center gap-6">
          <AnimatedCounter
            value={12456}
            prefix="$"
            className="text-brand font-mono text-2xl font-semibold tabular-nums"
          />
          <AnimatedCounter
            value={96}
            suffix="%"
            className="text-ok font-mono text-2xl font-semibold tabular-nums"
          />
          <AnimatedCounter
            value={-14}
            className="text-crit font-mono text-2xl font-semibold tabular-nums"
          />
        </div>
      </ShowcaseRow>
    </ShowcaseSection>
  );
}
