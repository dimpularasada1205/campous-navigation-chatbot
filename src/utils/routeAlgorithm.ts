import { Location, Connection, RouteResult } from '../types';

export interface Edge {
  nodeId: string;
  distance: number;
  time: number;
  description: string;
}

/**
 * ADSA Campus Graph: Builds an undirected adjacency list from campus connections.
 * Campus walkways are bidirectional.
 */
export function buildGraph(connections: Connection[]): Map<string, Edge[]> {
  const graph = new Map<string, Edge[]>();

  for (const conn of connections) {
    if (!graph.has(conn.fromLocation)) graph.set(conn.fromLocation, []);
    if (!graph.has(conn.toLocation)) graph.set(conn.toLocation, []);

    // Forward edge
    graph.get(conn.fromLocation)!.push({
      nodeId: conn.toLocation,
      distance: conn.distance,
      time: conn.estimatedTime,
      description: conn.pathDescription
    });

    // Reverse edge (undirected campus pathway)
    graph.get(conn.toLocation)!.push({
      nodeId: conn.fromLocation,
      distance: conn.distance,
      time: conn.estimatedTime,
      description: `Return path: Follow walkway back toward destination.`
    });
  }

  return graph;
}

/**
 * ADSA Algorithm 1: Breadth-First Search (BFS)
 * PRIMARY pathfinding algorithm for finding the shortest path (minimum hops) in an unweighted campus graph.
 *
 * Flow:
 * START LOCATION -> CAMPUS GRAPH -> BFS -> PATH -> DESTINATION
 */
export function bfsShortestPath(
  startId: string,
  targetId: string,
  locations: Location[],
  connections: Connection[]
): RouteResult | null {
  if (startId === targetId) {
    const loc = locations.find(l => l.id === startId);
    if (!loc) return null;
    return {
      from: loc,
      to: loc,
      path: [loc],
      totalDistance: 0,
      estimatedTime: 0,
      steps: [`You are already at ${loc.name}.`],
      algorithm: 'BFS'
    };
  }

  const locationMap = new Map<string, Location>();
  locations.forEach(l => locationMap.set(l.id, l));

  const fromLocation = locationMap.get(startId);
  const toLocation = locationMap.get(targetId);
  if (!fromLocation || !toLocation) return null;

  const graph = buildGraph(connections);

  // BFS Queue: stores current node ID
  const queue: string[] = [startId];
  const visited = new Set<string>([startId]);
  const parentMap = new Map<string, string>(); // child -> parent

  let found = false;

  while (queue.length > 0) {
    const currentId = queue.shift()!;

    if (currentId === targetId) {
      found = true;
      break;
    }

    const neighbors = graph.get(currentId) || [];
    for (const edge of neighbors) {
      if (!visited.has(edge.nodeId)) {
        visited.add(edge.nodeId);
        parentMap.set(edge.nodeId, currentId);
        queue.push(edge.nodeId);
      }
    }
  }

  if (!found) {
    return null; // Target unreachable in this campus graph component
  }

  // Reconstruct path from targetId backwards to startId
  const pathIds: string[] = [];
  let curr: string | undefined = targetId;
  while (curr !== undefined) {
    pathIds.unshift(curr);
    curr = parentMap.get(curr);
  }

  return buildRouteResult(pathIds, fromLocation, toLocation, locationMap, graph, 'BFS');
}

/**
 * ADSA Algorithm 2: Depth-First Search (DFS)
 * Explores branch depth first to locate a valid walkable pathway.
 */
export function dfsPath(
  startId: string,
  targetId: string,
  locations: Location[],
  connections: Connection[]
): RouteResult | null {
  if (startId === targetId) {
    const loc = locations.find(l => l.id === startId);
    if (!loc) return null;
    return {
      from: loc,
      to: loc,
      path: [loc],
      totalDistance: 0,
      estimatedTime: 0,
      steps: [`You are already at ${loc.name}.`],
      algorithm: 'DFS'
    };
  }

  const locationMap = new Map<string, Location>();
  locations.forEach(l => locationMap.set(l.id, l));

  const fromLocation = locationMap.get(startId);
  const toLocation = locationMap.get(targetId);
  if (!fromLocation || !toLocation) return null;

  const graph = buildGraph(connections);

  const visited = new Set<string>();
  const parentMap = new Map<string, string>();
  let found = false;

  function dfsVisit(u: string): boolean {
    visited.add(u);
    if (u === targetId) return true;

    const neighbors = graph.get(u) || [];
    for (const edge of neighbors) {
      if (!visited.has(edge.nodeId)) {
        parentMap.set(edge.nodeId, u);
        if (dfsVisit(edge.nodeId)) {
          return true;
        }
      }
    }
    return false;
  }

  found = dfsVisit(startId);
  if (!found) return null;

  // Reconstruct path
  const pathIds: string[] = [];
  let curr: string | undefined = targetId;
  while (curr !== undefined) {
    pathIds.unshift(curr);
    curr = parentMap.get(curr);
  }

  return buildRouteResult(pathIds, fromLocation, toLocation, locationMap, graph, 'DFS');
}

/**
 * Helper to build final RouteResult with metrics and turn-by-turn guidance.
 */
function buildRouteResult(
  pathIds: string[],
  fromLocation: Location,
  toLocation: Location,
  locationMap: Map<string, Location>,
  graph: Map<string, Edge[]>,
  algorithm: 'BFS' | 'DFS'
): RouteResult {
  const pathLocations = pathIds.map(id => locationMap.get(id)!).filter(Boolean);

  let totalDistance = 0;
  let totalMinutes = 0;
  const steps: string[] = [];

  steps.push(`Start from ${fromLocation.name} (${fromLocation.building}).`);

  for (let i = 0; i < pathLocations.length - 1; i++) {
    const from = pathLocations[i];
    const to = pathLocations[i + 1];

    const edge = graph.get(from.id)?.find(e => e.nodeId === to.id);
    const dist = edge ? edge.distance : 80;
    const time = edge ? edge.time : 1.2;

    totalDistance += dist;
    totalMinutes += time;

    const desc = edge?.description || `Proceed along campus pathway toward ${to.name}.`;
    steps.push(`Walk towards ${to.name} (~${dist}m): ${desc}`);
  }

  steps.push(`Arrived at destination: ${toLocation.name} (${toLocation.building}, ${toLocation.floor}).`);

  return {
    from: fromLocation,
    to: toLocation,
    path: pathLocations,
    totalDistance: Math.round(totalDistance),
    estimatedTime: Math.max(1, Math.round(totalMinutes)),
    steps,
    algorithm
  };
}

/**
 * Primary pathfinding export: delegates to BFS as required by ADSA specifications.
 */
export function findShortestPath(
  startId: string,
  targetId: string,
  locations: Location[],
  connections: Connection[],
  algorithm: 'BFS' | 'DFS' = 'BFS'
): RouteResult | null {
  if (algorithm === 'DFS') {
    return dfsPath(startId, targetId, locations, connections);
  }
  return bfsShortestPath(startId, targetId, locations, connections);
}
