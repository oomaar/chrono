import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/features/design-system";
import type { SmartSummary, SummaryHighlight } from "../types/intelligence.types";

const toneClass: Record<SummaryHighlight["tone"], string> = {
  ok: "text-ok",
  warn: "text-warn",
  crit: "text-crit",
  brand: "text-brand",
  neutral: "text-ink-3",
};

const trendCopy: Record<
  SmartSummary["trend"],
  { label: string; className: string; Icon: typeof ArrowUpRight }
> = {
  improving: {
    label: "improving",
    className: "text-ok",
    Icon: ArrowDownRight,
  },
  steady: {
    label: "steady",
    className: "text-ink-3",
    Icon: Minus,
  },
  deteriorating: {
    label: "deteriorating",
    className: "text-crit",
    Icon: ArrowUpRight,
  },
};

const windowLabel = (minutes: number): string => {
  if (minutes < 60) return `last ${Math.round(minutes)}m`;
  const hours = minutes / 60;
  return `last ${hours === Math.round(hours) ? hours : hours.toFixed(1)}h`;
};

/**
 * Plain-English summary of the fleet at the current playhead. Structured as
 * a headline + a row of tone-coloured highlight chips so operators can scan
 * the state without hunting through numbers.
 */

type SmartSummaryCardProps = { summary: SmartSummary };

export function SmartSummaryCard({ summary }: SmartSummaryCardProps) {
  const trend = trendCopy[summary.trend];
  const TrendIcon = trend.Icon;

  return (
    <section className="border-line bg-surface flex flex-col gap-4 rounded-2xl border p-5">
      <div className="flex items-baseline gap-3">
        <span className="text-ink-3 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
          {windowLabel(summary.windowMinutes)} · smart summary
        </span>
        <span
          className={cn(
            "ml-auto inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.14em] uppercase",
            trend.className,
          )}
        >
          <TrendIcon size={11} />
          <span>{trend.label}</span>
        </span>
      </div>

      <p className="text-ink text-lg leading-snug font-semibold">{summary.headline}</p>

      {summary.highlights.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {summary.highlights.map((highlight, index) => (
            <li
              key={`${highlight.kicker}-${index}`}
              className="border-line bg-elev/60 flex items-center gap-2 rounded-lg border px-2.5 py-1.5"
            >
              <span
                className={cn(
                  "font-mono text-[9px] font-semibold tracking-[0.14em] uppercase",
                  toneClass[highlight.tone],
                )}
              >
                {highlight.kicker}
              </span>
              <span className="text-ink-2 text-xs">{highlight.text}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
