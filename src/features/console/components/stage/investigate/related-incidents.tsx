"use client";

import { cn } from "@/features/design-system";
import type { Incident } from "@/features/fake-db";
import type { IncidentCluster } from "@/features/intelligence";
import { useConsole } from "../../../console-provider";

const severityDotClass: Record<Incident["severity"], string> = {
  crit: "bg-crit",
  high: "bg-warn",
  medium: "bg-brand",
  low: "bg-ink-3",
};

type RelatedIncidentsProps = {
  cluster: IncidentCluster;
  currentIncidentId: string;
  onOpen: (incidentId: string) => void;
};

/**
 * The "situation" strip that renders under the causal chain when the current
 * incident is part of a cluster. Lists sibling incidents with severity dot,
 * title, and affected count — clicking one pivots the investigate stage to
 * that moment without leaving the current situation context.
 */
export function RelatedIncidents({
  cluster,
  currentIncidentId,
  onOpen,
}: RelatedIncidentsProps) {
  const { db } = useConsole();
  const siblings = cluster.incidentIds
    .filter((id) => id !== currentIncidentId)
    .map((id) => db.incidents.find((i) => i.id === id))
    .filter((incident): incident is Incident => Boolean(incident));

  if (siblings.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-baseline gap-2">
        <p className="text-ink-3 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
          Situation · {cluster.incidentIds.length} related incidents
        </p>
        <span className="text-ink-3 text-[11px]">
          — {cluster.reasons.map((r) => r.label.toLowerCase()).join(" · ")}
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {siblings.map((sibling) => (
          <li key={sibling.id}>
            <button
              type="button"
              onClick={() => onOpen(sibling.id)}
              className="group border-line bg-surface hover:border-line-strong hover:bg-elev flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors"
            >
              <span
                aria-hidden
                className={cn(
                  "h-2 w-2 flex-none rounded-full",
                  severityDotClass[sibling.severity],
                )}
              />
              <span className="text-ink flex-1 truncate text-xs font-medium">
                {sibling.title}
              </span>
              <span className="text-ink-3 font-mono text-[10px] tracking-[0.14em]">
                {sibling.affectedDeviceIds.length} device
                {sibling.affectedDeviceIds.length === 1 ? "" : "s"}
              </span>
              <span className="text-ink-3 group-hover:text-ink font-mono text-[10px] tracking-[0.14em]">
                investigate →
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
