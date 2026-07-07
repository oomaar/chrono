"use client";

import type { TimelineEvent, TimeWindow } from "@/features/fake-db";
import { TIMELINE_LANES } from "@/features/fake-db";
import { TimelineLaneRow } from "./timeline-lane";

type TimelineLanesProps = {
  events: TimelineEvent[];
  window: TimeWindow;
};

export function TimelineLanes({ events, window }: TimelineLanesProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {TIMELINE_LANES.map((lane) => (
        <TimelineLaneRow key={lane} lane={lane} events={events} window={window} />
      ))}
    </div>
  );
}
