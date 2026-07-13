"use client";

import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/features/design-system";
import type { EventCluster } from "../../types/timeline.types";

type RibbonMarkersProps = {
  clusters: EventCluster[];
  onMarkerClick: (cluster: EventCluster) => void;
};

const toneClass = (cluster: EventCluster): string => {
  if (cluster.criticalCount > 0) return "text-crit";
  if (cluster.warnCount > 0) return "text-warn";
  if (cluster.brandCount > 0) return "text-brand";
  if (cluster.okCount > 0) return "text-ok";
  return "text-ink-3";
};

/**
 * Renders event markers as an SVG overlay. Clustered markers show a small
 * badge with the group size and pulse when they contain critical events.
 */
export function RibbonMarkers({ clusters, onMarkerClick }: RibbonMarkersProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full"
    >
      <AnimatePresence initial={false}>
        {clusters.map((cluster) => {
          const x = Math.max(0, Math.min(1, cluster.ratio)) * 100;
          const y = 50;
          const isCluster = cluster.events.length > 1;
          const hasCritical = cluster.criticalCount > 0;

          return (
            <motion.g
              key={cluster.id}
              className={cn(toneClass(cluster), "cursor-pointer")}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              whileHover={{ scale: 1.35 }}
              whileTap={{ scale: 0.85 }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 24,
              }}
              onClick={() => onMarkerClick(cluster)}
            >
              {hasCritical ? (
                <circle cx={x} cy={y} r={2.6} fill="currentColor" opacity={0.5}>
                  <animate
                    attributeName="r"
                    values="2.6;5.4;2.6"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.5;0;0.5"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              ) : null}
              <circle
                cx={x}
                cy={y}
                r={isCluster ? 2 : 1.6}
                fill="currentColor"
                stroke="currentColor"
                strokeWidth={0.6}
                className="drop-shadow-[0_0_4px_currentColor]"
              />
              {isCluster ? (
                <text
                  x={x}
                  y={y - 4}
                  textAnchor="middle"
                  className="fill-ink font-mono text-[3px] font-semibold"
                >
                  {cluster.events.length}
                </text>
              ) : null}
            </motion.g>
          );
        })}
      </AnimatePresence>
    </svg>
  );
}
