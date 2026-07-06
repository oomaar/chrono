type IllustrationProps = {
  className?: string;
};

export function EmptyTimeline({ className }: IllustrationProps) {
  return (
    <svg viewBox="0 0 320 180" role="img" aria-hidden className={className} fill="none">
      <g className="text-ink-3" opacity="0.3">
        {Array.from({ length: 9 }).map((_, column) =>
          Array.from({ length: 3 }).map((__, row) => (
            <circle
              key={`${column}-${row}`}
              cx={20 + column * 35}
              cy={40 + row * 40}
              r="1"
              fill="currentColor"
            />
          )),
        )}
      </g>

      <g className="text-ink-3">
        <line
          x1="30"
          x2="290"
          y1="96"
          y2="96"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeDasharray="4 6"
          opacity="0.6"
        />
        <circle
          cx="60"
          cy="96"
          r="3.5"
          stroke="currentColor"
          strokeWidth="1.25"
          fill="none"
          opacity="0.4"
        />
        <circle
          cx="160"
          cy="96"
          r="3.5"
          stroke="currentColor"
          strokeWidth="1.25"
          fill="none"
          opacity="0.4"
        />
        <circle
          cx="260"
          cy="96"
          r="3.5"
          stroke="currentColor"
          strokeWidth="1.25"
          fill="none"
          opacity="0.4"
        />
      </g>

      <g className="text-brand">
        <line
          x1="160"
          y1="60"
          x2="160"
          y2="76"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path d="M154 60 L166 60 L160 54 Z" fill="currentColor" />
      </g>
    </svg>
  );
}
