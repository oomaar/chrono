"use client";

import { motion } from "motion/react";
import { cn } from "@/features/design-system";
import type { Device } from "@/features/fake-db";

const deviceStatusToneClass: Record<Device["status"], string> = {
  online: "bg-ok",
  degraded: "bg-warn",
  offline: "bg-crit",
  isolated: "bg-crit",
  "non-compliant": "bg-warn",
  maintenance: "bg-ink-3",
};

// A short cap keeps the total animation cost bounded even for large fleets —
// the ceiling matches roughly two full rows past which the eye can't track
// individual dots landing anyway.
const MAX_STAGGER_DELAY_S = 0.8;

const staggerDelay = (index: number, total: number): number => {
  if (total <= 1) return 0;
  return Math.min(MAX_STAGGER_DELAY_S, index * (MAX_STAGGER_DELAY_S / total));
};

/**
 * 40-column device dot grid — one square per affected device, coloured by its
 * current status. Dots fill in with a staggered sweep on mount so the "blast
 * radius" ceremony feels like the system is scanning the fleet, matching the
 * wireframe's implied choreography.
 */
export function BlastRadiusDotGrid({
  devices,
  maxDots = 240,
}: {
  devices: Device[];
  maxDots?: number;
}) {
  const shown = devices.slice(0, maxDots);
  const overflow = Math.max(0, devices.length - shown.length);
  const totalDots = shown.length + overflow;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-40 gap-0.75">
        {shown.map((device, index) => (
          <motion.span
            key={device.id}
            title={`${device.host} · ${device.status}`}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 0.9, scale: 1 }}
            transition={{
              duration: 0.22,
              ease: [0.2, 0.7, 0.3, 1],
              delay: staggerDelay(index, totalDots),
            }}
            className={cn(
              "aspect-square rounded-[2px]",
              deviceStatusToneClass[device.status],
            )}
          />
        ))}
        {Array.from({ length: overflow }).map((_, i) => (
          <motion.span
            key={`overflow_${i}`}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{
              duration: 0.22,
              ease: [0.2, 0.7, 0.3, 1],
              delay: staggerDelay(shown.length + i, totalDots),
            }}
            className="bg-ink-3 aspect-square rounded-[2px]"
          />
        ))}
      </div>
      {overflow > 0 ? (
        <p className="text-ink-3 font-mono text-[10px] tracking-[0.14em]">
          + {overflow} more not shown
        </p>
      ) : null}
    </div>
  );
}
