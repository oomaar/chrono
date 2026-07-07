type RibbonHoverGhostProps = {
  ratio: number | null;
};

export function RibbonHoverGhost({ ratio }: RibbonHoverGhostProps) {
  if (ratio === null) return null;
  const x = Math.max(0, Math.min(1, ratio)) * 100;

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <line
        x1={x}
        y1={0}
        x2={x}
        y2={100}
        className="text-ink-2"
        stroke="currentColor"
        strokeWidth={0.4}
        strokeDasharray="1.5 2"
        opacity={0.5}
      />
    </svg>
  );
}
