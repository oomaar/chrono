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

/**
 * 40-column device dot grid — one square per affected device, coloured by its
 * current status. Matches the wireframe's "BLAST RADIUS" ceremony: at a
 * glance the operator can see how many devices they're about to touch and
 * roughly what state those devices are already in.
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

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-40 gap-0.75">
        {shown.map((device) => (
          <span
            key={device.id}
            title={`${device.host} · ${device.status}`}
            className={cn(
              "aspect-square rounded-[2px] opacity-90",
              deviceStatusToneClass[device.status],
            )}
          />
        ))}
        {Array.from({ length: overflow }).map((_, i) => (
          <span
            key={`overflow_${i}`}
            className="bg-ink-3/40 aspect-square rounded-[2px]"
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
