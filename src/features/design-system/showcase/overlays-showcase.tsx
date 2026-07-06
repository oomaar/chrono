"use client";

import { AlertTriangle, Copy, Info, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownShortcut,
  DropdownTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Kbd,
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  TimelineMarker,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
} from "../";
import { ShowcaseRow, ShowcaseSection } from "./showcase-section";

export function OverlaysShowcase() {
  const [showRegions, setShowRegions] = useState(true);

  return (
    <ShowcaseSection
      kicker="Overlays"
      title="Tooltip, HoverCard, Popover, Dropdown, Context Menu, Modal, Drawer, Toast"
      description="Every overlay is keyboard-accessible via Radix, styled with tokens, and animated with data-state utilities."
    >
      <ShowcaseRow label="Tooltip">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="secondary" size="sm">
              Hover me
            </Button>
          </TooltipTrigger>
          <TooltipContent>Return to now — Cmd + .</TooltipContent>
        </Tooltip>
      </ShowcaseRow>

      <ShowcaseRow label="HoverCard">
        <HoverCard openDelay={120} closeDelay={80}>
          <HoverCardTrigger asChild>
            <button
              type="button"
              className="border-line bg-surface text-ink-2 hover:border-line-strong hover:text-ink flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition-colors"
            >
              <span className="text-ink-3 font-mono text-xs">device</span>
              atlas-441
            </button>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex items-start gap-3">
              <Avatar size="md">
                <AvatarFallback>AK</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-brand font-mono text-[10px] tracking-[0.14em] uppercase">
                  Device · online
                </p>
                <p className="text-ink text-sm font-semibold">atlas-441</p>
                <p className="text-ink-2 text-xs">A. Keller · Berlin</p>
              </div>
              <Badge tone="ok" dot>
                healthy
              </Badge>
            </div>
            <Separator className="my-3" />
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-ink font-mono text-sm font-semibold">14.2</p>
                <p className="text-ink-3 text-[10px]">os</p>
              </div>
              <div>
                <p className="text-ink font-mono text-sm font-semibold">92%</p>
                <p className="text-ink-3 text-[10px]">battery</p>
              </div>
              <div>
                <p className="text-ink font-mono text-sm font-semibold">18m</p>
                <p className="text-ink-3 text-[10px]">last check</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        <HoverCard openDelay={120} closeDelay={80}>
          <HoverCardTrigger asChild>
            <span className="inline-flex">
              <TimelineMarker tone="crit" pulse label="Critical moment" />
            </span>
          </HoverCardTrigger>
          <HoverCardContent>
            <p className="text-crit font-mono text-[10px] tracking-[0.14em] uppercase">
              Incident · -2h
            </p>
            <p className="text-ink mt-1 text-sm font-semibold">
              12 Finance devices lost disk encryption
            </p>
            <p className="text-ink-2 mt-2 text-xs">
              Recommended: re-apply FileVault policy · 96% confidence.
            </p>
          </HoverCardContent>
        </HoverCard>
      </ShowcaseRow>

      <ShowcaseRow label="Popover">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="sm">
              Pin as A
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <p className="text-brand mb-2 font-mono text-[10px] tracking-[0.14em] uppercase">
              Pin this moment
            </p>
            <p className="text-ink-2 text-sm">
              Compare against another moment by pinning it as B.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
              <Button size="sm">Pin</Button>
            </div>
          </PopoverContent>
        </Popover>
      </ShowcaseRow>

      <ShowcaseRow label="Dropdown">
        <Dropdown>
          <DropdownTrigger asChild>
            <Button variant="secondary" size="sm">
              Actions
            </Button>
          </DropdownTrigger>
          <DropdownContent>
            <DropdownLabel>Moment</DropdownLabel>
            <DropdownItem>
              <Copy size={12} />
              Copy link
              <DropdownShortcut>⌘ C</DropdownShortcut>
            </DropdownItem>
            <DropdownItem>
              <Info size={12} />
              Investigate
              <DropdownShortcut>I</DropdownShortcut>
            </DropdownItem>
            <DropdownSeparator />
            <DropdownItem destructive>
              <Trash2 size={12} />
              Discard
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </ShowcaseRow>

      <ShowcaseRow label="Context menu">
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div className="border-line-strong bg-surface-2 text-ink-2 flex h-24 w-64 items-center justify-center rounded-xl border border-dashed text-sm">
              Right-click me
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>Timeline</ContextMenuLabel>
            <ContextMenuItem>
              Pin as A<ContextMenuShortcut>A</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Pin as B<ContextMenuShortcut>B</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem
              checked={showRegions}
              onCheckedChange={(next) => setShowRegions(next === true)}
            >
              Show regions
            </ContextMenuCheckboxItem>
            <ContextMenuSeparator />
            <ContextMenuItem destructive>Clear pins</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </ShowcaseRow>

      <ShowcaseRow label="Modal">
        <Modal>
          <ModalTrigger asChild>
            <Button variant="danger" size="sm">
              <AlertTriangle size={12} />
              Isolate endpoint
            </Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Isolate atlas-441?</ModalTitle>
              <ModalDescription>
                This will quarantine the device from the network. Reversible from the
                timeline.
              </ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
              <Button variant="danger" size="sm">
                Isolate
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </ShowcaseRow>

      <ShowcaseRow label="Drawer">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="secondary" size="sm">
              Open device story
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>atlas-441</DrawerTitle>
              <DrawerDescription>
                Full history · 24h reconstructed from 328 events.
              </DrawerDescription>
            </DrawerHeader>
            <div className="text-ink-2 space-y-3 text-sm">
              <p>Kernel panic · -6h20m · reboot recovered</p>
              <p>Policy applied · -3h10m · owner: A. Keller</p>
              <p>Update installed · -47m · 14.1 → 14.2</p>
            </div>
            <DrawerFooter>
              <Button variant="ghost" size="sm">
                Close
              </Button>
              <Button size="sm">Investigate</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </ShowcaseRow>

      <ShowcaseRow label="Toast">
        <Button
          size="sm"
          onClick={() =>
            toast.success("Wave 4 deployed", {
              description: "128 devices patched successfully.",
            })
          }
        >
          Success
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            toast.error("Deploy failed", {
              description: "12 devices offline.",
              action: { label: "Retry", onClick: () => toast("Retrying…") },
            })
          }
        >
          Error + action
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            toast("Moment pinned as A", {
              description: "Pick another to compare.",
            })
          }
        >
          Neutral
        </Button>
      </ShowcaseRow>

      <ShowcaseRow label="Keyboard shortcut UI">
        <div className="border-line bg-elev flex items-center gap-3 rounded-xl border px-4 py-3">
          <span className="text-ink-2 text-sm">Open command bar</span>
          <Kbd keys={["⌘", "K"]} />
        </div>
        <div className="border-line bg-elev flex items-center gap-3 rounded-xl border px-4 py-3">
          <span className="text-ink-2 text-sm">Return to now</span>
          <Kbd keys={["Esc"]} />
        </div>
        <div className="border-line bg-elev flex items-center gap-3 rounded-xl border px-4 py-3">
          <span className="text-ink-2 text-sm">Compare pinned moments</span>
          <Kbd keys={["Shift", "C"]} />
        </div>
      </ShowcaseRow>
    </ShowcaseSection>
  );
}
