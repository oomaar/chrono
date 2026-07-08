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
  duration: 0.24,
  ease: [0.2, 0.7, 0.3, 1] as const,
};

/**
 * Animated switcher between the four stage panes. The current pane is derived
 * from ConsoleProvider (pins + focus state), so any interaction — clicking a
 * need card, setting two pins, running a past-verb command — routes the stage
 * automatically.
 */
export function StageSwitcher() {
  const { currentStage } = useConsole();
  const Pane = paneMap[currentStage];

  return (
    <div className="relative h-full min-h-0">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentStage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={transition}
          className="absolute inset-0"
        >
          <Pane />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
