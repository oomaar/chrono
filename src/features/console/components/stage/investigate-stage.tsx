"use client";

import { useMemo } from "react";
import { Button, toast } from "@/features/design-system";
import { differenceInMinutes } from "@/features/fake-db";
import type { Incident } from "@/features/fake-db";
import { useCommandLanguage } from "@/features/command-language";
import { ClusterBadge, useIntelligence } from "@/features/intelligence";
import { useConsole } from "../../console-provider";
import { AffectedDevices } from "./investigate/affected-devices";
import { CausalChain } from "./investigate/causal-chain";
import { RecommendationCard } from "./investigate/recommendation-card";
import { RelatedIncidents } from "./investigate/related-incidents";

const severityDotClass: Record<Incident["severity"], string> = {
  crit: "bg-crit shadow-[0_0_0_4px_rgba(230,74,74,0.18)]",
  high: "bg-warn shadow-[0_0_0_4px_rgba(230,163,58,0.18)]",
  medium: "bg-brand shadow-[0_0_0_4px_rgba(198,242,78,0.16)]",
  low: "bg-ink-3 shadow-[0_0_0_4px_rgba(120,120,110,0.14)]",
};

const severityKicker: Record<Incident["severity"], string> = {
  crit: "critical incident",
  high: "high-severity moment",
  medium: "medium-severity moment",
  low: "low-severity moment",
};

/**
 * "What happened" — a moment reconstructed with its causal chain, affected
 * fleet, and recommended fix. The intelligence layer adds a cluster badge
 * (if this moment sits inside a broader situation) and a related-incidents
 * strip so operators can pivot from one signal to the group.
 */
export function InvestigateStage() {
  const { db, focusedMomentId, timeline, setFocusedMoment } = useConsole();
  const { openExecute } = useCommandLanguage();
  const { clusters } = useIntelligence();

  const incident = useMemo(
    () => db.incidents.find((i) => i.id === focusedMomentId) ?? null,
    [db, focusedMomentId],
  );

  const cluster = useMemo(() => {
    if (!incident) return null;
    return clusters.find((c) => c.incidentIds.includes(incident.id)) ?? null;
  }, [clusters, incident]);

  if (!incident) return null;

  const timeOffset = Math.abs(differenceInMinutes(incident.openedAt, timeline.now));
  const timeLabel =
    timeOffset < 60
      ? `−${Math.round(timeOffset)}m from now`
      : `−${(timeOffset / 60).toFixed(1)}h from now`;

  const handleApprove = () => {
    if (!incident.recommendation?.command) {
      toast("No canonical command for this recommendation", {
        description: incident.recommendation?.title,
      });
      return;
    }
    openExecute(incident.recommendation.command);
  };

  const pinAsA = () => timeline.pinAt("A", incident.openedAt);
  const pinAsB = () => timeline.pinAt("B", incident.openedAt);

  const openRelated = (id: string) => {
    const target = db.incidents.find((i) => i.id === id);
    if (!target) return;
    timeline.setPlayhead(target.openedAt, { mode: "scrubbing" });
    setFocusedMoment(id);
  };

  return (
    <div className="h-full min-h-0 overflow-y-auto">
      <div className="mx-auto max-w-5xl space-y-6 px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-ink-3 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
            What happened · {timeLabel}
          </p>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={pinAsA}>
              pin as A
            </Button>
            <Button size="sm" onClick={pinAsB}>
              pin as B → compare
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex h-3 w-3 flex-none rounded-full ${severityDotClass[incident.severity]}`}
          />
          <h1 className="text-ink text-2xl leading-tight font-semibold tracking-tight sm:text-[26px]">
            {incident.title}
          </h1>
          {cluster && cluster.incidentIds.length > 1 ? (
            <ClusterBadge cluster={cluster} size="md" />
          ) : null}
        </div>

        <p className="text-ink-2 max-w-3xl text-sm leading-relaxed">{incident.detail}</p>

        <CausalChain steps={incident.chain} />

        {cluster && cluster.incidentIds.length > 1 ? (
          <RelatedIncidents
            cluster={cluster}
            currentIncidentId={incident.id}
            onOpen={openRelated}
          />
        ) : null}

        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <div className="min-w-0 flex-1">
            <AffectedDevices
              deviceIds={incident.affectedDeviceIds}
              moreLabel={
                incident.affectedDeviceIds.length > 3
                  ? `+ ${incident.affectedDeviceIds.length - 3} not shown`
                  : undefined
              }
            />
          </div>
          {incident.recommendation ? (
            <RecommendationCard
              recommendation={incident.recommendation}
              incident={incident}
              onApprove={handleApprove}
              onSnooze={() =>
                toast("Snoozed for 30 minutes", { description: incident.title })
              }
            />
          ) : null}
        </div>

        <p className="text-ink-3 border-line-2 border-t pt-4 font-mono text-[10px] tracking-[0.14em] uppercase">
          {severityKicker[incident.severity]} · owned by{" "}
          {db.users.find((u) => u.id === incident.primaryOwnerUserId)?.name ??
            "unassigned"}{" "}
          · press esc or click another moment to dismiss
        </p>
      </div>
    </div>
  );
}
