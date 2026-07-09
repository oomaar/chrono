"use client";

import { motion } from "motion/react";
import { Badge, cn } from "@/features/design-system";
import type { DecisionItem } from "../types/intelligence.types";
import { AttentionBar } from "./attention-bar";
import { ClusterBadge } from "./cluster-badge";
import { ConfidenceMeter } from "./confidence-meter";

const severityToneClass: Record<
  DecisionItem["incident"]["severity"],
  { dot: string; badge: "crit" | "warn" | "brand" | "outline" }
> = {
  crit: { dot: "bg-crit", badge: "crit" },
  high: { dot: "bg-warn", badge: "warn" },
  medium: { dot: "bg-brand", badge: "warn" },
  low: { dot: "bg-ink-3", badge: "outline" },
};

const formatAge = (minutes: number): string => {
  if (minutes < 1) return "just now";
  if (minutes < 60) return `-${Math.round(minutes)}m`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `-${hours}h${String(mins).padStart(2, "0")}` : `-${hours}h`;
};

type DecisionQueueItemProps = {
  decision: DecisionItem;
  rank: number;
  onInvestigate: (incidentId: string) => void;
  onApprove?: (decision: DecisionItem) => void;
};

/**
 * One row in the DecisionQueue — attention rank on the left, incident title
 * + cluster + confidence in the middle, action buttons on the right. Every
 * signal that made it rank comes through visually so the operator can trust
 * the ordering.
 */
export function DecisionQueueItem({
  decision,
  rank,
  onInvestigate,
  onApprove,
}: DecisionQueueItemProps) {
  const { incident, attention, recommendation, cluster } = decision;
  const tone = severityToneClass[incident.severity];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22, ease: [0.2, 0.7, 0.3, 1] }}
      className={cn(
        "group border-line bg-surface hover:border-line-strong hover:bg-elev rounded-2xl border p-4 transition-colors",
        "flex flex-col gap-3",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex flex-none flex-col items-center gap-1 pt-0.5">
          <span className="text-ink-3 font-mono text-[10px] tracking-[0.14em] tabular-nums">
            {String(rank).padStart(2, "0")}
          </span>
          <span aria-hidden className={cn("h-2 w-2 rounded-full", tone.dot)} />
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={tone.badge}>{incident.severity}</Badge>
            <span className="text-ink-3 font-mono text-[10px] tracking-[0.14em]">
              {formatAge(decision.ageMinutes)}
            </span>
            <span className="text-ink-3 font-mono text-[10px] tracking-[0.14em]">
              · {incident.affectedDeviceIds.length} device
              {incident.affectedDeviceIds.length === 1 ? "" : "s"}
            </span>
            {cluster && cluster.incidentIds.length > 1 ? (
              <ClusterBadge cluster={cluster} />
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onInvestigate(incident.id)}
            className="text-ink hover:text-brand block text-left text-sm font-medium transition-colors"
          >
            {incident.title}
          </button>
          {recommendation ? (
            <p className="text-ink-3 text-xs">Recommended: {recommendation.title}</p>
          ) : (
            <p className="text-ink-3 text-xs italic">
              No canonical fix yet — investigate to define one.
            </p>
          )}
        </div>

        <div className="flex flex-none flex-col items-end gap-2">
          <span className="text-ink-3 font-mono text-[9px] tracking-[0.14em] uppercase">
            attention
          </span>
          <span className="text-ink font-mono text-lg font-semibold tabular-nums">
            {attention.total}
          </span>
        </div>
      </div>

      <AttentionBar score={attention.total} />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-40 flex-1">
          {recommendation ? (
            <ConfidenceMeter score={recommendation.confidence} size="sm" />
          ) : null}
        </div>
        <div className="flex flex-none items-center gap-2">
          <button
            type="button"
            onClick={() => onInvestigate(incident.id)}
            className="border-line text-ink-2 hover:border-line-strong hover:text-ink rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase transition-colors"
          >
            investigate →
          </button>
          {recommendation?.command && onApprove ? (
            <button
              type="button"
              onClick={() => onApprove(decision)}
              className="bg-brand text-bg rounded-full px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase transition-opacity hover:opacity-90"
            >
              approve ⌘↵
            </button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
