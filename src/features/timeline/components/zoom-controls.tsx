"use client";

import { cn } from "@/features/design-system";
import type { ZoomLevel } from "../types/timeline.types";
import { ZOOM_LABELS, ZOOM_LEVELS } from "../utils/zoom-presets";

type ZoomControlsProps = {
  zoom: ZoomLevel;
  onChange: (zoom: ZoomLevel) => void;
};

export function ZoomControls({ zoom, onChange }: ZoomControlsProps) {
  return (
    <div className="border-line bg-surface inline-flex items-center gap-0.5 rounded-md border p-0.5">
      {ZOOM_LEVELS.map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => onChange(level)}
          className={cn(
            "rounded px-2 py-0.5 font-mono text-[10px] font-semibold tracking-[0.12em] uppercase transition-colors",
            zoom === level ? "bg-brand text-bg" : "text-ink-3 hover:text-ink",
          )}
        >
          {ZOOM_LABELS[level]}
        </button>
      ))}
    </div>
  );
}
