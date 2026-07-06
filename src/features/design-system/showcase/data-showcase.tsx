"use client";

import { Activity } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Progress,
  ScrollArea,
  Separator,
  Stat,
} from "../";
import { ShowcaseRow, ShowcaseSection } from "./showcase-section";

const owners = [
  { initials: "AK", name: "A. Keller" },
  { initials: "MO", name: "M. Osei" },
  { initials: "RA", name: "R. Alvarez" },
  { initials: "PS", name: "P. Shah" },
  { initials: "TB", name: "T. Braun" },
] as const;

export function DataShowcase() {
  return (
    <ShowcaseSection
      kicker="Data & metrics"
      title="Avatar, Stat, Progress, Separator, ScrollArea"
      description="Building blocks used to reconstruct the operational state at the playhead."
    >
      <ShowcaseRow label="Avatar">
        <Avatar size="xs">
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
        <Avatar size="sm">
          <AvatarFallback>MO</AvatarFallback>
        </Avatar>
        <Avatar size="md">
          <AvatarFallback>RA</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage src="/broken.png" alt="P. Shah" />
          <AvatarFallback>PS</AvatarFallback>
        </Avatar>
        <div className="flex items-center -space-x-2">
          {owners.map((owner) => (
            <Avatar key={owner.initials} size="sm" className="border-surface border-2">
              <AvatarFallback>{owner.initials}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </ShowcaseRow>

      <ShowcaseRow label="Stat · fleet">
        <div className="grid w-full gap-3 md:grid-cols-4">
          <Stat
            label="online"
            value="2,884"
            emphasis
            trailing={<Badge tone="ok">live</Badge>}
          />
          <Stat label="degraded" value="61" tone="warn" />
          <Stat label="offline" value="12" tone="crit" hint="+6 in last hour" />
          <Stat label="enrolled" value="2,957" tone="neutral" />
        </div>
      </ShowcaseRow>

      <ShowcaseRow label="Progress · tones">
        <div className="w-full max-w-md space-y-3">
          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-ink-2">Wave 4 rollout</span>
              <span className="text-ink-3 font-mono">72%</span>
            </div>
            <Progress value={72} tone="brand" />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-ink-2">Compliance sync</span>
              <span className="text-ink-3 font-mono">100%</span>
            </div>
            <Progress value={100} tone="ok" />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-ink-2">Backup verification</span>
              <span className="text-ink-3 font-mono">45%</span>
            </div>
            <Progress value={45} tone="warn" size="xs" />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-ink-2">Isolation propagation</span>
              <span className="text-ink-3 font-mono">18%</span>
            </div>
            <Progress value={18} tone="crit" size="md" />
          </div>
        </div>
      </ShowcaseRow>

      <ShowcaseRow label="Separator">
        <div className="flex w-full max-w-md flex-col gap-3">
          <div className="text-ink-2 flex items-center gap-3 text-sm">
            <span>Timeline</span>
            <Separator orientation="vertical" className="h-4" />
            <span>Devices</span>
            <Separator orientation="vertical" className="h-4" strong />
            <span>Policies</span>
          </div>
          <Separator />
          <span className="text-ink-3 text-xs">horizontal · default</span>
          <Separator strong />
          <span className="text-ink-3 text-xs">horizontal · strong</span>
        </div>
      </ShowcaseRow>

      <ShowcaseRow label="ScrollArea">
        <div className="border-line bg-surface w-full max-w-md rounded-xl border">
          <div className="border-line-2 border-b p-3">
            <p className="text-ink-3 font-mono text-[10px] tracking-[0.14em] uppercase">
              Recent moments · scrollable
            </p>
          </div>
          <ScrollArea className="h-48">
            <ul className="divide-line-2 divide-y">
              {Array.from({ length: 14 }).map((_, index) => (
                <li key={index} className="flex items-center gap-3 px-3 py-2 text-sm">
                  <Activity size={12} className="text-ink-3" />
                  <span className="text-ink-3 font-mono text-[10px] tracking-[0.14em]">
                    -{(index + 1) * 4}m
                  </span>
                  <span className="text-ink-2">
                    {index % 3 === 0
                      ? "Wave 4 patch progressing"
                      : index % 3 === 1
                        ? "Berlin heartbeat restored"
                        : "Compliance sync complete"}
                  </span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </ShowcaseRow>
    </ShowcaseSection>
  );
}
