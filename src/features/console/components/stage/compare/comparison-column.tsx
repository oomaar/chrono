import { cn } from "@/features/design-system";
import type { FleetSnapshot, ReconstructedState } from "@/features/fake-db";

type ComparisonColumnProps = {
  label: string;
  timeLabel: string;
  state: ReconstructedState;
  emphasis?: boolean;
};

const rows: {
  key: keyof FleetSnapshot;
  label: string;
  tone: "brand" | "warn" | "crit" | "neutral";
}[] = [
  { key: "online", label: "online", tone: "brand" },
  { key: "degraded", label: "degraded", tone: "warn" },
  { key: "offline", label: "offline", tone: "crit" },
  { key: "isolated", label: "isolated", tone: "crit" },
  { key: "nonCompliant", label: "non-compliant", tone: "warn" },
  { key: "maintenance", label: "maintenance", tone: "neutral" },
];

const valueClass: Record<"brand" | "warn" | "crit" | "neutral", string> = {
  brand: "text-brand",
  warn: "text-warn",
  crit: "text-crit",
  neutral: "text-ink",
};

/**
 * One side of the compare grid — pinned label + moment offset + fleet rows
 * reconstructed at that moment. The `emphasis` variant is used for pin B
 * (the "later" or "target" moment) with a brand border and glow.
 */
export function ComparisonColumn({
  label,
  timeLabel,
  state,
  emphasis = false,
}: ComparisonColumnProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-5",
        emphasis
          ? "border-brand bg-surface shadow-[0_0_0_1px_rgba(198,242,78,0.12)]"
          : "border-line bg-surface",
      )}
    >
      <header className="flex items-center gap-2">
        <span
          className={cn("h-2 w-2 rounded-full", emphasis ? "bg-brand" : "bg-ink-2")}
        />
        <span className="text-ink font-mono text-xs font-semibold tracking-tight">
          {label}
        </span>
        <span className="text-ink-3 ml-auto font-mono text-[10px] tracking-[0.14em]">
          {timeLabel}
        </span>
      </header>
      <dl className="border-line-2 mt-4 divide-y">
        {rows.map((row) => {
          const value = state.fleet[row.key];
          return (
            <div key={row.key} className="flex items-center justify-between py-2 text-xs">
              <dt className="text-ink-3">{row.label}</dt>
              <dd
                className={cn(
                  "font-mono text-sm font-semibold tabular-nums",
                  valueClass[row.tone],
                )}
              >
                {value.toLocaleString()}
              </dd>
            </div>
          );
        })}
        <div className="flex items-center justify-between py-2 text-xs">
          <dt className="text-ink-3">open incidents</dt>
          <dd className="text-ink font-mono text-sm font-semibold tabular-nums">
            {state.openIncidentIds.length}
          </dd>
        </div>
        <div className="flex items-center justify-between py-2 text-xs">
          <dt className="text-ink-3">rolling updates</dt>
          <dd className="text-ink font-mono text-sm font-semibold tabular-nums">
            {state.rollingUpdateIds.length}
          </dd>
        </div>
      </dl>
    </div>
  );
}
