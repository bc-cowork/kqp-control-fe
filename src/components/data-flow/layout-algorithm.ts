import type { Edge } from '@xyflow/react';

import { X_GAP, RECV_NODE_WIDTH, ENTITY_NODE_WIDTH } from './constants';

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

  // Build reverse edge map: child → parent(s)
  const parentOf = new Map<string, string>();
  edges.forEach((e) => {
    if (!parentOf.has(e.target)) {
      parentOf.set(e.target, e.source);
    }
  });

  // ---- PHASE 1: Compute X offsets for each level ----
  const levelX = new Map<number, number>();
  let xOffset = 40;
  sortedLevels.forEach((level) => {
    levelX.set(level, xOffset);
    const levelNodes = nodesByLevel.get(level)!;
    let maxWidth = 0;
    levelNodes.forEach((node) => {
      const w = getNodeWidth(node);
      if (w > maxWidth) maxWidth = w;
    });
    xOffset += maxWidth + X_GAP;
  });

  // ---- PHASE 2: Layout column 2+ first (single vertical column, parent-ordered) ----
  sortedLevels.forEach((level) => {
    if (level < 2) return;
    const levelNodes = nodesByLevel.get(level)!;
    const baseX = levelX.get(level) || 0;
    const GROUP_GAP = 80; // gap between groups from different parents
    const INNER_GAP = 40; // gap between siblings in same group

    const groups = new Map<string, DataFlowNodeInstance[]>();
    const orphans: DataFlowNodeInstance[] = [];

    levelNodes.forEach((node) => {
      const parent = parentOf.get(node.id);
      if (parent) {
        if (!groups.has(parent)) groups.set(parent, []);
        groups.get(parent)!.push(node);
      } else {
        orphans.push(node);
      }
    });

    // Sort groups by definition order
    const sortedParents = Array.from(groups.keys());

    // Build edge target order map: for each source, the order targets appear in edges
    const targetOrder = new Map<string, Map<string, number>>();
    edges.forEach((e) => {
      if (!targetOrder.has(e.source)) targetOrder.set(e.source, new Map());
      const orderMap = targetOrder.get(e.source)!;
      if (!orderMap.has(e.target)) orderMap.set(e.target, orderMap.size);
    });

    let nextY = TOP_Y;

    sortedParents.forEach((parentId, gIdx) => {
      const group = groups.get(parentId)!;

      // Sort children by the order they appear in parent's edges (route action order)
      // This ensures top-to-bottom child order matches top-to-bottom source handle order
      const orderMap = targetOrder.get(parentId);
      if (orderMap) {
        group.sort((a, b) => (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999));
      }

      // Add group gap between groups (not before first)
      if (gIdx > 0) nextY += GROUP_GAP;

      group.forEach((node) => {
        node.position = { x: baseX, y: nextY };
        nextY += estimateNodeHeight(node) + INNER_GAP;
      });

      // Remove trailing inner gap
      nextY -= INNER_GAP;
    });

    orphans.forEach((node) => {
      nextY += GROUP_GAP;
      node.position = { x: baseX, y: nextY };
      nextY += estimateNodeHeight(node);
    });

    levelNodes.forEach((node) => {
      node.draggable = true;
    });
  });

  // ---- PHASE 3: Position column 1 (entity PMR) — distribute across col 2+ vertical range ----
  // Find total vertical extent of col 2+ nodes
  let col2MinY = Infinity;
  let col2MaxBottom = -Infinity;
  sortedLevels.forEach((level) => {
    if (level < 2) return;
    (nodesByLevel.get(level) || []).forEach((node) => {
      const ny = node.position?.y || 0;
      const nb = ny + estimateNodeHeight(node);
      if (ny < col2MinY) col2MinY = ny;
      if (nb > col2MaxBottom) col2MaxBottom = nb;
    });
  });

  const level1Nodes = nodesByLevel.get(1) || [];
  const level1X = levelX.get(1) || 0;

  // Each col-1 node centers on its children's vertical midpoint.
  // Nodes are placed in child-center order, with enough gap so they
  // span the full vertical range of col 2+.
  // First, compute each node's ideal Y (center on children)
  const l1Ideals: { node: DataFlowNodeInstance; idealY: number }[] = [];

  level1Nodes.forEach((node) => {
    const children = (outgoing.get(node.id) || [])
      .map((cid) => nodes.find((n) => n.id === cid))
      .filter((n): n is DataFlowNodeInstance => !!n && (levels.get(n.id) || 0) >= 2);

    let idealY = TOP_Y;
    if (children.length > 0) {
      let minChildY = Infinity;
      let maxChildBottom = -Infinity;
      children.forEach((child) => {
        const cy = child.position?.y || 0;
        const cb = cy + estimateNodeHeight(child);
        if (cy < minChildY) minChildY = cy;
        if (cb > maxChildBottom) maxChildBottom = cb;
      });
      const childrenCenterY = (minChildY + maxChildBottom) / 2;
      idealY = childrenCenterY - estimateNodeHeight(node) / 2;
    }

    l1Ideals.push({ node, idealY });
  });

  // Place them in order, ensuring no overlap
  let nextY1 = TOP_Y;
  l1Ideals.forEach(({ node, idealY }) => {
    const y = Math.max(nextY1, idealY);
    node.position = { x: level1X, y };
    node.draggable = false;
    nextY1 = y + estimateNodeHeight(node) + 60;
  });

  // ---- PHASE 4: Position column 0 (recv) — center each on its connected entity ----
  const level0Nodes = nodesByLevel.get(0) || [];
  const level0X = levelX.get(0) || 0;
  let nextY0 = TOP_Y;

  level0Nodes.forEach((node) => {
    const connectedEntities = (outgoing.get(node.id) || [])
      .map((cid) => nodes.find((n) => n.id === cid))
      .filter((n): n is DataFlowNodeInstance => !!n);

    let idealY = nextY0;
    if (connectedEntities.length > 0) {
      const entity = connectedEntities[0];
      const entityY = entity.position?.y || 0;
      const entityCenterY = entityY + estimateNodeHeight(entity) / 2;
      idealY = entityCenterY - estimateNodeHeight(node) / 2;
    }

    const y = Math.max(nextY0, idealY);
    node.position = { x: level0X, y };
    node.draggable = false;
    nextY0 = y + estimateNodeHeight(node) + 40;
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
