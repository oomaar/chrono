import { cn } from "@/features/design-system";
import { confidenceBand } from "../utils/explain-confidence";
import type { ConfidenceBand } from "../types/intelligence.types";

const bandLabelDefault: Record<ConfidenceBand, string> = {
  high: "high confidence",
  medium: "medium confidence",
  low: "low confidence",
};

const bandColor: Record<
  ConfidenceBand,
  { text: string; track: string; fill: string; ring: string }
> = {
  high: {
    text: "text-brand",
    track: "bg-brand/12",
    fill: "bg-brand",
    ring: "ring-brand/25",
  },
  medium: {
    text: "text-warn",
    track: "bg-warn/12",
    fill: "bg-warn",
    ring: "ring-warn/25",
  },
  low: {
    text: "text-ink-3",
    track: "bg-ink-3/15",
    fill: "bg-ink-3",
    ring: "ring-ink-3/20",
  },
};

// Discrete Tailwind classes for the fill width so we never touch inline style.
const widthClass = (score: number): string => {
  const bucket = Math.max(0, Math.min(10, Math.round(score / 10)));
  return WIDTH_TABLE[bucket];
};

const WIDTH_TABLE: Record<number, string> = {
  0: "w-0",
  1: "w-[10%]",
  2: "w-[20%]",
  3: "w-[30%]",
  4: "w-[40%]",
  5: "w-[50%]",
  6: "w-[60%]",
  7: "w-[70%]",
  8: "w-[80%]",
  9: "w-[90%]",
  10: "w-full",
};

type ConfidenceMeterProps = {
  score: number;
  label?: string;
  size?: "sm" | "md";
  className?: string;
};

/**
 * A compact horizontal confidence meter — a labelled percentage plus a fill
 * bar whose color reflects the confidence band (brand > warn > neutral).
 * Deliberately styleless outside Tailwind classes.
 */
export function ConfidenceMeter({
  score,
  label,
  size = "md",
  className,
}: ConfidenceMeterProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const band = confidenceBand(clamped);
  const colors = bandColor[band];
  const displayLabel = label ?? bandLabelDefault[band];

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <span
          className={cn(
            "font-mono font-semibold tracking-[0.14em] uppercase",
            colors.text,
            size === "sm" ? "text-[9px]" : "text-[10px]",
          )}
        >
          {clamped}% · {displayLabel}
        </span>
      </div>
      <div
        className={cn(
          "relative overflow-hidden rounded-full",
          colors.track,
          size === "sm" ? "h-1" : "h-1.5",
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width]",
            colors.fill,
            widthClass(clamped),
          )}
        />
      </div>
    </div>
  );
}
