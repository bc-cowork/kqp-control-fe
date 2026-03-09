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

  const sortedLevels = Array.from(nodesByLevel.keys()).sort((a, b) => a - b);
  const TOP_Y = 80;

  // Assign positions (left-to-right flow)
  // Each node is placed using its own actual height + a fixed Y_GAP,
  // so the visible gap between the bottom of one node and the top of the next is always equal.
  let xOffset = 40;

  sortedLevels.forEach((level) => {
    const levelNodes = nodesByLevel.get(level)!;

    let yOffset = TOP_Y;
    let maxWidth = 0;

    levelNodes.forEach((node) => {
      node.position = { x: xOffset, y: yOffset };
      const width = getNodeWidth(node);
      if (width > maxWidth) maxWidth = width;
      yOffset += estimateNodeHeight(node) + Y_GAP;

      // Fix position for recv (depth 0) and 1-depth PMR nodes
      node.draggable = level >= 2;
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

  // RECV node: header (~47px) + channel text (wraps) + count line (~22.5px) + body padding (16px)
  if (data.nodeType === 'recv') {
    const HEADER = 47;
    const BODY_PAD = 16; // py:1 = 8px top + 8px bottom
    const LINE_H = 22.5;
    const COUNT_LINE = LINE_H; // "N channels"

    // Estimate how many lines the channel list text wraps to.
    // Body has px:1.5 = 12px each side, so text width = RECV_NODE_WIDTH - 24
    const textWidth = RECV_NODE_WIDTH - 24;
    const channelText = (data.channels || []).join(', ');
    // At font-size 15px Roboto, average char width is ~8px
    const charWidth = 8;
    const textLines = Math.max(1, Math.ceil((channelText.length * charWidth) / textWidth));

    return HEADER + textLines * LINE_H + COUNT_LINE + BODY_PAD;
  }

  // ENTITY node: header (~47px) + each action row (~26px) + body padding (16px)
  const actionCount = data.actions?.length || 0;
  return 47 + actionCount * 26 + 16;
}
