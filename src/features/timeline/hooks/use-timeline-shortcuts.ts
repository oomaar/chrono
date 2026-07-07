"use client";

import { useEffect } from "react";
import type { TimelineEngineApi } from "./use-timeline-engine";

const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
};

type ShortcutOptions = {
  /** Disable the entire binding (e.g. when a modal is open). */
  disabled?: boolean;
  /** Minutes per basic step. Defaults to 5. */
  stepMinutes?: number;
  /** Minutes per shift-step (big jump). Defaults to 60. */
  bigStepMinutes?: number;
};

/**
 * Binds keyboard shortcuts to the timeline engine.
 *
 *  Space          play / pause
 *  ← / →          step ±stepMinutes
 *  Shift ← / →    step ±bigStepMinutes
 *  Home / End     jump to visible window start / end
 *  Esc            return to now (live)
 *  A / B          pin the playhead as A / B
 *  C              clear both pins
 *  1 · 2 · Shift-1 · Shift-2   jump to pin A / B
 *
 * Keys are ignored when focus is inside an input, textarea, select, or
 * contenteditable element — so the command bar keeps working normally.
 */
export const useTimelineShortcuts = (
  timeline: TimelineEngineApi,
  options: ShortcutOptions = {},
): void => {
  const { disabled = false, stepMinutes = 5, bigStepMinutes = 60 } = options;

  useEffect(() => {
    if (disabled) return;

    const handler = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return;

      switch (event.key) {
        case " ": {
          event.preventDefault();
          if (timeline.mode === "playback" || timeline.mode === "live") {
            timeline.pause();
          } else {
            timeline.play();
          }
          break;
        }
        case "ArrowLeft": {
          event.preventDefault();
          timeline.stepBy(event.shiftKey ? -bigStepMinutes : -stepMinutes);
          break;
        }
        case "ArrowRight": {
          event.preventDefault();
          timeline.stepBy(event.shiftKey ? bigStepMinutes : stepMinutes);
          break;
        }
        case "Home": {
          event.preventDefault();
          timeline.setPlayhead(timeline.window.start, { mode: "scrubbing" });
          break;
        }
        case "End": {
          event.preventDefault();
          timeline.setPlayhead(timeline.window.end, { mode: "scrubbing" });
          break;
        }
        case "Escape": {
          event.preventDefault();
          timeline.returnToNow();
          break;
        }
        case "a":
        case "A": {
          if (event.metaKey || event.ctrlKey || event.altKey) return;
          event.preventDefault();
          timeline.pinAt("A", timeline.playhead);
          break;
        }
        case "b":
        case "B": {
          if (event.metaKey || event.ctrlKey || event.altKey) return;
          event.preventDefault();
          timeline.pinAt("B", timeline.playhead);
          break;
        }
        case "c":
        case "C": {
          if (event.metaKey || event.ctrlKey || event.altKey) return;
          event.preventDefault();
          timeline.clearPins();
          break;
        }
        case "1": {
          if (event.metaKey || event.ctrlKey || event.altKey) return;
          event.preventDefault();
          timeline.jumpToPin("A");
          break;
        }
        case "2": {
          if (event.metaKey || event.ctrlKey || event.altKey) return;
          event.preventDefault();
          timeline.jumpToPin("B");
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [timeline, disabled, stepMinutes, bigStepMinutes]);
};
