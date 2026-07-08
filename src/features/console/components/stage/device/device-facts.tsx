import type { Device, Office, User } from "@/features/fake-db";

type DeviceFactsProps = {
  device: Device;
  owner: User | null;
  office: Office | null;
  nowIso: string;
};

const encryptionLabel: Record<Device["encryption"], string> = {
  on: "On",
  off: "Off",
  reverted: "Reverted",
  unknown: "Unknown",
};

const encryptionToneClass: Record<Device["encryption"], string> = {
  on: "text-ok",
  off: "text-crit",
  reverted: "text-crit",
  unknown: "text-ink-3",
};

const formatCheckIn = (iso: string, nowIso: string): string => {
  const minutes = (new Date(nowIso).getTime() - new Date(iso).getTime()) / 60000;
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${Math.round(minutes)}m ago`;
  const hours = minutes / 60;
  if (hours < 24) return `${hours.toFixed(1)}h ago`;
  return `${Math.round(hours / 24)}d ago`;
};

/**
 * Two-column fact table for the device pane — os, encryption, cpu/memory/
 * disk, battery, last check-in, and metadata.
 */
export function DeviceFacts({ device, owner, office, nowIso }: DeviceFactsProps) {
  const rows: Array<[string, React.ReactNode]> = [
    ["Status", device.status],
    ["OS", `${device.os} · ${device.osChannel}`],
    [
      "Encryption",
      <span
        key="encryption"
        className={`font-mono text-xs font-semibold ${encryptionToneClass[device.encryption]}`}
      >
        {encryptionLabel[device.encryption]}
      </span>,
    ],
    ["Model", `${device.model.name} · ${device.model.category}`],
    ["Serial", device.serial],
    ["Owner", owner?.name ?? "—"],
    ["Office", office?.name ?? "—"],
    ["CPU load", `${device.cpuLoad}%`],
    ["Memory", `${device.memoryUsage}%`],
    ["Disk", `${device.diskUsage}%`],
    ["Battery", `${device.batteryLevel}%`],
    ["Last check-in", formatCheckIn(device.lastCheckInAt, nowIso)],
    ["Tags", device.tags.length > 0 ? device.tags.join(", ") : "—"],
  ];

  return (
    <section>
      <p className="text-ink-3 mb-3 font-mono text-[10px] tracking-[0.14em] uppercase">
        Facts
      </p>
      <dl className="border-line-2 divide-y">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-4 py-2">
            <dt className="text-ink-3 text-xs">{label}</dt>
            <dd className="text-ink text-xs">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
