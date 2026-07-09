import { describe, expect, it } from "vitest";
import { createFakeDb } from "@/features/fake-db";
import { clusterIncidents, findClusterForIncident } from "./cluster-incidents";

describe("clusterIncidents", () => {
  it("returns an empty list for no incidents", () => {
    const db = createFakeDb("chrono-cluster-empty");
    const clusters = clusterIncidents([], db);
    expect(clusters).toEqual([]);
  });

  it("puts every incident into exactly one cluster", () => {
    const db = createFakeDb("chrono-cluster-partition");
    const open = db.incidents.filter((i) => i.status !== "resolved");
    const clusters = clusterIncidents(open, db);
    const flat = clusters.flatMap((c) => c.incidentIds);
    expect(flat.sort()).toEqual(open.map((i) => i.id).sort());
    const seen = new Set(flat);
    expect(seen.size).toBe(flat.length);
  });

  it("multi-incident clusters float above singletons in the result order", () => {
    const db = createFakeDb("chrono-cluster-order");
    const open = db.incidents.filter((i) => i.status !== "resolved");
    const clusters = clusterIncidents(open, db);
    let sawSingle = false;
    for (const cluster of clusters) {
      if (cluster.incidentIds.length === 1) sawSingle = true;
      else if (sawSingle) {
        throw new Error("Multi-cluster appeared after a singleton");
      }
    }
  });

  it("findClusterForIncident returns the cluster containing an incident", () => {
    const db = createFakeDb("chrono-cluster-find");
    const open = db.incidents.filter((i) => i.status !== "resolved");
    const clusters = clusterIncidents(open, db);
    for (const incident of open.slice(0, 3)) {
      const found = findClusterForIncident(incident.id, clusters);
      expect(found).not.toBeNull();
      expect(found?.incidentIds).toContain(incident.id);
    }
    expect(findClusterForIncident("bogus_id", clusters)).toBeNull();
  });
});
