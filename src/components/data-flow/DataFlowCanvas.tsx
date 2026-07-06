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
} from '@xyflow/react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { T, FONT_MONO } from 'src/theme/tokens';

import { DataFlowToolbar } from './DataFlowToolbar';
import { DataFlowNode } from './nodes/DataFlowNode';
import { buildDataFlowGraph } from './graph-builder';
import { computeDataFlowLayout } from './layout-algorithm';
import { CANVAS_BG, GRID_LINE_COLOR, HELP_TEXT_COLOR } from './constants';

import type { DataFlowDefinition, DataFlowNodeInstance } from './types';

// ----------------------------------------------------------------------

type DataFlowCanvasProps = {
  definition: DataFlowDefinition;
  fileName: string;
  onTestEnvClick?: () => void;
};

function DataFlowCanvasInner({ definition, fileName, onTestEnvClick }: DataFlowCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { fitView, zoomIn, zoomOut, getZoom } = useReactFlow();
  const [zoom, setZoom] = useState(70);

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

  const [nodes, setNodes, onNodesChange] =
    useNodesState<DataFlowNodeInstance>(initialGraph.nodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState<Edge>(initialGraph.edges);

  // Sync nodes/edges when definition changes
  useEffect(() => {
    setNodes(initialGraph.nodes);
    setEdges(initialGraph.edges);
  }, [initialGraph, setNodes, setEdges]);

  useEffect(() => {
    const handleChange = () =>
      setIsFullscreen(!!document.fullscreenElement);

    document.addEventListener('fullscreenchange', handleChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  // Track zoom %
  const handleViewportChange = useCallback(() => {
    setZoom(Math.round(getZoom() * 100));
  }, [getZoom]);

  // Ctrl + Wheel Zoom Only
  useEffect(() => {
    const el = containerRef.current;

    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();
      if (e.deltaY < 0) zoomIn({ duration: 150 });
      else zoomOut({ duration: 150 });
    };

    if (el) el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      if (el) el.removeEventListener('wheel', handleWheel);
    };
  }, [zoomIn, zoomOut]);

  // Track hover so keyboard shortcuts only fire over the canvas
  useEffect(() => {
    const el = containerRef.current;
    const onEnter = () => { isHoveredRef.current = true; };
    const onLeave = () => { isHoveredRef.current = false; };
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
        zoomIn({ duration: 200 });
      } else if (e.key === '-') {
        e.preventDefault();
        zoomOut({ duration: 200 });
      } else if (e.key === '0') {
        e.preventDefault();
        fitView({ padding: 0.05, duration: 300 });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut, fitView]);

  return (
    <Box
      ref={containerRef}
      sx={{
        borderRadius: '8px',
        overflow: 'hidden',
        border: `1px solid ${T.border}`,
        backgroundColor: CANVAS_BG,
        height: isFullscreen ? '100vh' : 820,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <DataFlowToolbar fileName={fileName} onTestEnvClick={onTestEnvClick} />

      <Box sx={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
          minZoom={0.1}
          maxZoom={2}
          fitViewOptions={{ padding: 0.08, maxZoom: 0.7 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable={false}
          onMoveEnd={handleViewportChange}
          defaultEdgeOptions={{ type: 'smoothstep' }}

          zoomOnScroll={false}
          panOnScroll={false}
          preventScrolling={false}
          zoomOnPinch
          panOnDrag
        >
          <Background
            variant={BackgroundVariant.Lines}
            gap={50}
            lineWidth={1}
            color={GRID_LINE_COLOR}
          />

          {/* Help text */}
          <Panel position="top-left">
            <Typography
              sx={{
                color: HELP_TEXT_COLOR,
                opacity: 0.65,
                fontSize: 14,
                fontFamily: FONT_MONO,
                fontWeight: 400,
              }}
            >
              ctrl + (+/=) for zoom in and ctrl + (-) for zoom out and ctrl + (0) for reset.
            </Typography>
          </Panel>

          {/* Zoom Controls */}
          <Panel position="bottom-right">
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: T.bgCard,
                border: `1px solid ${T.border}`,
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <Box
                onClick={() => zoomIn({ duration: 200 })}
                sx={{
                  width: 30,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 17,
                  color: T.textSec,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: T.bgHover, color: T.textPrim },
                }}
              >
                +
              </Box>

              <Typography
                sx={{
                  fontSize: 13,
                  color: T.textSec,
                  fontFamily: FONT_MONO,
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
                onClick={() => zoomOut({ duration: 200 })}
                sx={{
                  width: 30,
                  height: 28,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 17,
                  color: T.textSec,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: T.bgHover, color: T.textPrim },
                }}
              >
                −
              </Box>
            </Box>
          </Panel>
        </ReactFlow>
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