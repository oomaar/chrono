"use client";

import { Activity, Search } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardKicker,
  CardTitle,
  Input,
  Kbd,
  Skeleton,
  SkeletonLines,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "../";
import { ShowcaseRow, ShowcaseSection } from "./showcase-section";

export function PrimitivesShowcase() {
  return (
    <ShowcaseSection
      kicker="Primitives"
      title="Buttons, inputs, cards, badges, kbd, skeletons"
      description="The base surface on which every timeline moment is rendered."
    >
      <ShowcaseRow label="Button · variant">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Isolate device</Button>
        <Button disabled>Disabled</Button>
      </ShowcaseRow>

      <ShowcaseRow label="Button · size">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" aria-label="Activity">
          <Activity size={14} />
        </Button>
      </ShowcaseRow>

      <ShowcaseRow label="Badge">
        <Badge tone="neutral" dot>
          neutral
        </Badge>
        <Badge tone="brand" dot>
          brand
        </Badge>
        <Badge tone="ok" dot>
          healthy
        </Badge>
        <Badge tone="warn" dot>
          degraded
        </Badge>
        <Badge tone="crit" dot>
          critical
        </Badge>
        <Badge tone="outline">outline</Badge>
      </ShowcaseRow>

      <ShowcaseRow label="Kbd">
        <Kbd keys={["⌘", "K"]} />
        <Kbd keys={["Shift", "?"]} />
        <Kbd keys={["Esc"]} />
      </ShowcaseRow>

      <ShowcaseRow label="Input">
        <div className="grid w-full gap-4 md:grid-cols-2">
          <Input
            label="Device host"
            placeholder="atlas-401"
            leadingIcon={<Search size={14} />}
            helperText="Search by hostname or serial."
          />
          <Input
            label="Notification email"
            type="email"
            required
            defaultValue="ops@chrono.local"
          />
          <Input
            label="Ticket id"
            defaultValue="INC-9021"
            error="Ticket has already been resolved."
          />
          <Input label="Disabled" defaultValue="—" disabled />
        </div>
      </ShowcaseRow>

      <ShowcaseRow label="Textarea">
        <div className="grid w-full gap-4 md:grid-cols-2">
          <Textarea
            label="Incident notes"
            placeholder="What did you observe? What did you do?"
            helperText="Attached to the moment · visible to everyone with access."
          />
          <Textarea
            label="Post-mortem summary"
            defaultValue="Root cause: FileVault escrow silently reverted after 14.2. Fix: re-apply policy, monitor for 24h."
            rows={5}
          />
        </div>
      </ShowcaseRow>

      <ShowcaseRow label="Switch">
        <label className="text-ink-2 flex items-center gap-3 text-sm">
          <Switch defaultChecked />
          <span>Live mode</span>
        </label>
        <label className="text-ink-2 flex items-center gap-3 text-sm">
          <Switch />
          <span>Show regions</span>
        </label>
        <label className="text-ink-2 flex items-center gap-3 text-sm">
          <Switch disabled />
          <span>Auto-remediate</span>
        </label>
      </ShowcaseRow>

      <ShowcaseRow label="Card">
        <div className="grid w-full gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div>
                <CardKicker>Moment · -12m</CardKicker>
                <CardTitle>Wave 3 patch rollout completed</CardTitle>
              </div>
              <Badge tone="ok">success</Badge>
            </CardHeader>
            <CardBody>
              128 devices updated to 14.2 in 8m 42s. No regressions detected.
            </CardBody>
            <CardFooter>
              <span className="text-ink-3 font-mono text-[10px] tracking-[0.14em]">
                by A. Keller · Berlin
              </span>
              <Button size="sm" variant="ghost">
                Investigate →
              </Button>
            </CardFooter>
          </Card>
          <Card interactive>
            <CardKicker>Moment · pending</CardKicker>
            <CardTitle className="mt-2">
              12 Finance devices lost disk encryption
            </CardTitle>
            <CardBody>Recommended: re-apply FileVault policy · 96% confidence.</CardBody>
          </Card>
        </div>
      </ShowcaseRow>

      <ShowcaseRow label="Skeleton">
        <div className="grid w-full gap-4 md:grid-cols-2">
          <Card>
            <div className="flex items-center gap-3">
              <Skeleton variant="circle" />
              <div className="flex-1">
                <SkeletonLines count={2} />
              </div>
            </div>
          </Card>
          <Card>
            <SkeletonLines count={3} />
          </Card>
        </div>
      </ShowcaseRow>

      <ShowcaseRow label="Tabs · underline">
        <div className="w-full max-w-2xl">
          <Tabs defaultValue="past">
            <TabsList>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="present">Present</TabsTrigger>
              <TabsTrigger value="future">Future</TabsTrigger>
              <TabsTrigger value="scheduled" disabled>
                Scheduled
              </TabsTrigger>
            </TabsList>
            <TabsContent value="past">
              <Card>
                <CardKicker>Reconstructed · -24h → now</CardKicker>
                <CardTitle className="mt-2">328 moments in the last day</CardTitle>
                <CardBody>
                  6 incidents · 4 deployments · 18 commands · 300 background events.
                </CardBody>
              </Card>
            </TabsContent>
            <TabsContent value="present">
              <Card>
                <CardKicker>Live · reconstructed at the playhead</CardKicker>
                <CardTitle className="mt-2">2,884 devices online · 12 offline</CardTitle>
                <CardBody>
                  All Berlin devices back online · Wave 5 rollout in progress.
                </CardBody>
              </Card>
            </TabsContent>
            <TabsContent value="future">
              <Card>
                <CardKicker>Scheduled · next 12h</CardKicker>
                <CardTitle className="mt-2">2 automations pending</CardTitle>
                <CardBody>
                  Deploy 14.3 to Finance at 02:00 UTC · Rotate compliance report at 06:00
                  UTC.
                </CardBody>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ShowcaseRow>

      <ShowcaseRow label="Tabs · pill">
        <div className="w-full max-w-2xl">
          <Tabs defaultValue="timeline">
            <TabsList variant="pill">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
              <TabsTrigger value="rules">Automation</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline">
              <p className="text-ink-2 text-sm">
                Scrub the ribbon, click a marker, replay a moment.
              </p>
            </TabsContent>
            <TabsContent value="devices">
              <p className="text-ink-2 text-sm">
                Every device is a lane on the timeline.
              </p>
            </TabsContent>
            <TabsContent value="policies">
              <p className="text-ink-2 text-sm">
                Policies apply as moments — reversible from the timeline.
              </p>
            </TabsContent>
            <TabsContent value="rules">
              <p className="text-ink-2 text-sm">Rules add moments to the future lane.</p>
            </TabsContent>
          </Tabs>
        </div>
      </ShowcaseRow>
    </ShowcaseSection>
  );
}
