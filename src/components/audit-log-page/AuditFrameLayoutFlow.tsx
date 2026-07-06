'use client';

import '@xyflow/react/dist/style.css';

import type { DataFlowDefinition } from 'src/components/data-flow';
import type { LayoutFlow } from 'src/types/api';

import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
} from '@xyflow/react';

import { Box } from '@mui/material';

import { DataFlowNode } from 'src/components/data-flow/nodes/DataFlowNode';
import { buildDataFlowGraph } from 'src/components/data-flow/graph-builder';
import { CANVAS_BG, HEADER_BG, GRID_LINE_COLOR } from 'src/components/data-flow/constants';
import { computeDataFlowLayout } from 'src/components/data-flow/layout-algorithm';

// ----------------------------------------------------------------------

type Props = {
  layoutFlow?: LayoutFlow;
};

// Read-only embed height — the full DataFlowCanvas (800px + toolbar) is too tall here.
const CANVAS_HEIGHT = 360;

// Routing actions whose target should become an edge to another layout node.
const ROUTING_ACTS = new Set(['route', 'kpass']);

const NODE_TYPES = { dataFlow_node: DataFlowNode };

/**
 * Convert the frame's `layoutFlow.layout_subset` into the `DataFlowDefinition`
 * shape consumed by the shared data-flow graph (same node renderer/builder as
 * the layout screen). `topics.inbound[].args` maps to `actions[].param`, and
 * routing actions whose target exists in the subset become graph relations.
 */
function buildDefinition(layoutFlow: LayoutFlow): DataFlowDefinition {
  const subset = layoutFlow.layout_subset || {};
  const relations: Record<string, { to: string[] }> = {};
  const definition: DataFlowDefinition = { relations };

  Object.entries(subset).forEach(([name, entity]) => {
    const actions = (entity.topics?.inbound ?? []).map((action) => ({
      act: action.act,
      param: action.args ?? {},
    }));

    definition[name] = {
      desc: entity.desc,
      recv2r: entity.recv2r,
      actions,
    };

    const targets = actions
      .filter((action) => ROUTING_ACTS.has(action.act))
      .map((action) => action.param?.to)
      .filter((to): to is string => typeof to === 'string' && Boolean(subset[to]));

    if (targets.length) {
      relations[name] = { to: targets };
    }
  });

  return definition;
}

// Read-only graph — reuses the shared builder/layout/node, no toolbar.
function FlowGraph({ definition }: { definition: DataFlowDefinition }) {
  const { nodes, edges } = useMemo(() => {
    const built = buildDataFlowGraph(definition);
    return { nodes: computeDataFlowLayout(built.nodes, built.edges), edges: built.edges };
  }, [definition]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={NODE_TYPES}
      defaultViewport={{ x: 24, y: 24, zoom: 0.7 }}
      minZoom={0.2}
      maxZoom={2}
      proOptions={{ hideAttribution: true }}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      zoomOnScroll={false}
      panOnScroll={false}
      preventScrolling={false}
      zoomOnPinch
      panOnDrag
      defaultEdgeOptions={{ type: 'smoothstep' }}
    >
      <Background variant={BackgroundVariant.Lines} gap={50} lineWidth={0.5} color={GRID_LINE_COLOR} />
    </ReactFlow>
  );
}

export function AuditFrameLayoutFlow({ layoutFlow }: Props) {
  const definition = useMemo(
    () => (layoutFlow ? buildDefinition(layoutFlow) : null),
    [layoutFlow]
  );

  if (!layoutFlow || !definition) {
    return null;
  }

  return (
    <Box
      sx={{
        mt: 2,
        width: '100%',
        height: CANVAS_HEIGHT,
        flexShrink: 0,
        display: 'flex',
        overflow: 'hidden',
        flexDirection: 'column',
        borderRadius: '12px',
        border: '1.2px solid #667085',
        backgroundColor: CANVAS_BG,
      }}
    >
      {/* Empty header strip — keeps the gradient separator line from the original
          toolbar while omitting the Preview / Data Flow / file-name controls. */}
      <Box
        sx={{
          height: 44,
          flexShrink: 0,
          backgroundColor: HEADER_BG,
          borderBottom: '1px solid',
          borderImage: `linear-gradient(to right, rgba(55, 63, 78, 0.00), rgb(170, 170, 170) 50%, rgba(55, 63, 78, 0.00)) 1`,
        }}
      />

      <Box sx={{ flex: 1, position: 'relative' }}>
        <ReactFlowProvider>
          <FlowGraph definition={definition} />
        </ReactFlowProvider>
      </Box>
    </Box>
  );
}
