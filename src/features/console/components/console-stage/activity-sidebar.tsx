"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { cn, EmptyState } from "@/features/design-system";
import type { TimelineEvent } from "@/features/fake-db";
import { EmptyTimeline } from "@/features/illustrations";
import {
  CommandHistoryPanel,
  ScheduledCommandsPanel,
  useCommandLanguage,
} from "@/features/command-language";
import { useConsole } from "../../console-provider";
import { useRecentMoments } from "../../hooks/use-recent-moments";
import { RecentMomentItemRow } from "./recent-moment-item";

type TabKey = "recent" | "history" | "scheduled";

const TAB_LABEL: Record<TabKey, string> = {
  recent: "Recent",
  history: "History",
  scheduled: "Scheduled",
};

/**
 * The right-column activity sidebar. Consolidates the three time-anchored
 * streams operators actually reach for — recent timeline events, the command
 * history, and scheduled commands — into one tabbed surface so the
 * "commit → see it land" feedback loop stays visible without scrolling.
 *
 * Layout:
 *   - lg+ : fixed 288px right column, always visible with tabs at the top.
 *   - <lg : renders full-width at the bottom of the scrollable page (same as
 *           the previous single-purpose panel), so mobile users can still
 *           tap between streams without any new UI pattern.
 */
export function ActivitySidebar() {
  const [tab, setTab] = useState<TabKey>("recent");
  const items = useRecentMoments(12);
  const { timeline, setFocusedMoment } = useConsole();
  const { history, scheduled } = useCommandLanguage();

  const handleMomentClick = useCallback(
    (event: TimelineEvent) => {
      timeline.setPlayhead(event.timestamp, { mode: "scrubbing" });
      if (event.incidentId) setFocusedMoment(event.incidentId);
    },
    [timeline, setFocusedMoment],
  );

  const historyCount = history.filter((r) => r.status !== "scheduled").length;
  const scheduledCount = scheduled.length;

  const counts: Record<TabKey, number> = {
    recent: items.length,
    history: historyCount,
    scheduled: scheduledCount,
  };

  return (
    <aside
      aria-label="Activity streams"
      className="border-line bg-surface w-full lg:h-full lg:w-72 lg:border-l"
    >
      <div className="flex h-full flex-col overflow-hidden">
        <header
          className="border-line-2 flex-none border-b px-3 py-2"
          role="tablist"
          aria-label="Activity streams"
        >
          <div className="flex items-stretch gap-1">
            {(Object.keys(TAB_LABEL) as TabKey[]).map((key) => {
              const isActive = tab === key;

              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`activity-panel-${key}`}
                  onClick={() => setTab(key)}
                  className={cn(
                    "focus-visible:ring-brand/40 relative flex-1 rounded-md px-2 py-1.5 text-center font-mono text-[10px] font-semibold tracking-[0.14em] whitespace-nowrap uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none",
                    isActive
                      ? "text-ink bg-elev"
                      : "text-ink-3 hover:text-ink-2 hover:bg-elev/60",
                  )}
                >
                  <span>{TAB_LABEL[key]}</span>
                  {counts[key] > 0 ? (
                    <span
                      className={cn(
                        "ml-1 font-mono text-[9px] tabular-nums",
                        isActive ? "text-ink-3" : "text-ink-3/80",
                      )}
                    >
                      {counts[key]}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-3">
          {tab === "recent" ? (
            <div
              id="activity-panel-recent"
              role="tabpanel"
              aria-labelledby="activity-tab-recent"
            >
              {items.length === 0 ? (
                <EmptyState
                  className="border-none bg-transparent p-4"
                  illustration={<EmptyTimeline className="text-ink-3 h-16 w-auto" />}
                  title="Nothing near the playhead"
                  description="Scrub the timeline or return to now to see live activity."
                />
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.event.id}
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{
                        opacity: { duration: 0.24 },
                        y: { type: "spring", stiffness: 320, damping: 28 },
                      }}
                      className="relative"
                    >
                      <motion.span
                        aria-hidden
                        initial={{ opacity: 0.65 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 1.6, delay: 0.2 }}
                        className="bg-brand pointer-events-none absolute top-2 bottom-2 -left-2 w-0.5 rounded-full"
                      />
                      <RecentMomentItemRow item={item} onClick={handleMomentClick} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          ) : null}

          {tab === "history" ? (
            <div
              id="activity-panel-history"
              role="tabpanel"
              aria-labelledby="activity-tab-history"
            >
              <CommandHistoryPanel />
            </div>
          ) : null}

          {tab === "scheduled" ? (
            <div
              id="activity-panel-scheduled"
              role="tabpanel"
              aria-labelledby="activity-tab-scheduled"
            >
              <ScheduledCommandsPanel />
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
