import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "../utils/cn";

type StatTone = "brand" | "ok" | "warn" | "crit" | "neutral";

type StatProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: ReactNode;
  tone?: StatTone;
  hint?: string;
  emphasis?: boolean;
  trailing?: ReactNode;
};

const toneValueClasses: Record<StatTone, string> = {
  brand: "text-brand",
  ok: "text-ok",
  warn: "text-warn",
  crit: "text-crit",
  neutral: "text-ink",
};

export function Stat({
  className,
  label,
  value,
  tone = "neutral",
  hint,
  emphasis = false,
  trailing,
  ...props
}: StatProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        emphasis ? "border-line-strong bg-elev" : "border-line bg-surface",
        className,
      )}
      {...props}
    >
      <div className="flex items-baseline justify-between gap-3">
        <p
          className={cn(
            "font-mono text-3xl font-semibold tracking-tight tabular-nums",
            toneValueClasses[tone],
          )}
        >
          {value}
        </p>
        {trailing}
      </div>
      <p className="text-ink-3 mt-1 text-xs">{label}</p>
      {hint ? (
        <p className="text-ink-3 mt-2 font-mono text-[10px] tracking-[0.14em]">{hint}</p>
      ) : null}
    </div>
  );
}
