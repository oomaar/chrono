type IllustrationProps = {
  className?: string;
};

export function LockedMoment({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-hidden className={className} fill="none">
      <g className="text-ink-3">
        <line
          x1="20"
          x2="300"
          y1="112"
          y2="112"
          stroke="currentColor"
          strokeWidth="1.25"
          opacity="0.5"
        />
        <circle cx="55" cy="112" r="3" fill="currentColor" opacity="0.5" />
        <circle cx="100" cy="112" r="3" fill="currentColor" opacity="0.6" />
        <circle cx="220" cy="112" r="3" fill="currentColor" opacity="0.6" />
        <circle cx="265" cy="112" r="3" fill="currentColor" opacity="0.5" />
      </g>

      <g className="text-current">
        <circle
          cx="160"
          cy="112"
          r="24"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.14"
        />
        <circle
          cx="160"
          cy="112"
          r="14"
          stroke="currentColor"
          strokeWidth="1.25"
          opacity="0.35"
        />
      </g>

      <g className="text-current">
        <rect
          x="146"
          y="62"
          width="28"
          height="24"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.75"
          fill="var(--theme-surface)"
        />
        <path
          d="M152 62 V54 a8 8 0 0 1 16 0 V62"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="160" cy="74" r="2" fill="currentColor" />
        <line
          x1="160"
          y1="76"
          x2="160"
          y2="80"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
