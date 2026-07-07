"use client";

import { motion } from "motion/react";
import { Badge, cn } from "@/features/design-system";
import type { NeedItem } from "../../types/console.types";

const severityLabel: Record<NeedItem["incident"]["severity"], string> = {
  crit: "critical",
  high: "high",
  medium: "medium",
  low: "low",
};

const severityTone: Record<
  NeedItem["incident"]["severity"],
  "crit" | "warn" | "brand" | "neutral"
> = {
  crit: "crit",
  high: "warn",
  medium: "brand",
  low: "neutral",
};

const dotToneClass: Record<"crit" | "warn" | "brand" | "neutral", string> = {
  crit: "bg-crit",
  warn: "bg-warn",
  brand: "bg-brand",
  neutral: "bg-ink-3",
};

const formatAge = (minutes: number): string => {
  if (minutes < 1) return "just now";
  if (minutes < 60) return `−${Math.round(minutes)}m`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return mins > 0 ? `−${hours}h${String(mins).padStart(2, "0")}` : `−${hours}h`;
};

type NeedCardProps = {
  need: NeedItem;
  onInvestigate: (id: string) => void;
};

export function NeedCard({ need, onInvestigate }: NeedCardProps) {
  const tone = severityTone[need.incident.severity];

  return (
    <motion.button
      type="button"
      onClick={() => onInvestigate(need.incident.id)}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: [0.2, 0.7, 0.3, 1] }}
      className={cn(
        "group border-line bg-surface flex items-start gap-4 rounded-xl border p-4 text-left transition-colors",
        "hover:border-line-strong hover:bg-elev",
      )}
    >
      <span className={cn("mt-1.5 h-2 w-2 flex-none rounded-full", dotToneClass[tone])} />
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <Badge tone={tone === "brand" ? "warn" : tone === "neutral" ? "outline" : tone}>
            {severityLabel[need.incident.severity]}
          </Badge>
          <span className="text-ink-3 font-mono tracking-[0.14em]">
            {formatAge(need.ageMinutes)}
          </span>
          <span className="text-ink-3 font-mono tracking-[0.14em]">
            · {need.incident.affectedDeviceIds.length} device
            {need.incident.affectedDeviceIds.length === 1 ? "" : "s"}
          </span>
        </div>
        <p className="text-ink text-sm font-medium">{need.incident.title}</p>
        {need.hasRecommendation && need.incident.recommendation ? (
          <p className="text-ink-3 text-xs">
            Recommended: {need.incident.recommendation.title} ·{" "}
            <span className="text-brand">
              {need.incident.recommendation.confidence}% confidence
            </span>
          </p>
        ) : null}
      </div>
      <span className="text-ink-3 group-hover:text-ink mt-1 hidden shrink-0 self-center font-mono text-[10px] tracking-[0.14em] sm:block">
        investigate →
      </span>
    </motion.button>
  );
}
