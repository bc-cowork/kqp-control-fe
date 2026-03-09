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
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DataFlowToolbar } from './DataFlowToolbar';
import { DataFlowNode } from './nodes/DataFlowNode';
import { buildDataFlowGraph } from './graph-builder';
import { CANVAS_BG, GRID_LINE_COLOR, HELP_TEXT_COLOR } from './constants';
import { computeDataFlowLayout } from './layout-algorithm';

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
  const [zoom, setZoom] = useState(100);

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

  // Auto Layout
  const handleAutoLayout = useCallback(() => {
    const laidOut = computeDataFlowLayout([...nodes], edges);
    setNodes(laidOut);
    setTimeout(() => fitView({ padding: 0.3, duration: 300 }), 50);
  }, [nodes, edges, setNodes, fitView]);

  // Fit View
  const handleFitView = useCallback(() => {
    fitView({ padding: 0.3, duration: 300 });
  }, [fitView]);

  // Export
  const handleExport = useCallback(async () => {
    const flowViewport = containerRef.current?.querySelector(
      '.react-flow__viewport'
    ) as HTMLElement;

    if (!flowViewport) return;

    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(flowViewport, {
        backgroundColor: CANVAS_BG,
        quality: 1,
      });

      const link = document.createElement('a');
      link.download = `${fileName || 'data-flow'}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      // silent fail
    }
  }, [fileName]);

  // Fullscreen
  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

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
        fitView({ padding: 0.3, duration: 300 });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [zoomIn, zoomOut, fitView]);

  return (
    <Box
      ref={containerRef}
      sx={{
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1.2px solid #667085',
        backgroundColor: CANVAS_BG,
        height: isFullscreen ? '100vh' : 800,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <DataFlowToolbar
        fileName={fileName}
        onAutoLayout={handleAutoLayout}
        onFitView={handleFitView}
        onExport={handleExport}
        onFullscreen={handleFullscreen}
        isFullscreen={isFullscreen}
        onTestEnvClick={onTestEnvClick}
      />

      <Box sx={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
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
            lineWidth={0.5}
            color={GRID_LINE_COLOR}
          />

          {/* Help text */}
          <Panel position="top-left">
            <Typography
              sx={{
                color: HELP_TEXT_COLOR,
                fontSize: 15,
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                lineHeight: '22.5px',
              }}
            >
              ctrl + (+/=) for zoom in and ctrl + (-) for zoom out and ctrl + (0) for reset.
            </Typography>
          </Panel>

          {/* Zoom Controls */}
          <Panel position="bottom-right">
            <Stack spacing={0.5} alignItems="center">
              <Box
                onClick={() => zoomIn({ duration: 200 })}
                sx={{
                  width: 40,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#373F4E',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#4E576A' },
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.999 3C12.4408 3 12.7987 3.35807 12.7988 3.7998V11.2002H20.2002C20.6419 11.2003 20.9999 11.5583 21 12C21 12.4418 20.6419 12.7997 20.2002 12.7998H12.7988V20.2002C12.7988 20.642 12.4409 21 11.999 21C11.5573 20.9999 11.1992 20.642 11.1992 20.2002V12.7998H3.7998C3.35807 12.7997 3 12.4418 3 12C3.00011 11.5583 3.35813 11.2003 3.7998 11.2002H11.1992V3.7998C11.1993 3.35813 11.5574 3.00011 11.999 3Z" fill="white" />
                </svg>

              </Box>

              <Typography sx={{ fontSize: 12, color: 'white', fontWeight: 400 }}>
                {zoom}%
              </Typography>

              <Box
                onClick={() => zoomOut({ duration: 200 })}
                sx={{
                  width: 40,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#373F4E',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#4E576A' },
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.2002 11.2002C20.6419 11.2003 20.9999 11.5583 21 12C21 12.4418 20.6419 12.7997 20.2002 12.7998H3.7998C3.35807 12.7997 3 12.4418 3 12C3.00011 11.5583 3.35813 11.2003 3.7998 11.2002H20.2002Z" fill="white" />
                </svg>
              </Box>
            </Stack>
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