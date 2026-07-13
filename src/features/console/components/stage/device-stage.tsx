"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useMemo } from "react";
import { Button, cn, toast } from "@/features/design-system";
import type { Device, TimelineEvent } from "@/features/fake-db";
import { useCommandLanguage } from "@/features/command-language";
import { useConsole } from "../../console-provider";
import { DeviceFacts } from "./device/device-facts";
import { DeviceHistory } from "./device/device-history";
import { DeviceMiniRibbon } from "./device/device-mini-ribbon";

const statusPillClass: Record<Device["status"], string> = {
  online: "text-ok border-ok/30 bg-ok/10",
  degraded: "text-warn border-warn/30 bg-warn/10",
  offline: "text-crit border-crit/30 bg-crit/10",
  isolated: "text-crit border-crit/30 bg-crit/10",
  "non-compliant": "text-warn border-warn/30 bg-warn/10",
  maintenance: "text-ink-3 border-line bg-surface-2",
};

const deviceBadge = (host: string): string => {
  const [prefix] = host.split("-");
  return prefix ? prefix.slice(0, 3).toUpperCase() : host.slice(0, 3).toUpperCase();
};

/**
 * Full device story — a top-left "zoom out to fleet" back button, hostname
 * with badge and live status pill, the "life on one line" mini-ribbon of
 * device-scoped events, then history + facts side-by-side with a hint that
 * the command bar is now scoped to just this device.
 */
export function DeviceStage() {
  const {
    db,
    engine,
    focusedDeviceId,
    focusedMomentId,
    timeline,
    setFocusedDevice,
    setFocusedMoment,
  } = useConsole();
  const { openExecute } = useCommandLanguage();

  const device = useMemo(
    () => db.devices.find((d) => d.id === focusedDeviceId) ?? null,
    [db, focusedDeviceId],
  );

  const zoomOut = useCallback(() => {
    // Mirror the wireframe: pop back to investigate if a moment is still
    // focused, otherwise back to the console pane.
    setFocusedDevice(null);
  }, [setFocusedDevice]);

  const handleRibbonMarker = useCallback(
    (event: TimelineEvent) => {
      timeline.setPlayhead(event.timestamp, { mode: "scrubbing" });
      if (event.incidentId) setFocusedMoment(event.incidentId);
    },
    [timeline, setFocusedMoment],
  );

  if (!device) return null;

  const owner = db.users.find((u) => u.id === device.ownerUserId) ?? null;
  const office = db.offices.find((o) => o.id === device.officeId) ?? null;

  return (
    <div className="h-full min-h-0 overflow-y-auto">
      <div className="mx-auto max-w-5xl space-y-5 px-5 py-6 sm:px-8 sm:py-8">
        <button
          type="button"
          onClick={zoomOut}
          className="text-ink-3 hover:text-ink font-mono text-[10px] tracking-[0.14em] uppercase transition-colors"
        >
          ← {focusedMomentId ? "back to moment" : "zoom out to fleet"}
        </button>

        <header className="flex flex-wrap items-center gap-4">
          <div className="border-line bg-surface-2 text-ink-2 flex h-11 w-11 flex-none items-center justify-center rounded-xl border font-mono text-[11px]">
            {deviceBadge(device.host)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-ink font-mono text-2xl leading-tight font-semibold tracking-tight">
              {device.host}
            </h1>
            <p className="text-ink-3 mt-1 text-xs">
              {owner?.name ?? "unassigned"} · {office?.name ?? "unknown office"} ·{" "}
              {device.model.name}
            </p>
          </div>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={device.status}
              initial={{ opacity: 0, y: -4, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 360, damping: 26 }}
              className={cn(
                "rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] uppercase",
                statusPillClass[device.status],
              )}
            >
              {device.status}
            </motion.span>
          </AnimatePresence>
        </header>

        <div className="space-y-2">
          <p className="text-ink-3 font-mono text-[10px] tracking-[0.14em] uppercase">
            This device&apos;s life on one line
          </p>
          <DeviceMiniRibbon
            engine={engine}
            nowIso={timeline.now}
            deviceId={device.id}
            onMarkerClick={handleRibbonMarker}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_300px]">
          <DeviceHistory deviceId={device.id} />
          <aside className="space-y-3">
            <DeviceFacts
              device={device}
              owner={owner}
              office={office}
              nowIso={timeline.now}
            />
            <p className="text-ink-3 text-[11px] leading-relaxed">
              Type a command to act on just this device — the bar is scoped to{" "}
              <span className="text-ink-2 font-mono">{device.host}</span>.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => toast(`Would collect diagnostics on ${device.host}`)}
              >
                Collect diagnostics
              </Button>
              <Button
                size="sm"
                variant={device.status === "isolated" ? "primary" : "danger"}
                onClick={() =>
                  openExecute(
                    device.status === "isolated"
                      ? `release ${device.host}`
                      : `isolate ${device.host}`,
                  )
                }
              >
                {device.status === "isolated" ? "Release" : "Isolate"}
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
