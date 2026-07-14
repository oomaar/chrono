# Chrono

**A time-first operating system for enterprise device operations.**

Chrono is a portfolio project that reimagines the enterprise MDM/EMM console around one idea: **time is the primary interface.** Every screen, every command, and every decision hangs off a single always-visible timeline. Operators scrub, pin, compare, replay, and schedule — never navigate.

**🔗 Live demo:** [chrono-operations.vercel.app](https://chrono-operations.vercel.app)

> **⚠ This is a prototype.** No real backend. Every device, incident, and event comes from a deterministic in-memory fake database. All "intelligence" (attention scores, clustering, smart summaries) is computed from that fake data by pure functions — no ML, no external APIs.

---

## Why this exists

Enterprise device management tools ship as tables + charts + YAML editors + settings pages. The mental model is _pages_: navigate to the device, navigate to the policy, navigate to the incident. Chrono replaces that with:

- **One timeline** that owns the app's temporal state
- **One command bar** that speaks a small operational language (past + present + future verbs)
- **Four stages** (Console, Investigate, Compare, Device) derived from the current focus + pin state, not from URLs

Chrono is an argument that a time-anchored UI reduces clicks, restores the causal chain behind an incident, and lets operators trust the system more than a wall of dashboards ever could.

---

## The core interactions

### The timeline is always alive

- Live clock ticks; ambient events land as animated markers; the LIVE badge pings once per new event
- Scrub the ribbon → the console reconstructs to that moment
- 84-bucket waveform breathes as event density changes
- Playhead springs to new positions with a `motion` transition

### Pin A → Pin B → Compare

- Any moment can be pinned (keyboard: `A` / `B`, or via the ribbon)
- Two pins auto-open the Compare stage: a three-column diff (state at A · delta spine · state at B) plus the events that happened between them
- Every event between the pins is clickable to Investigate

### Command Language DSL

- Real tokenizer + parser + planner + executor (`src/features/command-language/`)
- Verbs span three tenses: past (`investigate incident_3`, `compare incident_1 incident_2`), present (`reboot berlin`, `isolate finance`), future (`schedule reboot tomorrow`)
- Every commit goes through a bottom-sheet ceremony: blast radius dot grid → dry-run preview → type-the-verb confirmation for destructive actions
- Autocomplete, syntax highlighting, tab-completion, `⌘K` global focus

### Intelligence layer (deterministic, not AI)

- **Attention ranking** weights 6 factors (severity 42%, recency 14%, exposure 20%, blast 12%, unresolved time 8%, reversibility bonus 4%) into a 0–100 score
- **Automatic clustering** groups related incidents via union-find across 5 reason axes (same-lane, same-office, shared-update, shared-policy, shared-devices)
- **Smart summaries** turn window + state into a headline, trend arrow, and highlight chips
- **Next actions** fire from context predicates (`retry-failed`, `verify-fix`, `escalate`, `batch-apply`, `pin-and-compare`, `investigate-hotspot`)

---

## Architecture

Feature-based folders under `src/features/`:

```
fake-db/         → relational in-memory universe + deterministic seed
                  time-engine, live-engine, ambient event generator, clock
timeline/       → timeline hook + ribbon, playhead, pins, keyboard shortcuts
command-language/ → grammar, tokenizer, parser, planner, executor, composer
intelligence/   → attention rank, clustering, summaries, next actions, hook
console/        → shell + stages (Console / Investigate / Compare / Device)
design-system/  → primitives + tokens + illustrations + showcase route
theme/          → light / dark / system with SSR-safe hydration
illustrations/  → hand-drawn SVGs for empty / error / not-found states
```

Every feature owns its types, utils, components, and (where relevant) tests. Every stage is one component. Every page is orchestration only.

---

## Stack

- **Next.js 16** (App Router + Turbopack)
- **React 19** — strict `react-hooks/refs` + `react-hooks/set-state-in-effect` rules respected throughout
- **TypeScript 5** — strict, path aliases (`@/features/*`)
- **Tailwind CSS v4** — `@theme inline` tokens matching the wireframe palette exactly
- **motion/react** for all animations, respects `prefers-reduced-motion`
- **Radix UI** primitives + **Sonner** toasts + **Vaul** drawer + **Lucide** icons
- **Vitest + Testing Library** — 96 tests across fake-db, intelligence, command language
- **Prettier + ESLint + Husky + lint-staged** — every commit is formatted, linted, and typechecked

---

## Getting started

Live at [chrono-operations.vercel.app](https://chrono-operations.vercel.app), or run locally:

```bash
npm install
npm run dev
```

Open http://localhost:3000 for the console, or http://localhost:3000/design-system for the primitive showcase.

### Scripts

```bash
npm run dev          # local dev server (Turbopack)
npm run build        # production build
npm test             # vitest run (96 tests)
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run format       # prettier --write
```

---

## Keyboard shortcuts

Press `?` anywhere in the app to open the full shortcut sheet.

| Category | Key          | Action                        |
| -------- | ------------ | ----------------------------- |
| Command  | `⌘K`         | Focus the command bar         |
| Command  | `Enter`      | Commit the current command    |
| Command  | `Tab`        | Accept active suggestion      |
| Timeline | `Space`      | Play / pause                  |
| Timeline | `← / →`      | Step 5 minutes                |
| Timeline | `⇧ ← / →`    | Step 1 hour                   |
| Timeline | `Home / End` | Jump to start / end of window |
| Timeline | `A / B`      | Pin playhead as A / B         |
| Timeline | `1 / 2`      | Jump to pin A / B             |
| Timeline | `C`          | Clear pins                    |
| Nav      | `Esc`        | Return to console             |
| Nav      | `?`          | Open shortcut sheet           |

---

## Design philosophy (constraints, not decoration)

Rules the project holds itself to:

1. **Time is the primary interface** — no page routes, everything derives from the playhead + focus state
2. **No feature exists to display information** — every experience helps answer _what happened_, _what's happening_, or _what will happen_
3. **Tailwind utilities only** — no inline `style={{}}`, no CSS modules, no styled-components
4. **Feature-based architecture** — one folder per feature, one component per file, pages orchestrate only
5. **Deterministic fake-db** — every build produces the same operational universe from the same seed

The full constitution lives in [`CLAUDE.md`](./CLAUDE.md).

---

## What I'd build next

Honest gaps I know about:

- **Onboarding overlay** — first-time visitors land on a dense console. A 3-step tour highlighting the pin/compare/execute flow would sell the interaction faster than any static doc.
- **Real intelligence** — attention ranking is real math; confidence factor breakdown is decorative. In a follow-up I'd swap the decompositional breakdown for evidence-linked factors ("this fix worked N/M times in the last 30 days").
- **Automation stage** — schedule + trigger conditions have data models in the fake-db but no first-class UI yet.
- **Multi-tenant scoping** — one operator sees one fleet today; a "which fleet?" affordance in the top rail would map to real deployments.
- **Timeline sharing** — a permalink like `/t/2026-07-14T10:32Z?a=incident_1&b=now` would let operators share a specific moment or comparison.

---

## Screens

- **Console** — smart summary, fleet stats, attention-ranked decision queue, next actions, activity sidebar (Recent / History / Scheduled tabs)
- **Investigate** — causal chain, affected devices, sticky recommendation card with confidence meter + factor breakdown, cluster badge + related incidents
- **Compare** — three-column A / delta spine / B, plus every event between the two pins
- **Device** — status pill, "life on one line" mini-ribbon, 24h history, facts, scoped command hint
- **Execute** — bottom sheet with 40-column device dot grid, scope chips, dry-run preview, ⌘↵ commit, type-the-verb confirmation for destructive commands
- **Design system** — every primitive at `/design-system` including the animated counter showcase

---

## Screenshots

<table>
  <tr>
    <td width="50%"><img src="docs/screenshots/console.png" alt="Console pane" /></td>
    <td width="50%"><img src="docs/screenshots/compare.png" alt="Compare stage" /></td>
  </tr>
  <tr>
    <td><strong>Console</strong><br/><sub>Smart summary, attention-ranked decision queue, next actions, and the tabbed activity sidebar.</sub></td>
    <td><strong>Compare</strong><br/><sub>Three-column diff between two pinned moments, plus every event that landed between them.</sub></td>
  </tr>
  <tr>
    <td><img src="docs/screenshots/command.png" alt="Execute command sheet" /></td>
    <td><img src="docs/screenshots/device.png" alt="Device story" /></td>
  </tr>
  <tr>
    <td><strong>Command</strong><br/><sub>Bottom-sheet commit ceremony — 40-col device dot grid, dry-run preview, ⌘↵ to commit.</sub></td>
    <td><strong>Device</strong><br/><sub>Full device story with the "life on one line" mini-ribbon, 24h history, and facts panel.</sub></td>
  </tr>
</table>

Screenshot files live in `docs/screenshots/`.

---

## License

Personal portfolio project. All code © the author. No warranty; not for production use.
