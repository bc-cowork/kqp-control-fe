'use client';

import '@xyflow/react/dist/style.css';

import type { LayoutFlow } from 'src/types/api';
import type { DataFlowDefinition } from 'src/components/data-flow';

import { useMemo, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  useReactFlow,
  useEdgesState,
  useNodesState,
  BackgroundVariant,
  ReactFlowProvider,
  useNodesInitialized,
} from '@xyflow/react';

import { Box, Dialog, IconButton } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { T } from 'src/theme/tokens';

import { Iconify } from 'src/components/iconify';
import { getViewportScale } from 'src/components/viewport-zoom';
import { DataFlowNode } from 'src/components/data-flow/nodes/DataFlowNode';
import { buildDataFlowGraph } from 'src/components/data-flow/graph-builder';
import { computeDataFlowLayout } from 'src/components/data-flow/layout-algorithm';
import { CANVAS_BG, HEADER_BG, GRID_LINE_COLOR } from 'src/components/data-flow/constants';

// ----------------------------------------------------------------------

type Props = {
  layoutFlow?: LayoutFlow;
  /** Compact square that opens the graph in a large popup on click. */
  square?: boolean;
};

// Read-only embed height — the full DataFlowCanvas (800px + toolbar) is too tall here.
const CANVAS_HEIGHT = 360;

// Locked graph zoom — matches the layout-detail data-flow node box size (that
// screen renders nodes at 0.95, page-relative, via fitView). Folded together
// with docScale + the counter-zoom wrapper below (same as DataFlowCanvas) so the
// box size stays constant while the graph scales with the viewport.
// FIT_PADDING mirrors the layout-detail fitView padding.
const NODE_ZOOM = 0.95;
const FIT_PADDING = 0.08;

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
  const { fitView } = useReactFlow();
  const nodesInitialized = useNodesInitialized();

  const initialGraph = useMemo(() => {
    const built = buildDataFlowGraph(definition);
    return { nodes: computeDataFlowLayout(built.nodes, built.edges), edges: built.edges };
  }, [definition]);

  // Controlled node/edge state with change handlers wired. React Flow needs
  // onNodesChange to write measured node dimensions back so `useNodesInitialized`
  // flips true — without it fitView can't compute the graph bounds and silently
  // no-ops (same state wiring as the layout-detail DataFlowCanvas).
  const [nodes, setNodes, onNodesChange] = useNodesState(initialGraph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialGraph.edges);

  useEffect(() => {
    setNodes(initialGraph.nodes);
    setEdges(initialGraph.edges);
  }, [initialGraph, setNodes, setEdges]);

  // Track the root viewport scale — the <html> element carries `zoom: docScale`
  // (viewport-zoom). React Flow ignores an ancestor CSS `zoom` when measuring
  // handles/edges, so we counter-zoom the wrapper by 1/docScale to keep edges
  // aligned, then fold docScale back into the fit zoom — mirroring the
  // layout-detail DataFlowCanvas so the graph scales with the rest of the app.
  const [docScale, setDocScale] = useState(1);
  useEffect(() => {
    const update = () => setDocScale(getViewportScale());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Center once custom nodes are measured (fitView on first paint runs before the
  // dynamic-height nodes are sized, so it mis-centers on load) and re-center
  // whenever the graph or the viewport scale changes. Lock zoom to
  // NODE_ZOOM * docScale so the node box size matches the layout-detail
  // data-flow at every screen size.
  useEffect(() => {
    if (!nodesInitialized) return;
    const z = NODE_ZOOM * docScale;
    fitView({ padding: FIT_PADDING, minZoom: z, maxZoom: z });
  }, [nodesInitialized, fitView, docScale, nodes]);

  return (
    <Box
      // Inverse of the root `zoom` so React Flow sees an effective root zoom of 1
      // (keeps handle/edge measurement accurate); docScale is folded into the fit
      // zoom above so the graph still scales down with the viewport.
      style={{ zoom: 1 / docScale }}
      sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: FIT_PADDING, minZoom: NODE_ZOOM, maxZoom: NODE_ZOOM }}
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
        <Background
          variant={BackgroundVariant.Lines}
          gap={50}
          lineWidth={0.5}
          color={GRID_LINE_COLOR}
        />
      </ReactFlow>
    </Box>
  );
}

// Card shell (empty header strip + graph) that fills its parent.
function GraphCard({ definition }: { definition: DataFlowDefinition }) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
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

export function AuditFrameLayoutFlow({ layoutFlow, square }: Props) {
  const definition = useMemo(() => (layoutFlow ? buildDefinition(layoutFlow) : null), [layoutFlow]);
  const modal = useBoolean();

  if (!layoutFlow || !definition) {
    return null;
  }

  // Compact square — click to open a large popup.
  if (square) {
    return (
      <>
        <Box
          onClick={modal.onTrue}
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1 / 1',
            flexShrink: 0,
            cursor: 'pointer',
          }}
        >
          <GraphCard definition={definition} />
          <Box
            className="df-expand"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              p: '4px',
              borderRadius: '6px',
              bgcolor: 'rgba(30,27,39,0.8)',
              color: T.textSec,
              pointerEvents: 'none',
            }}
          >
            <Iconify icon="eva:expand-fill" width={16} />
          </Box>
        </Box>

        <Dialog
          open={modal.value}
          onClose={modal.onFalse}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: { height: '82vh', bgcolor: CANVAS_BG, borderRadius: '12px', overflow: 'hidden' },
          }}
        >
          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <GraphCard definition={definition} />
            <IconButton
              onClick={modal.onFalse}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 2,
                color: T.textSec,
                '&:hover': { color: T.textPrim },
              }}
            >
              <Iconify icon="eva:close-fill" width={20} />
            </IconButton>
          </Box>
        </Dialog>
      </>
    );
  }

  // Default — full-width, fixed height.
  return (
    <Box sx={{ mt: 2, width: '100%', height: CANVAS_HEIGHT, flexShrink: 0 }}>
      <GraphCard definition={definition} />
    </Box>
  );
}
