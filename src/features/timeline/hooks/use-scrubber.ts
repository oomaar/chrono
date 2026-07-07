"use client";

import { useCallback, useRef, useState, type PointerEvent, type RefObject } from "react";
import type { TimeWindow } from "@/features/fake-db";
import { pointerRatio, ratioToTimestamp } from "../utils/time-scale";

type UseScrubberOptions = {
  window: TimeWindow;
  onScrub: (timestamp: string) => void;
  onScrubStart?: () => void;
  onScrubEnd?: () => void;
};

export type ScrubberHandlers = {
  ref: RefObject<HTMLDivElement | null>;
  hoverRatio: number | null;
  hoverTimestamp: string | null;
  isDragging: boolean;
  onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: PointerEvent<HTMLDivElement>) => void;
  onPointerLeave: (event: PointerEvent<HTMLDivElement>) => void;
};

/**
 * Attaches pointer handlers to a container ref. Emits a timestamp derived
 * from the pointer's horizontal position within the container, mapped through
 * the current window.
 */
export const useScrubber = ({
  window,
  onScrub,
  onScrubStart,
  onScrubEnd,
}: UseScrubberOptions): ScrubberHandlers => {
  const ref = useRef<HTMLDivElement>(null);
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);
  const [hoverTimestamp, setHoverTimestamp] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const compute = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const node = ref.current;
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      const ratio = pointerRatio(event.clientX, rect);
      return { ratio, timestamp: ratioToTimestamp(ratio, window) };
    },
    [window],
  );

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const computed = compute(event);
      if (!computed) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      setIsDragging(true);
      onScrubStart?.();
      onScrub(computed.timestamp);
      setHoverRatio(computed.ratio);
      setHoverTimestamp(computed.timestamp);
    },
    [compute, onScrub, onScrubStart],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const computed = compute(event);
      if (!computed) return;
      setHoverRatio(computed.ratio);
      setHoverTimestamp(computed.timestamp);
      if (isDragging) {
        onScrub(computed.timestamp);
      }
    },
    [compute, isDragging, onScrub],
  );

  const onPointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      setIsDragging(false);
      onScrubEnd?.();
    },
    [onScrubEnd],
  );

  const onPointerLeave = useCallback(() => {
    if (!isDragging) {
      setHoverRatio(null);
      setHoverTimestamp(null);
    }
  }, [isDragging]);

  return {
    ref,
    hoverRatio,
    hoverTimestamp,
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerLeave,
  };
};
