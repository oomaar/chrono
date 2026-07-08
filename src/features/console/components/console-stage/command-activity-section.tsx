"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/features/design-system";
import {
  CommandHistoryPanel,
  ScheduledCommandsPanel,
  useCommandLanguage,
} from "@/features/command-language";

/**
 * Console footer strip that surfaces the command history and scheduled queue
 * inline with the stage. Sits below the needs list.
 */
export function CommandActivitySection() {
  const { history, scheduled } = useCommandLanguage();

  return (
    <section className="border-line bg-surface space-y-4 rounded-2xl border p-5">
      <header className="flex items-baseline gap-3">
        <h2 className="text-ink text-sm font-semibold tracking-tight">
          Command activity
        </h2>
        <span className="text-ink-3 text-xs">
          receipts + scheduled — everything you commit drops here
        </span>
      </header>

      <Tabs defaultValue="history">
        <TabsList>
          <TabsTrigger value="history">
            History
            {history.filter((r) => r.status !== "scheduled").length > 0 ? (
              <span className="text-ink-3 ml-2 font-mono text-[10px] tabular-nums">
                {history.filter((r) => r.status !== "scheduled").length}
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            Scheduled
            {scheduled.length > 0 ? (
              <span className="text-warn ml-2 font-mono text-[10px] tabular-nums">
                {scheduled.length}
              </span>
            ) : null}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <CommandHistoryPanel />
        </TabsContent>
        <TabsContent value="scheduled">
          <ScheduledCommandsPanel />
        </TabsContent>
      </Tabs>
    </section>
  );
}
