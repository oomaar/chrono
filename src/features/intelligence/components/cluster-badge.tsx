import { cn } from "@/features/design-system";
import type { Incident } from "@/features/fake-db";
import type { IncidentCluster } from "../types/intelligence.types";

const worstToneClass: Record<Incident["severity"], string> = {
  crit: "border-crit/40 text-crit bg-crit/10",
  high: "border-warn/40 text-warn bg-warn/10",
  medium: "border-brand/40 text-brand bg-brand/10",
  low: "border-line text-ink-3 bg-surface-2",
};

/**
 * A pill that shows how many related incidents share a "situation" plus the
 * top reason. Meant to sit inline next to an incident title so it's obvious
 * the moment isn't happening alone.
 */
type ClusterBadgeProps = {
  cluster: IncidentCluster;
  size?: "sm" | "md";
  className?: string;
};

export function ClusterBadge({ cluster, size = "sm", className }: ClusterBadgeProps) {
  if (cluster.incidentIds.length <= 1) return null;

  const siblings = cluster.incidentIds.length - 1;
  const topReason = cluster.reasons[0]?.label ?? "related signal";

  return (
    <span
      className={cn(
        "inline-flex flex-none items-center gap-1.5 rounded-full border font-mono tracking-[0.12em] uppercase",
        worstToneClass[cluster.worstSeverity],
        size === "sm" ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-1 text-[10px]",
        className,
      )}
      title={cluster.reasons.map((r) => r.label).join(" · ")}
    >
      <span className="text-current">▚</span>
      <span>
        + {siblings} related · {topReason.toLowerCase()}
      </span>
    </span>
  );
}
