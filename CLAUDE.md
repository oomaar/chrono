# CHRONO — Project Constitution

Before generating any code, architecture, components, pages, routes, data structures, interactions, animations, or designs, follow these rules.

These rules are project constraints and must be respected throughout the project.

---

# Source of Truth

The approved Chrono wireframes already exist locally and must always be treated as the primary product reference.

Wireframes location:

/Users/omar/Projects/chrono/chrono-design/v2

Before implementing any experience:

- Review the relevant wireframes.
- Preserve the interaction philosophy.
- Preserve the timeline-first mental model.
- Preserve the workflows and information hierarchy.
- Do not redesign experiences unless explicitly requested.
- Do not replace timeline-driven interactions with traditional dashboard patterns.
- If implementation details are unclear, infer them from surrounding wireframes before inventing new UX.

The goal is implementation, not redesign.

---

# Product Goal

Chrono is a time-first operating system for enterprise device operations.

It is NOT:

- an admin dashboard
- a CRUD showcase
- an MDM clone
- an analytics dashboard
- a monitoring application
- a KPI reporting tool

Chrono is built around one core idea:

**Time is the primary interface.**

Users should feel like they are navigating operational history, investigating incidents, executing actions, replaying events, and scheduling future automation through time itself.

Every feature should reinforce:

- awareness
- investigation
- comparison
- execution
- automation
- operational decision making

Avoid features whose only purpose is displaying information.

Every experience should help answer:

- What happened?
- What is happening?
- What will happen?

---

# Engineering Goal

Code quality is a first-class product feature.

Optimize for:

- maintainability
- readability
- modularity
- scalability

Assume this project will eventually contain:

- hundreds of components
- dozens of interactions
- multiple operational experiences

The architecture should remain easy to navigate as the project grows.

---

# Technology Constraints

Framework

Next.js App Router

Language

TypeScript (strict mode)

Styling

Tailwind CSS only

Allowed

- Tailwind utility classes
- clsx
- class-variance-authority (cva)

Forbidden

- inline styles
- style={{}}
- CSS Modules
- SCSS
- custom CSS files
- styled-components
- emotion

Every visual decision must be implemented using Tailwind utilities.

---

# Component Architecture

Large files are forbidden.

Pages are orchestration layers only.

Pages compose components.

Pages should never contain large UI trees.

Whenever a page becomes visually complex:

Extract components immediately.

Bad

- 500+ line page files
- dialogs inside pages
- timeline logic inside pages
- command parsing inside pages
- comparison logic inside pages
- playback logic inside pages
- forms inside pages

Good

page.tsx

TimelineCanvas

TimelineHeader

TimelineMarker

Playhead

CommandBar

MomentCard

MomentInspector

RecentMoments

HealthSummary

DeviceStory

ComparisonView

PlaybackControls

InvestigationPanel

AutomationPreview

Every component should live in its own file.

---

# File Organization

Use feature-based architecture.

Examples

src/features/timeline

src/features/command-language

src/features/investigation

src/features/comparison

src/features/device-story

src/features/live-feed

src/features/playback

src/features/automation

src/features/incidents

src/features/deployments

Each feature owns:

- components
- hooks
- types
- utils
- constants

Avoid giant shared folders.

---

# Types

Never declare large interfaces inside components.

Create dedicated type files.

Examples

timeline.types.ts

device.types.ts

command.types.ts

incident.types.ts

comparison.types.ts

automation.types.ts

deployment.types.ts

---

# Utilities

Utility functions belong outside components.

Examples

- timeline reconstruction
- event grouping
- formatting
- command parsing
- sorting
- filtering
- transformations
- comparison algorithms

Utilities should remain pure.

---

# Constants

Avoid magic values.

Statuses

Severities

Command keywords

Timeline colors

Animation durations

Thresholds

Mappings

Configuration

should live inside dedicated constants files.

---

# SOLID Principles

Apply SOLID principles whenever reasonable.

Especially:

Single Responsibility Principle

Each component should have one reason to change.

Avoid components that simultaneously:

