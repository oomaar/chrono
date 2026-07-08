import type { BlastRadius } from "../../types/command-language.types";

type BlastRadiusPreviewProps = {
  blast: BlastRadius;
};

/** Small tile listing the affected devices, teams, offices, and policies. */
export function BlastRadiusPreview({ blast }: BlastRadiusPreviewProps) {
  if (blast.deviceCount === 0) return null;

  return (
    <div className="border-line bg-elev/60 space-y-2 rounded-xl border p-3">
      <div className="flex items-center justify-between">
        <span className="text-brand font-mono text-[10px] tracking-[0.14em] uppercase">
          Blast radius
        </span>
        <span className="text-ink font-mono text-lg font-semibold tabular-nums">
          {blast.deviceCount.toLocaleString()}
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {blast.sampleDevices.map((device) => (
          <span
            key={device.id}
            className="border-line-2 text-ink-2 rounded-md border px-1.5 py-0.5 font-mono text-[10px] tabular-nums"
          >
            {device.host}
          </span>
        ))}
        {blast.deviceCount > blast.sampleDevices.length ? (
          <span className="text-ink-3 rounded-md px-1.5 py-0.5 font-mono text-[10px]">
            +{blast.deviceCount - blast.sampleDevices.length} more
          </span>
        ) : null}
      </div>
      {blast.teams.length + blast.offices.length + blast.policiesTouched.length > 0 ? (
        <div className="text-ink-3 flex flex-wrap gap-x-4 gap-y-1 pt-1 text-[10px]">
          {blast.teams.length > 0 ? (
            <span>
              {blast.teams.length} team{blast.teams.length === 1 ? "" : "s"}
            </span>
          ) : null}
          {blast.offices.length > 0 ? (
            <span>
              {blast.offices.length} office{blast.offices.length === 1 ? "" : "s"}
            </span>
          ) : null}
          {blast.policiesTouched.length > 0 ? (
            <span>
              {blast.policiesTouched.length} polic
              {blast.policiesTouched.length === 1 ? "y" : "ies"}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
