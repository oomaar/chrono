"use client";

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "../utils/cn";

type AnimatedCounterProps = {
  value: number;
  /** How long the tween takes. Defaults to 480ms. */
  durationMs?: number;
  /** Format the displayed number. Defaults to `toLocaleString()`. */
  format?: (value: number) => string;
  className?: string;
  /** Optional prefix / suffix rendered next to the number. */
  prefix?: string;
  suffix?: string;
};

const defaultFormat = (value: number): string => Math.round(value).toLocaleString();

/**
 * A numeric label that tweens between values instead of snapping. Uses
 * `motion/react`'s `animate` to interpolate on any change to `value`, so
 * fleet counters and attention scores feel responsive as the timeline
 * updates.
 *
 * Deliberately renders a single `<motion.span>` — safe to compose inside
 * heading elements as long as the parent controls typography.
 */
export function AnimatedCounter({
  value,
  durationMs = 480,
  format = defaultFormat,
  className,
  prefix,
  suffix,
}: AnimatedCounterProps) {
  const motionValue = useMotionValue(value);
  const rounded = useTransform(motionValue, (latest) => format(latest));
  const previous = useRef(value);

  useEffect(() => {
    if (previous.current === value) return;
    const controls = animate(motionValue, value, {
      duration: durationMs / 1000,
      ease: [0.2, 0.7, 0.3, 1],
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, motionValue, durationMs]);

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix ? <span>{prefix}</span> : null}
      <motion.span>{rounded}</motion.span>
      {suffix ? <span>{suffix}</span> : null}
    </span>
  );
}