- fetch data
- transform data
- reconstruct timeline state
- parse commands
- manage playback
- render UI
- manage forms
- manage dialogs

Split responsibilities aggressively.

---

# Reusability

Create reusable primitives.

Examples

TimelineSection

TimelineLane

MomentMarker

MomentBadge

StatusChip

DecisionCard

HealthIndicator

ConfidenceBadge

CommandSuggestion

PlaybackControls

SectionHeader

MetricRow

EmptyState

LoadingState

Skeleton

Avoid duplicated implementations.

---

# Fake Database Philosophy

The fake-db is a simulated operational universe.

It is NOT a collection of mock arrays.

Everything must be relational.

Examples

Devices

Users

Teams

Offices

Policies

Commands

Deployments

Updates

Incidents

Timeline Events

Automation Rules

Investigations

Rollouts

Alerts

Every entity should reference other entities naturally.

If an incident affects a device,

that same device should also appear inside:

- timeline
- investigations
- deployment history
- command history
- comparisons
- office inventory
- automation rules
- update history

The fake-db should feel like a real backend.

Never isolated fixtures.

---

# Deterministic Data

Use seeded generators.

The same build should always generate the same operational universe.

Benefits

- reproducible debugging
- consistent screenshots
- stable relationships
- predictable development

---

# Product Experience

Avoid dashboard syndrome.

Chrono is a collection of operational experiences.

Examples

Timeline Console

Investigate a Moment

Compare Moments

Execute Command

Device Story

Automation Timeline

Operational Replay

Deployment Preview

Incident Investigation

The goal is never displaying information.

The goal is helping operators understand and change the operational state of the fleet.

---

# Timeline Philosophy

Time is the interface.

The timeline is NOT a chart.

The timeline is NOT a widget.

The timeline is NOT a page section.

The timeline IS the product.

Every important interaction should originate from time.

Examples

- scrubbing history
- replaying incidents
- comparing two moments
- jumping to deployments
- scheduling future actions
- reconstructing system state
- navigating operational history

Users should navigate moments, not pages.

---

# Command Philosophy

The command bar is NOT search.

The command bar is NOT a command palette.

The command bar is an operational language.

Commands should naturally support:

Present

- reboot device
- isolate endpoint
- deploy update
- restart service

Past

- investigate outage
- compare before deployment
- explain what changed
- replay incident

Future

- deploy tomorrow
- notify when CPU exceeds threshold
- schedule maintenance
- retry failed rollout

The same language should naturally span:

- past
- present
- future

---

# Feeling Alive

The platform should never feel static.

Examples

- live clock
- progressing deployments
- incoming events
- timeline playback
- command previews
- changing health indicators
- simulated operational activity
- live notifications
- attention shifts
- status transitions

Motion should communicate state.

Never animate for decoration.

---

# Design Philosophy

Function before decoration.

Chrono should feel:

- calm
- intelligent
- operational
- intentional
- premium

Avoid trend-driven UI.

Avoid unnecessary visual effects.

Avoid designing for screenshots.

Design for interaction.

Every visual decision should improve:

- awareness
- investigation
- comparison
- decision making
- execution

---

# Portfolio Philosophy

Chrono is not trying to imitate existing enterprise software.

It exists to demonstrate interaction design, product thinking, engineering quality, and frontend architecture.

The goal is not to impress with visuals alone.

The goal is to make reviewers stop and ask:

"How does this interaction work?"

Prioritize memorable interactions over decorative interfaces.

Never add a feature simply because enterprise software usually has it.

Every experience should feel intentional and original.

---

# Implementation Philosophy

Build interactions before building pages.

Build reusable systems before building features.

Prefer one unforgettable experience over ten average screens.

Depth is more valuable than breadth.

A polished workflow is more valuable than a complete CRUD application.

---

# Final Rule

Before implementing anything, ask:

"Does this reinforce the idea that time is the primary interface?"

If the answer is no,

reconsider the implementation.

Then ask:

"Would this make an experienced frontend engineer pause and wonder how it was designed and built?"

If the answer is no,

keep iterating until it does.
