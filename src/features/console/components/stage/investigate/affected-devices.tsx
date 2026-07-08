"use client";

import { Button } from "@/features/design-system";
import type { Device } from "@/features/fake-db";
import { useConsole } from "../../../console-provider";

const statusToneClass: Record<Device["status"], string> = {
  online: "bg-ok",
  degraded: "bg-warn",
  offline: "bg-crit",
  isolated: "bg-crit",
  "non-compliant": "bg-warn",
  maintenance: "bg-ink-3",
};

/**
 * Row of affected devices — click to zoom into that device's story.
 */
export function AffectedDevices({
  deviceIds,
  moreLabel,
}: {
  deviceIds: string[];
  moreLabel?: string;
}) {
  const { db, setFocusedDevice, setFocusedMoment } = useConsole();
  const devices = deviceIds
    .map((id) => db.devices.find((d) => d.id === id))
    .filter((d): d is Device => Boolean(d));

  const handleFocus = (deviceId: string) => {
    // Focus the device — dropping the moment focus routes the stage.
    setFocusedMoment(null);
    setFocusedDevice(deviceId);
  };

  return (
    <section className="space-y-3">
      <p className="text-ink-3 font-mono text-[10px] tracking-[0.14em] uppercase">
        Affected devices · {deviceIds.length}
      </p>
      <div className="flex flex-col gap-2">
        {devices.map((device) => {
          const owner = db.users.find((u) => u.id === device.ownerUserId);
          const office = db.offices.find((o) => o.id === device.officeId);
          return (
            <button
              key={device.id}
              type="button"
              onClick={() => handleFocus(device.id)}
              className="border-line bg-surface hover:border-line-strong hover:bg-elev group flex items-center gap-3 rounded-xl border p-3 text-left transition-colors"
            >
              <span
                className={`h-2 w-2 flex-none rounded-full ${statusToneClass[device.status]}`}
              />
              <span className="text-ink w-24 flex-none font-mono text-xs tracking-tight">
                {device.host}
              </span>
              <span className="text-ink-2 flex-1 text-xs">
                {owner?.name ?? "—"} · {office?.city ?? "—"}
              </span>
              <span className="text-ink-3 group-hover:text-ink flex-none font-mono text-[10px] tracking-[0.14em] uppercase">
                story →
              </span>
            </button>
          );
        })}
        {moreLabel ? <p className="text-ink-3 px-1 text-xs">{moreLabel}</p> : null}
      </div>
      {devices.length > 0 ? (
        <div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleFocus(devices[0].id)}
          >
            Open {devices[0].host} story
          </Button>
        </div>
      ) : null}
    </section>
  );
}
