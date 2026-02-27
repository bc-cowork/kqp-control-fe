import type { Edge } from '@xyflow/react';

import { X_GAP, Y_GAP, NODE_WIDTHS } from './constants';

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

  // Sort within levels by type priority
  const typePriority: Record<string, number> = {
    recv: 0,
    entity: 1,
    route: 2,
    log: 3,
    emit: 4,
  };

  nodesByLevel.forEach((levelNodes) => {
    levelNodes.sort((a, b) => {
      const aType = (a.data as DataFlowNodeData).nodeType;
      const bType = (b.data as DataFlowNodeData).nodeType;
      return (typePriority[aType] || 99) - (typePriority[bType] || 99);
    });
  });

  // Assign positions (left-to-right flow)
  let xOffset = 40;
  const sortedLevels = Array.from(nodesByLevel.keys()).sort((a, b) => a - b);

  sortedLevels.forEach((level) => {
    const levelNodes = nodesByLevel.get(level)!;
    let maxWidth = 0;
    let yOffset = 60;

    levelNodes.forEach((node) => {
      const {nodeType} = (node.data as DataFlowNodeData);
      const width = NODE_WIDTHS[nodeType] || 333;

      node.position = { x: xOffset, y: yOffset };

      // Estimate node height based on type and content
      const height = estimateNodeHeight(node);
      yOffset += height + Y_GAP;
      maxWidth = Math.max(maxWidth, width);
    });

    xOffset += maxWidth + X_GAP;
  });

  return [...nodes];
}

// ----------------------------------------------------------------------

function estimateNodeHeight(node: DataFlowNodeInstance): number {
  const data = node.data as DataFlowNodeData;

  switch (data.nodeType) {
    case 'emit':
      return 47;
    case 'log':
      return data.desc ? 100 : 60;
    case 'recv': {
      const channelText = data.channels?.join(', ') || '';
      const lines = Math.ceil(channelText.length / 30);
      return 55 + lines * 24;
    }
    case 'entity':
    case 'route': {
      const actionCount = data.actions?.length || 0;
      const hasDesc = data.desc ? 1 : 0;
      return 55 + hasDesc * 30 + actionCount * 26 + 16;
    }
    default:
      return 80;
  }
}
