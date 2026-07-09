"use client";

import { AnimatePresence, motion } from "motion/react";
import { useConsole } from "../../console-provider";
import { ConsolePane } from "./console-pane";
import { CompareStage } from "./compare-stage";
import { DeviceStage } from "./device-stage";
import { InvestigateStage } from "./investigate-stage";

const paneMap = {
  console: ConsolePane,
  investigate: InvestigateStage,
  compare: CompareStage,
  device: DeviceStage,
} as const;

const transition = {
  duration: 0.28,
  ease: [0.2, 0.7, 0.3, 1] as const,
};

/**
 * Animated switcher between the four stage panes. Detail panes (investigate /
 * compare / device) enter from below with a subtle zoom-in — like descending
 * into a moment. Returning to the console pane enters from above with a
 * gentle zoom-out — like stepping back to the fleet view. Consistent metaphor
 * for Chrono's "time as interface" model without tracking previous state.
 */
export function StageSwitcher() {
  const { currentStage } = useConsole();
  const isDetail = currentStage !== "console";
  const Pane = paneMap[currentStage];

  return (
    <div className="relative h-full min-h-0">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentStage}
          initial={{
            opacity: 0,
            y: isDetail ? 12 : -8,
            scale: isDetail ? 0.985 : 1.015,
          }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{
            opacity: 0,
            y: isDetail ? -6 : 10,
            scale: isDetail ? 1.01 : 0.99,
          }}
          transition={transition}
          className="absolute inset-0"
        >
          <Pane />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
