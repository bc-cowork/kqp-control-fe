'use client';

import '@xyflow/react/dist/style.css';

import type { Edge } from '@xyflow/react';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import {
  Panel,
  ReactFlow,
  Background,
  useReactFlow,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  ReactFlowProvider,
  useNodesInitialized,
} from '@xyflow/react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { T } from 'src/theme/tokens';
import { useTranslate } from 'src/locales';

import { getViewportScale } from 'src/components/viewport-zoom';

import { DataFlowToolbar } from './DataFlowToolbar';
import { DataFlowNode } from './nodes/DataFlowNode';
import { buildDataFlowGraph } from './graph-builder';
import { computeDataFlowLayout } from './layout-algorithm';
import { GRID_LINE_COLOR, HELP_TEXT_COLOR } from './constants';

import type { DataFlowDefinition, DataFlowNodeInstance } from './types';

// ----------------------------------------------------------------------

type DataFlowCanvasProps = {
  definition: DataFlowDefinition;
  fileName: string;
};

function DataFlowCanvasInner({ definition, fileName }: DataFlowCanvasProps) {
  const { t } = useTranslate('data-flow');
  const containerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { fitView, zoomTo, getZoom } = useReactFlow();
  const nodesInitialized = useNodesInitialized();
  const [zoom, setZoom] = useState(95);

  // The app applies a root CSS `zoom` (<html>) to fit smaller viewports. React
  // Flow can't see that zoom, so it mis-measures handle/edge geometry and the
  // edges drift off the connection dots — worse the smaller the screen (zoom
  // further from 1). We counteract it by applying the inverse `zoom` on the
  // canvas pane so React Flow renders at an effective root zoom of 1.
  const [docScale, setDocScale] = useState(1);
  useEffect(() => {
    const update = () => setDocScale(getViewportScale());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Zoom % follows a clean 5-step sequence (…, 90, 95, 100, …), clamped to the
  // ReactFlow min/max zoom (0.1–2 ⇒ 10–200%).
  const stepZoom = useCallback(
    (dir: 1 | -1) => {
      const snapped = Math.round((getZoom() * 100) / 5) * 5;
      const next = Math.min(200, Math.max(10, snapped + dir * 5));
      zoomTo(next / 100, { duration: 200 });
      setZoom(next);
    },
    [getZoom, zoomTo]
  );

  const nodeTypes = useMemo(
    () => ({
      dataFlow_node: DataFlowNode,
    }),
    []
  );

  // Build and layout graph
  const initialGraph = useMemo(() => {
    const { nodes, edges } = buildDataFlowGraph(definition);
    const laidOut = computeDataFlowLayout(nodes, edges);
    return { nodes: laidOut, edges };
  }, [definition]);

  const [nodes, setNodes, onNodesChange] = useNodesState<DataFlowNodeInstance>(initialGraph.nodes);

  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialGraph.edges);

  // Sync nodes/edges when definition changes
  useEffect(() => {
    setNodes(initialGraph.nodes);
    setEdges(initialGraph.edges);
  }, [initialGraph, setNodes, setEdges]);

  // Center the graph once custom nodes are measured — the ReactFlow `fitView`
  // prop runs before dynamic-height nodes are sized, so it mis-centers on load.
  // Force zoom to 95% (min=max) so we start centred on the graph's middle,
  // showing only part of it rather than the whole (which would shrink to ~25%).
  //
  // The counter-zoom decouples React Flow from the root zoom (so edges stay
  // aligned), which also means the graph would NOT shrink with the responsive
  // layout. Fold docScale into the graph's zoom so it scales down in step with
  // the rest of the app (and re-fit when the viewport scale changes).
  useEffect(() => {
    if (!nodesInitialized) return;
    const z = 0.95 * docScale;
    fitView({ padding: 0.08, minZoom: z, maxZoom: z });
    setZoom(Math.round((z * 100) / 5) * 5);
  }, [nodesInitialized, fitView, docScale]);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);

    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  // Track zoom % (snapped to the nearest 5-step)
  const handleViewportChange = useCallback(() => {
    setZoom(Math.round((getZoom() * 100) / 5) * 5);
  }, [getZoom]);

  // Track hover so keyboard shortcuts only fire over the canvas
  useEffect(() => {
    const el = containerRef.current;
    const onEnter = () => {
      isHoveredRef.current = true;
    };
    const onLeave = () => {
      isHoveredRef.current = false;
    };
    if (el) {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    }
    return () => {
      if (el) {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      }
    };
  }, []);

  // Keyboard zoom: Ctrl/Cmd + (+/=), Ctrl/Cmd + (-), Ctrl/Cmd + 0
  useEffect(() => {
    const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isHoveredRef.current) return;
      const modifier = isMac ? e.metaKey : e.ctrlKey;
      if (!modifier) return;

      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        stepZoom(1);
      } else if (e.key === '-') {
        e.preventDefault();
        stepZoom(-1);
      } else if (e.key === '0') {
        e.preventDefault();
        fitView({ padding: 0.05, duration: 300 });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [stepZoom, fitView]);

  return (
    <Box
      ref={containerRef}
      sx={{
        borderRadius: '8px',
        overflow: 'hidden',
        border: `1px solid ${T.border}`,
        backgroundColor: T.bgCard,
        height: isFullscreen ? '100vh' : 820,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <DataFlowToolbar fileName={fileName} />

      <Box sx={{ flex: 1, position: 'relative' }}>
        <Box
          // `zoom` (React inline style, unitless) — inverse of the root zoom so
          // React Flow sees an effective root zoom of 1. Width/height are scaled
          // by docScale so this layer still fills the pane on screen.
          style={{ zoom: 1 / docScale }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            minZoom={0.1}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
            nodesDraggable
            nodesConnectable={false}
            elementsSelectable={false}
            onInit={handleViewportChange}
            onMoveEnd={handleViewportChange}
            defaultEdgeOptions={{ type: 'smoothstep' }}
            zoomOnScroll={false}
            panOnScroll
            preventScrolling
            zoomOnPinch
            panOnDrag
          >
            <Background
              variant={BackgroundVariant.Lines}
              gap={50}
              lineWidth={1}
              color={GRID_LINE_COLOR}
            />

            {/* Help text — the counter-zoom decouples this panel from the root
                zoom, so scale the font by docScale to keep it in step with the
                responsive layout. */}
            <Panel position="top-left">
              <Typography
                sx={{
                  color: HELP_TEXT_COLOR,
                  fontSize: 17 * docScale,
                  fontFamily: "'Spoqa Han Sans Neo'",
                  fontWeight: 400,
                }}
              >
                {t('canvas.zoom_help')}
              </Typography>
            </Panel>

            {/* Zoom Controls */}
            <Panel position="top-right">
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: T.bgCard,
                  border: `1px solid ${T.border}`,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  userSelect: 'none',
                }}
              >
                <Box
                  onClick={() => stepZoom(1)}
                  sx={{
                    width: 30,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: T.textSec,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: T.bgHover, color: T.textPrim },
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.99902 2C8.29353 2 8.53313 2.23871 8.5332 2.5332V7.4668H13.4668C13.7612 7.46687 13.9999 7.70555 14 8C14 8.29451 13.7613 8.53313 13.4668 8.5332H8.5332V13.4668C8.5332 13.7613 8.29358 14 7.99902 14C7.70468 13.9998 7.46582 13.7612 7.46582 13.4668V8.5332H2.5332C2.23871 8.53313 2 8.29451 2 8C2.00007 7.70555 2.23875 7.46687 2.5332 7.4668H7.46582V2.5332C7.46589 2.23886 7.70472 2.00025 7.99902 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </Box>

                <Typography
                  sx={{
                    fontSize: 13,
                    color: T.textSec,
                    fontFamily: "'Spoqa Han Sans Neo'",
                    py: '3px',
                    width: '100%',
                    textAlign: 'center',
                    borderTop: `1px solid ${T.border}`,
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  {zoom}%
                </Typography>

                <Box
                  onClick={() => stepZoom(-1)}
                  sx={{
                    width: 30,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: T.textSec,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: T.bgHover, color: T.textPrim },
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.4668 7.4668C13.7612 7.46687 13.9999 7.70555 14 8C14 8.29451 13.7613 8.53313 13.4668 8.5332H2.5332C2.23871 8.53313 2 8.29451 2 8C2.00007 7.70555 2.23875 7.46687 2.5332 7.4668H13.4668Z"
                      fill="currentColor"
                    />
                  </svg>
                </Box>
              </Box>
            </Panel>
          </ReactFlow>
        </Box>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function DataFlowCanvas(props: DataFlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <DataFlowCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
