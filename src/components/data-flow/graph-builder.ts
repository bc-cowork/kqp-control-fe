import type { Edge } from '@xyflow/react';

import { EDGE_COLOR } from './constants';

import type { DataFlowEntityDef, DataFlowDefinition, DataFlowNodeInstance } from './types';

// ----------------------------------------------------------------------

export function buildDataFlowGraph(definition: DataFlowDefinition): {
  nodes: DataFlowNodeInstance[];
  edges: Edge[];
} {
  const nodes: DataFlowNodeInstance[] = [];
  const edges: Edge[] = [];

  const edgeDefaults = {
    type: 'default' as const,
    style: { stroke: EDGE_COLOR, strokeWidth: 2 },
  };

  // Collect entity entries (everything except "relations")
  const entityEntries = Object.entries(definition).filter(([key]) => key !== 'relations');

  entityEntries.forEach(([name, value]) => {
    const entity = value as DataFlowEntityDef;

    // If entity has recv2r channels, create a dedicated RECV node and connect it
    if (entity.recv2r && entity.recv2r.length > 0) {
      const recvId = `recv_${name}`;
      nodes.push({
        id: recvId,
        type: 'dataFlow_node',
        position: { x: 0, y: 0 },
        data: {
          label: '수신 채널',
          nodeType: 'recv',
          channels: entity.recv2r,
        },
      });

      edges.push({
        id: `e-recv-${name}`,
        source: recvId,
        target: name,
        ...edgeDefaults,
      });
    }

    // Create the main ENTITY node
    nodes.push({
      id: name,
      type: 'dataFlow_node',
      position: { x: 0, y: 0 },
      data: {
        label: name,
        nodeType: 'entity',
        actions: entity.actions || [],
      },
    });
  });

  // Build edges from relations
  const { relations } = definition;
  if (relations) {
    Object.entries(relations).forEach(([source, rel]) => {
      const targets = rel.to || [];
      targets.forEach((target, idx) => {
        edges.push({
          id: `e-${source}-${target}-${idx}`,
          source,
          target,
          ...edgeDefaults,
        });
      });
    });
  }

  return { nodes, edges };
}
