import type { Edge } from '@xyflow/react';

import { MarkerType } from '@xyflow/react';

import type { FlowDocument, EntityNodeType, FlowGraphState, ValidationResult } from './flow-types';

// ----------------------------------------------------------------------

export const NODE_WIDTH = 180;
export const NODE_HEIGHT = 60;
const X_GAP = 60;
const Y_GAP = 100;

export const INITIAL_JSON = JSON.stringify(
  {
    A1: { description: 'Entry point' },
    B1: { description: 'Processing' },
    C1: { description: 'Validation' },
    D1: { description: 'Transform' },
    E1: { description: 'Output' },
    relations: {
      A1: { to: 'B1' },
      B1: { to: ['C1', 'D1'] },
      C1: { to: 'E1' },
    },
  },
  null,
  2
);

// ----------------------------------------------------------------------

export function validateFlowJson(jsonString: string): ValidationResult {
  const errors: string[] = [];

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    return { valid: false, errors: [`Invalid JSON syntax: ${(e as Error).message}`] };
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { valid: false, errors: ['JSON must be an object'] };
  }

  const relations = parsed.relations as Record<string, { to: unknown }> | undefined;
  if (!relations || typeof relations !== 'object') {
    // No relations is valid — just nodes with no edges
    return { valid: true, errors: [] };
  }

  const entityKeys = new Set(Object.keys(parsed).filter((k) => k !== 'relations'));

  Object.entries(relations).forEach(([source, rel]) => {
    if (!entityKeys.has(source)) {
      errors.push(`Relation source '${source}' is not defined as an entity`);
    }

    if (!rel || typeof rel !== 'object' || !('to' in rel)) {
      errors.push(`Relation '${source}' has invalid 'to' value`);
      return;
    }

    const targets = Array.isArray(rel.to) ? rel.to : [rel.to];
    targets.forEach((target) => {
      if (typeof target !== 'string') {
        errors.push(`Relation '${source}' has non-string 'to' value`);
      } else if (!entityKeys.has(target)) {
        errors.push(`Relation '${source}' references unknown entity '${target}'`);
      }
    });
  });

  return { valid: errors.length === 0, errors };
}

// ----------------------------------------------------------------------

export function parseFlowDocument(jsonString: string): FlowDocument {
  return JSON.parse(jsonString) as FlowDocument;
}

// ----------------------------------------------------------------------

function computeLayout(nodes: EntityNodeType[], edges: Edge[]): EntityNodeType[] {
  if (nodes.length === 0) return [];

  // Build adjacency list and compute in-degrees
  const adjacency: Record<string, string[]> = {};
  const inDegree: Record<string, number> = {};

  nodes.forEach((n) => {
    adjacency[n.id] = [];
    inDegree[n.id] = 0;
  });

  edges.forEach((e) => {
    if (adjacency[e.source]) {
      adjacency[e.source].push(e.target);
    }
    inDegree[e.target] = (inDegree[e.target] || 0) + 1;
  });

  // BFS to assign levels
  const levels: Record<string, number> = {};
  const queue: string[] = [];

  nodes.forEach((n) => {
    if (inDegree[n.id] === 0) {
      queue.push(n.id);
      levels[n.id] = 0;
    }
  });

  // If all nodes have incoming edges (pure cycle), start from the first node
  if (queue.length === 0 && nodes.length > 0) {
    queue.push(nodes[0].id);
    levels[nodes[0].id] = 0;
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentLevel = levels[current];

    adjacency[current]?.forEach((neighbor) => {
      if (levels[neighbor] === undefined) {
        levels[neighbor] = currentLevel + 1;
        queue.push(neighbor);
      }
    });
  }

  // Handle any remaining unvisited nodes (cycles)
  const maxLevel = Math.max(0, ...Object.values(levels));
  nodes.forEach((n) => {
    if (levels[n.id] === undefined) {
      levels[n.id] = maxLevel + 1;
    }
  });

  // Group nodes by level
  const levelGroups: Record<number, string[]> = {};
  Object.entries(levels).forEach(([nodeId, level]) => {
    if (!levelGroups[level]) levelGroups[level] = [];
    levelGroups[level].push(nodeId);
  });

  // Assign positions
  const positionMap: Record<string, { x: number; y: number }> = {};
  Object.entries(levelGroups).forEach(([level, nodeIds]) => {
    const count = nodeIds.length;
    const totalWidth = count * NODE_WIDTH + (count - 1) * X_GAP;
    const startX = -totalWidth / 2;

    nodeIds.forEach((nodeId, index) => {
      positionMap[nodeId] = {
        x: startX + index * (NODE_WIDTH + X_GAP),
        y: Number(level) * (NODE_HEIGHT + Y_GAP),
      };
    });
  });

  return nodes.map((n) => ({
    ...n,
    position: positionMap[n.id] || { x: 0, y: 0 },
  }));
}

// ----------------------------------------------------------------------

export function documentToGraph(doc: FlowDocument): FlowGraphState {
  const entityKeys = Object.keys(doc).filter((k) => k !== 'relations');

  const nodes: EntityNodeType[] = entityKeys.map((key) => ({
    id: key,
    type: 'entity',
    position: { x: 0, y: 0 },
    data: {
      label: key,
      entityKey: key,
      entityData: (doc[key] as Record<string, unknown>) || {},
    },
  }));

  const edges: Edge[] = [];
  const relations = doc.relations || {};

  Object.entries(relations).forEach(([source, rel]) => {
    if (!rel || typeof rel !== 'object' || !('to' in rel)) return;

    const targets = Array.isArray(rel.to) ? rel.to : [rel.to];
    targets.forEach((target) => {
      if (typeof target === 'string') {
        edges.push({
          id: `e-${source}-${target}`,
          source,
          target,
          type: 'smoothstep',
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        });
      }
    });
  });

  const layoutNodes = computeLayout(nodes, edges);

  return { nodes: layoutNodes, edges };
}
