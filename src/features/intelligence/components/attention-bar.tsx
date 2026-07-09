import { cn } from "@/features/design-system";

const widthClass = (score: number): string => {
  const bucket = Math.max(0, Math.min(10, Math.round(score / 10)));
  const table: Record<number, string> = {
    0: "w-0",
    1: "w-[10%]",
    2: "w-[20%]",
    3: "w-[30%]",
    4: "w-[40%]",
    5: "w-[50%]",
    6: "w-[60%]",
    7: "w-[70%]",
    8: "w-[80%]",
    9: "w-[90%]",
    10: "w-full",
  };
  return table[bucket];
};

const toneClass = (score: number): string => {
  if (score >= 80) return "bg-crit";
  if (score >= 55) return "bg-warn";
  if (score >= 30) return "bg-brand";
  return "bg-ink-3";
};

/**
 * A minimalist "attention" bar — one continuous track that shows how strongly
 * an incident is calling for attention right now. Color darkens as urgency
 * climbs, so a glance is enough to prioritize.
 */
type AttentionBarProps = {
  score: number;
  className?: string;
};

export function AttentionBar({ score, className }: AttentionBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  return (
    <div
      className={cn(
        "bg-ink-3/10 relative h-1 w-full overflow-hidden rounded-full",
        className,
      )}
      aria-label={`Attention score ${clamped}`}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width]",
          toneClass(clamped),
          widthClass(clamped),
        )}
      />
    </div>
  );
}
