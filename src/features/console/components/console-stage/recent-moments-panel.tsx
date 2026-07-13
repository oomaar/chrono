"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback } from "react";
import type { TimelineEvent } from "@/features/fake-db";
import { useConsole } from "../../console-provider";
import { useRecentMoments } from "../../hooks/use-recent-moments";
import { RecentMomentItemRow } from "./recent-moment-item";

/**
 * Right sidebar list — recent timeline events near the playhead. Newly
 * arrived items slide in from the top with a brief brand-tinted "fresh"
 * halo courtesy of `AnimatePresence`, so activity feels alive.
 */
export function RecentMomentsPanel() {
  const items = useRecentMoments(12);
  const { timeline, setFocusedMoment } = useConsole();

  const handleClick = useCallback(
    (event: TimelineEvent) => {
      timeline.setPlayhead(event.timestamp, { mode: "scrubbing" });
      if (event.incidentId) setFocusedMoment(event.incidentId);
    },
    [timeline, setFocusedMoment],
  );

  return (
    <aside className="border-line bg-surface h-full w-full lg:w-72 lg:border-l">
      <div className="flex h-full flex-col overflow-hidden">
        <header className="border-line-2 flex-none border-b px-5 py-4">
          <p className="text-ink-3 font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
            Recent Moments
          </p>
        </header>
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <p className="text-ink-3 py-6 text-center text-xs">
              No events near the playhead.
            </p>
          ) : (
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.event.id}
                  layout
                  initial={{
                    opacity: 0,
                    y: -12,
                    backgroundColor: "rgba(198, 242, 78, 0.14)",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    backgroundColor: "rgba(198, 242, 78, 0)",
                  }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{
                    opacity: { duration: 0.24 },
                    y: { type: "spring", stiffness: 320, damping: 28 },
                    backgroundColor: { duration: 1.2, delay: 0.18 },
                  }}
                >
                  <RecentMomentItemRow item={item} onClick={handleClick} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </aside>
  );
}
