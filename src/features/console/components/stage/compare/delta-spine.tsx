import { cn } from "@/features/design-system";
import type { ReconstructedState } from "@/features/fake-db";

type DeltaSpineProps = {
  a: ReconstructedState;
  b: ReconstructedState;
};

const rows: Array<{
  label: string;
  compute: (s: ReconstructedState) => number;
  positiveIsGood: boolean;
}> = [
  { label: "online", compute: (s) => s.fleet.online, positiveIsGood: true },
  { label: "degraded", compute: (s) => s.fleet.degraded, positiveIsGood: false },
  { label: "offline", compute: (s) => s.fleet.offline, positiveIsGood: false },
  {
    label: "open incidents",
    compute: (s) => s.openIncidentIds.length,
    positiveIsGood: false,
  },
  {
    label: "rolling updates",
    compute: (s) => s.rollingUpdateIds.length,
    positiveIsGood: true,
  },
];

const formatDelta = (n: number): string => {
  if (n === 0) return "±0";
  return n > 0 ? `+${n}` : `${n}`;
};

const deltaClass = (delta: number, positiveIsGood: boolean): string => {
  if (delta === 0) return "text-ink-3 border-line";
  const isImprovement = positiveIsGood ? delta > 0 : delta < 0;
  return isImprovement ? "text-ok border-ok/30" : "text-crit border-crit/30";
};

/**
 * Middle "delta spine" column — shows the change from A to B for each metric,
 * colored green for improvements and red for regressions.
 */
export function DeltaSpine({ a, b }: DeltaSpineProps) {
  return (
    <div className="flex flex-col items-stretch gap-2 pt-17">
      {rows.map((row) => {
        const delta = row.compute(b) - row.compute(a);
        return (
          <div
            key={row.label}
            className={cn(
              "bg-surface-2 rounded-lg border px-3 py-2 text-center font-mono text-sm font-semibold tabular-nums",
              deltaClass(delta, row.positiveIsGood),
            )}
          >
            {formatDelta(delta)}
          </div>
        );
      })}
    </div>
  );
}
