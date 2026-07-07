"use client";

import { useConsole } from "../../console-provider";
import { FleetStatTile } from "./fleet-stat-tile";

/**
 * The four hero tiles — fleet state reconstructed at the current playhead.
 * Emphasizes "online" as the anchor of operator attention.
 */
export function FleetStats() {
  const { timeline } = useConsole();
  const { fleet } = timeline.state;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <FleetStatTile value={fleet.online} label="online" tone="brand" emphasis />
      <FleetStatTile value={fleet.degraded} label="degraded" tone="warn" />
      <FleetStatTile value={fleet.offline} label="offline" tone="crit" />
      <FleetStatTile value={fleet.total} label="enrolled" tone="neutral" />
    </div>
  );
}
