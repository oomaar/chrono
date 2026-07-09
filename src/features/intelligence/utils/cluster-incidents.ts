import type { FakeDb, Incident } from "@/features/fake-db";
import { INCIDENT_SEVERITY_ORDER } from "@/features/fake-db";
import type {
  ClusterReason,
  ClusterReasonKey,
  IncidentCluster,
} from "../types/intelligence.types";

const REASON_LABEL: Record<ClusterReasonKey, string> = {
  "same-lane": "Same lane",
  "same-office": "Same office",
  "shared-devices": "Shared devices",
  "shared-update": "Shared update",
  "shared-policy": "Shared policy",
};

const worstSeverity = (incidents: Incident[]): Incident["severity"] => {
  return incidents.reduce<Incident["severity"]>(
    (worst, incident) =>
      INCIDENT_SEVERITY_ORDER.indexOf(incident.severity) <
      INCIDENT_SEVERITY_ORDER.indexOf(worst)
        ? incident.severity
        : worst,
    "low",
  );
};

// ---------------------------------------------------------------------------
// Office lookup — precompute per incident so pairwise detection is O(1).
// Each incident is summarized as (a) the set of offices it touches at all,
// and (b) its "primary office" — the one with the plurality of affected
// devices. Two incidents share an office signal if their primary offices
// match; that's more predictive than fuzzy overlap on the full set.
// ---------------------------------------------------------------------------

type IncidentOfficeInfo = {
  all: Set<string>;
  primary: string | null;
};

const computeOfficeInfo = (incident: Incident, db: FakeDb): IncidentOfficeInfo => {
  const counts = new Map<string, number>();
  for (const deviceId of incident.affectedDeviceIds) {
    const device = db.devices.find((d) => d.id === deviceId);
    if (!device) continue;
    counts.set(device.officeId, (counts.get(device.officeId) ?? 0) + 1);
  }
  let primary: string | null = null;
  let best = 0;
  for (const [id, count] of counts) {
    if (count > best) {
      best = count;
      primary = id;
    }
  }
  return { all: new Set(counts.keys()), primary };
};

const sharePrimaryOffice = (a: IncidentOfficeInfo, b: IncidentOfficeInfo): boolean =>
  a.primary !== null && a.primary === b.primary;

// ---------------------------------------------------------------------------
// Union-find so an incident can pull siblings across multiple reason axes.
// ---------------------------------------------------------------------------

const makeParents = (n: number): number[] => {
  const parents: number[] = [];
  for (let i = 0; i < n; i += 1) parents.push(i);
  return parents;
};

const find = (parents: number[], i: number): number => {
  let root = i;
  while (parents[root] !== root) root = parents[root];
  let cursor = i;
  while (parents[cursor] !== root) {
    const next = parents[cursor];
    parents[cursor] = root;
    cursor = next;
  }
  return root;
};

const union = (parents: number[], a: number, b: number): void => {
  const ra = find(parents, a);
  const rb = find(parents, b);
  if (ra !== rb) parents[ra] = rb;
};

// ---------------------------------------------------------------------------
// Pairwise reason detector
// ---------------------------------------------------------------------------

const detectReasons = (
  a: Incident,
  b: Incident,
  aOffices: IncidentOfficeInfo,
  bOffices: IncidentOfficeInfo,
): ClusterReasonKey[] => {
  const reasons: ClusterReasonKey[] = [];

  if (a.lane === b.lane) reasons.push("same-lane");
  if (a.relatedUpdateId && a.relatedUpdateId === b.relatedUpdateId) {
    reasons.push("shared-update");
  }
  if (a.relatedPolicyId && a.relatedPolicyId === b.relatedPolicyId) {
    reasons.push("shared-policy");
  }
  if (sharePrimaryOffice(aOffices, bOffices)) {
    reasons.push("same-office");
  }

  const aDeviceSet = new Set(a.affectedDeviceIds);
  const overlap = b.affectedDeviceIds.filter((id) => aDeviceSet.has(id));
  if (
    overlap.length >= 2 ||
    (overlap.length >= 1 && a.affectedDeviceIds.length + b.affectedDeviceIds.length <= 6)
  ) {
    reasons.push("shared-devices");
  }

  return reasons;
};

