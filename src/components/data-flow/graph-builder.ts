import type { Edge } from '@xyflow/react';

import { MarkerType } from '@xyflow/react';

import { EDGE_COLORS } from './constants';

import type {
  DataFlowGroup,
  DataFlowEdgeType,
  DataFlowNodeType,
  DataFlowDefinition,
  DataFlowNodeInstance,
} from './types';

// ----------------------------------------------------------------------

export function buildDataFlowGraph(definition: DataFlowDefinition): {
  nodes: DataFlowNodeInstance[];
  edges: Edge[];
} {
  const allNodes: DataFlowNodeInstance[] = [];
  const allEdges: Edge[] = [];

  const groupKeys = Object.keys(definition);
  if (groupKeys.length === 0) return { nodes: allNodes, edges: allEdges };

  groupKeys.forEach((groupKey) => {
    const group = definition[groupKey];
    processGroup(group, allNodes, allEdges);
  });

  return { nodes: allNodes, edges: allEdges };
}

// ----------------------------------------------------------------------

function processGroup(
  group: DataFlowGroup,
  nodes: DataFlowNodeInstance[],
  edges: Edge[]
): void {
  const entityDefs = group.nodes || {};
  const entityNames = new Set(Object.keys(entityDefs));

  // Classify entities
  const routeEntities = new Set<string>();
  const logTargets = new Set<string>();
  const emitEntities = new Set<string>();

  Object.entries(entityDefs).forEach(([, def]) => {
    const actions = def.topics?.inbound || [];
    actions.forEach((action) => {
      if (action.act === 'route' && action.params.to && entityNames.has(action.params.to)) {
        routeEntities.add(action.params.to);
      }
      if (action.act === 'log' && action.params.to) {
        logTargets.add(action.params.to);
      }
      if (action.act === 'emit') {
        emitEntities.add('emit_terminal');
      }
    });
  });

  // Also mark entities with emit action as route type
  Object.entries(entityDefs).forEach(([name, def]) => {
    const actions = def.topics?.inbound || [];
    if (actions.some((a) => a.act === 'emit')) {
      routeEntities.add(name);
    }
  });

  // Build nodes
  const recvNodeIds: string[] = [];

  Object.entries(entityDefs).forEach(([name, def]) => {
    const isRoute = routeEntities.has(name);
    const hasRecv = def.recv2r && def.recv2r.length > 0;
    const nodeType: DataFlowNodeType = isRoute ? 'route' : 'entity';

    // Create entity/route node
    nodes.push({
      id: name,
      type: `dataFlow_${nodeType}`,
      position: { x: 0, y: 0 },
      data: {
        nodeType,
        label: `${name}${nodeType === 'entity' ? ':' : ''}`,
        desc: def.description || undefined,
        actions: def.topics?.inbound || [],
      },
    });

    // Create RECV node for entities with recv2r
    if (hasRecv && !isRoute) {
      const recvId = `recv_${name}`;
      recvNodeIds.push(recvId);
      nodes.push({
        id: recvId,
        type: 'dataFlow_recv',
        position: { x: 0, y: 0 },
        data: {
          nodeType: 'recv',
          label: '수신 채널',
          channels: def.recv2r,
          channelCount: def.recv2r!.length,
        },
      });

      // Edge: RECV -> ENTITY
      edges.push(createEdge(recvId, name, 'receive'));
    }

    // Create edges from actions
    const actions = def.topics?.inbound || [];
    actions.forEach((action, idx) => {
      if (action.act === 'route' && action.params.to && entityNames.has(action.params.to)) {
        edges.push(createEdge(name, action.params.to, 'routing', idx));
      }
      if (action.act === 'log' && action.params.to) {
        edges.push(createEdge(name, `log_${action.params.to}`, 'logging', idx));
      }
      if (action.act === 'emit') {
        edges.push(createEdge(name, 'emit_terminal', 'emit', idx));
      }
    });
  });

  // Create LOG virtual nodes
  logTargets.forEach((target) => {
    if (!entityNames.has(target)) {
      nodes.push({
        id: `log_${target}`,
        type: 'dataFlow_log',
        position: { x: 0, y: 0 },
        data: {
          nodeType: 'log',
          label: target,
        },
      });
    }
  });

  // Create EMIT virtual node
  if (emitEntities.size > 0) {
    nodes.push({
      id: 'emit_terminal',
      type: 'dataFlow_emit',
      position: { x: 0, y: 0 },
      data: {
        nodeType: 'emit',
        label: 'EMIT',
      },
    });
  }
}

// ----------------------------------------------------------------------

function createEdge(
  source: string,
  target: string,
  edgeType: DataFlowEdgeType,
  idx?: number
): Edge {
  const suffix = idx !== undefined ? `_${idx}` : '';
  return {
    id: `e-${source}-${target}${suffix}`,
    source,
    target,
    type: 'smoothstep',
    style: {
      stroke: EDGE_COLORS[edgeType],
      strokeWidth: 1.5,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: EDGE_COLORS[edgeType],
      width: 16,
      height: 16,
    },
  };
}
