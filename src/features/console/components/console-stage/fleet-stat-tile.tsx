import { AnimatedCounter, cn } from "@/features/design-system";

type FleetStatTileProps = {
  value: number;
  label: string;
  tone?: "brand" | "ok" | "warn" | "crit" | "neutral";
  emphasis?: boolean;
};

const toneClass: Record<NonNullable<FleetStatTileProps["tone"]>, string> = {
  brand: "text-brand",
  ok: "text-ok",
  warn: "text-warn",
  crit: "text-crit",
  neutral: "text-ink",
};

export function FleetStatTile({
  value,
  label,
  tone = "neutral",
  emphasis = false,
}: FleetStatTileProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-end rounded-xl border p-4",
        emphasis ? "border-line-strong bg-elev" : "border-line bg-surface",
      )}
    >
      <AnimatedCounter
        value={value}
        className={cn(
          "font-mono text-3xl font-semibold tracking-tight tabular-nums sm:text-[34px]",
          toneClass[tone],
        )}
      />
      <p className="text-ink-3 mt-1 text-xs">{label}</p>
    </div>
  );
}