/**
 * Two incidents cluster together if they share ≥ 2 reason axes, OR they share
 * a strong signal (same update / policy / meaningful device overlap). This is
 * intentionally conservative so we don't group everything into one lump.
 */
const shouldCluster = (reasons: ClusterReasonKey[]): boolean => {
  if (reasons.length >= 2) return true;
  return reasons.some(
    (r) => r === "shared-update" || r === "shared-policy" || r === "shared-devices",
  );
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Discover incident clusters (aka "situations") from a list of open incidents.
 * Deterministic. Every incident appears in exactly one cluster; a cluster of
 * size 1 means the incident stands alone.
 */
export const clusterIncidents = (
  incidents: Incident[],
  db: FakeDb,
): IncidentCluster[] => {
  const n = incidents.length;
  if (n === 0) return [];

  const officeSets = incidents.map((incident) => computeOfficeInfo(incident, db));
  const parents = makeParents(n);
  const pairReasons = new Map<string, ClusterReasonKey[]>();

  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const reasons = detectReasons(
        incidents[i],
        incidents[j],
        officeSets[i],
        officeSets[j],
      );
      if (!shouldCluster(reasons)) continue;
      union(parents, i, j);
      pairReasons.set(`${i}:${j}`, reasons);
    }
  }

  const groups = new Map<number, number[]>();
  for (let i = 0; i < n; i += 1) {
    const root = find(parents, i);
    const list = groups.get(root) ?? [];
    list.push(i);
    groups.set(root, list);
  }

  const clusters: IncidentCluster[] = [];
  for (const [rootIndex, memberIndices] of groups) {
    const members = memberIndices.map((idx) => incidents[idx]);

    // Aggregate reasons across all pairs in the group.
    const reasonSet = new Set<ClusterReasonKey>();
    for (let a = 0; a < memberIndices.length; a += 1) {
      for (let b = a + 1; b < memberIndices.length; b += 1) {
        const key = `${Math.min(memberIndices[a], memberIndices[b])}:${Math.max(memberIndices[a], memberIndices[b])}`;
        for (const r of pairReasons.get(key) ?? []) reasonSet.add(r);
      }
    }

    // Gather all offices touched by any member so we can label the cluster.
    const officeIds = new Set<string>();
    for (const info of memberIndices.map((idx) => officeSets[idx])) {
      for (const id of info.all) officeIds.add(id);
    }
    const officeNames = Array.from(officeIds)
      .map((id) => db.offices.find((o) => o.id === id)?.name)
      .filter((name): name is string => Boolean(name));

    const uniqueDeviceIds = new Set(
      members.flatMap((incident) => incident.affectedDeviceIds),
    );

    const worst = worstSeverity(members);
    const reasons: ClusterReason[] = Array.from(reasonSet).map((key) => ({
      key,
      label: REASON_LABEL[key],
      detail:
        key === "shared-update"
          ? "Same update rollout in the chain"
          : key === "shared-policy"
            ? "Same policy in the chain"
            : key === "shared-devices"
              ? "Overlapping devices"
              : key === "same-office"
                ? "All in one office"
                : "Same operational lane",
    }));

    const headline =
      members.length === 1
        ? members[0].title
        : `${members.length} related ${worst === "crit" ? "critical " : ""}incidents`;

    clusters.push({
      id: `cluster_${rootIndex}_${members.map((m) => m.id).join("_")}`,
      headline,
      incidentIds: members.map((m) => m.id),
      reasons,
      primaryLane: members[0].lane,
      worstSeverity: worst,
      affectedDeviceCount: uniqueDeviceIds.size,
      offices: officeNames,
    });
  }

  // Sort so multi-incident clusters float to the top, then by worst severity.
  return clusters.sort((a, b) => {
    if (a.incidentIds.length !== b.incidentIds.length) {
      return b.incidentIds.length - a.incidentIds.length;
    }
    return (
      INCIDENT_SEVERITY_ORDER.indexOf(a.worstSeverity) -
      INCIDENT_SEVERITY_ORDER.indexOf(b.worstSeverity)
    );
  });
};

/**
 * Convenience: find the cluster a specific incident belongs to (or null).
 */
export const findClusterForIncident = (
  incidentId: string,
  clusters: IncidentCluster[],
): IncidentCluster | null => {
  for (const cluster of clusters) {
    if (cluster.incidentIds.includes(incidentId)) return cluster;
  }
  return null;
};
