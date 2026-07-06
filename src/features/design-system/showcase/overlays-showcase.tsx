"use client";

import { AlertTriangle, Copy, Info, Trash2 } from "lucide-react";
import { useState } from "react";
import {
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
      title="Tooltip, Popover, Dropdown, Context Menu, Modal, Drawer, Toast"
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
