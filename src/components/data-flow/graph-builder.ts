import type { Edge } from '@xyflow/react';

import { MarkerType } from '@xyflow/react';

import { EDGE_COLOR } from './constants';

import type { DataFlowEntityDef, DataFlowDefinition, DataFlowNodeInstance } from './types';

// ----------------------------------------------------------------------

export function buildDataFlowGraph(definition: DataFlowDefinition): {
  nodes: DataFlowNodeInstance[];
  edges: Edge[];
} {
  const nodes: DataFlowNodeInstance[] = [];
  const edges: Edge[] = [];

  // Collect entity entries (everything except "relations")
  const entityEntries = Object.entries(definition).filter(([key]) => key !== 'relations');

  entityEntries.forEach(([name, value]) => {
    const entity = value as DataFlowEntityDef;
    nodes.push({
      id: name,
      type: 'dataFlow_node',
      position: { x: 0, y: 0 },
      data: {
        label: name,
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
          type: 'smoothstep',
          style: { stroke: EDGE_COLOR, strokeWidth: 1.5 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: EDGE_COLOR,
            width: 16,
            height: 16,
          },
        });
      });
    });
  }

  return { nodes, edges };
}
