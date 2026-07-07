export { TimelineCanvas, type TimelineCanvasProps } from "./components/timeline-canvas";
export { TimelineConsole } from "./components/timeline-console";
export { TimelineHeader } from "./components/timeline-header/timeline-header";
export { TimelineRibbon } from "./components/timeline-ribbon/timeline-ribbon";
export { TimelineAxis } from "./components/timeline-axis";
export { TimelineLanes } from "./components/timeline-lanes/timeline-lanes";
export { TimelineLaneRow } from "./components/timeline-lanes/timeline-lane";
export { LiveBadge } from "./components/timeline-header/live-badge";
export { PlaybackControls } from "./components/timeline-header/playback-controls";
export { ZoomControls } from "./components/zoom-controls";
export { JumpMenu } from "./components/timeline-header/jump-menu";
export { RibbonPlayhead } from "./components/timeline-ribbon/ribbon-playhead";
export { RibbonWaveform } from "./components/timeline-ribbon/ribbon-waveform";
export { RibbonMarkers } from "./components/timeline-ribbon/ribbon-markers";
export { RibbonFutureShade } from "./components/timeline-ribbon/ribbon-future-shade";
export { RibbonHoverGhost } from "./components/timeline-ribbon/ribbon-hover-ghost";

export { useTimelineEngine } from "./hooks/use-timeline-engine";
export type {
  TimelineEngineApi,
  UseTimelineEngineOptions,
} from "./hooks/use-timeline-engine";
export { useScrubber } from "./hooks/use-scrubber";
export { useEventGroups } from "./hooks/use-event-groups";
export { useElementWidth } from "./hooks/use-element-width";

export { clusterEventsByProximity } from "./utils/event-clustering";
export {
  timestampToRatio,
  ratioToTimestamp,
  pointerRatio,
  isWithinWindow,
} from "./utils/time-scale";
export {
  ZOOM_LEVELS,
  ZOOM_LABELS,
  ZOOM_MINUTES,
  RIBBON_BUCKET_COUNT,
  MARKER_CLUSTER_DISTANCE_PX,
  AXIS_TICK_COUNT,
  PAST_RATIO,
  PLAYBACK_RATES,
  PLAYBACK_RATE_LABELS,
  DEFAULT_PLAYBACK_RATE,
  JUMP_PRESET_LABELS,
} from "./utils/zoom-presets";

export type {
  EventCluster,
  JumpPreset,
  PlaybackRate,
  TimelineMode,
  ZoomLevel,
} from "./types/timeline.types";
