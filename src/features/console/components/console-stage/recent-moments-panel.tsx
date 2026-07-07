"use client";

import { useCallback } from "react";
import type { TimelineEvent } from "@/features/fake-db";
import { useConsole } from "../../console-provider";
import { useRecentMoments } from "../../hooks/use-recent-moments";
import { RecentMomentItemRow } from "./recent-moment-item";

/**
 * Right sidebar list — recent timeline events near the current playhead.
 */
export function RecentMomentsPanel() {
  const items = useRecentMoments(12);
  const { timeline, setFocusedMoment } = useConsole();

  const handleClick = useCallback(
    (event: TimelineEvent) => {
      timeline.setPlayhead(event.timestamp, { mode: "scrubbing" });
      setFocusedMoment(event.id);
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
            items.map((item) => (
              <RecentMomentItemRow
                key={item.event.id}
                item={item}
                onClick={handleClick}
              />
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
