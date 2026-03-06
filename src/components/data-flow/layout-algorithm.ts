import type { Edge } from '@xyflow/react';

import { X_GAP, Y_GAP, RECV_NODE_WIDTH, ENTITY_NODE_WIDTH } from './constants';

import type { DataFlowNodeData, DataFlowNodeInstance } from './types';

// ----------------------------------------------------------------------

export function computeDataFlowLayout(
  nodes: DataFlowNodeInstance[],
  edges: Edge[]
): DataFlowNodeInstance[] {
  if (nodes.length === 0) return [];

  // Build adjacency maps
  const outgoing = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  nodes.forEach((n) => {
    outgoing.set(n.id, []);
    inDegree.set(n.id, 0);
  });

  edges.forEach((e) => {
    const out = outgoing.get(e.source);
    if (out) out.push(e.target);
    inDegree.set(e.target, (inDegree.get(e.target) || 0) + 1);
  });

  // BFS topological sort to assign levels
  const levels = new Map<string, number>();
  const queue: string[] = [];

  nodes.forEach((n) => {
    if ((inDegree.get(n.id) || 0) === 0) {
      queue.push(n.id);
      levels.set(n.id, 0);
    }
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentLevel = levels.get(current) || 0;
    const neighbors = outgoing.get(current) || [];

    neighbors.forEach((neighbor) => {
      const existingLevel = levels.get(neighbor);
      const newLevel = currentLevel + 1;

      if (existingLevel === undefined || newLevel > existingLevel) {
        levels.set(neighbor, newLevel);
      }

      inDegree.set(neighbor, (inDegree.get(neighbor) || 0) - 1);
      if ((inDegree.get(neighbor) || 0) <= 0) {
        queue.push(neighbor);
      }
    });
  }

  // Assign remaining unvisited nodes
  const maxLevel = Math.max(0, ...Array.from(levels.values()));
  nodes.forEach((n) => {
    if (!levels.has(n.id)) {
      levels.set(n.id, maxLevel + 1);
    }
  });

  // Group nodes by level
  const nodesByLevel = new Map<number, DataFlowNodeInstance[]>();
  nodes.forEach((n) => {
    const level = levels.get(n.id) || 0;
    if (!nodesByLevel.has(level)) nodesByLevel.set(level, []);
    nodesByLevel.get(level)!.push(n);
  });

  // Assign positions (left-to-right flow)
  let xOffset = 40;
  const sortedLevels = Array.from(nodesByLevel.keys()).sort((a, b) => a - b);

  sortedLevels.forEach((level) => {
    const levelNodes = nodesByLevel.get(level)!;
    let yOffset = 60;
    let maxWidth = 0;

    levelNodes.forEach((node) => {
      node.position = { x: xOffset, y: yOffset };
      const width = getNodeWidth(node);
      if (width > maxWidth) maxWidth = width;
      const height = estimateNodeHeight(node);
      yOffset += height + Y_GAP;
    });

    xOffset += maxWidth + X_GAP;
  });

  return [...nodes];
}

// ----------------------------------------------------------------------

function getNodeWidth(node: DataFlowNodeInstance): number {
  const data = node.data as DataFlowNodeData;
  return data.nodeType === 'recv' ? RECV_NODE_WIDTH : ENTITY_NODE_WIDTH;
}

function estimateNodeHeight(node: DataFlowNodeInstance): number {
  const data = node.data as DataFlowNodeData;

  // RECV node: header (~47px) + channels line (~26px) + count line (~26px) + body padding (16px)
  if (data.nodeType === 'recv') {
    return 47 + 26 + 26 + 16;
  }

  // ENTITY node: header (~47px) + each action row (~26px) + body padding (16px)
  const actionCount = data.actions?.length || 0;
  return 47 + actionCount * 26 + 16;
}
