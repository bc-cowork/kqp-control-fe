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
import { CANVAS_BG, GRID_LINE_COLOR } from './constants';
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

  const [nodes, setNodes, onNodesChange] = useNodesState<DataFlowNodeInstance>(initialGraph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialGraph.edges);

  // Sync nodes/edges when definition changes
  useEffect(() => {
    setNodes(initialGraph.nodes);
    setEdges(initialGraph.edges);
  }, [initialGraph, setNodes, setEdges]);

  // Auto Layout handler
  const handleAutoLayout = useCallback(() => {
    const laidOut = computeDataFlowLayout([...nodes], edges);
    setNodes(laidOut);
    setTimeout(() => fitView({ padding: 0.3, duration: 300 }), 50);
  }, [nodes, edges, setNodes, fitView]);

  // Fit View handler
  const handleFitView = useCallback(() => {
    fitView({ padding: 0.3, duration: 300 });
  }, [fitView]);

  // Export handler
  const handleExport = useCallback(async () => {
    const flowViewport = containerRef.current?.querySelector('.react-flow__viewport') as HTMLElement;
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
      // Silently fail if export not available
    }
  }, [fileName]);

  // Fullscreen handler
  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  // Track zoom level
  const handleViewportChange = useCallback(() => {
    setZoom(Math.round(getZoom() * 100));
  }, [getZoom]);

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
          defaultEdgeOptions={{
            type: 'smoothstep',
          }}
        >
          <Background
            variant={BackgroundVariant.Lines}
            gap={50}
            lineWidth={0.5}
            color={GRID_LINE_COLOR}
          />

          {/* Zoom Controls Panel */}
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
                <Typography sx={{ color: 'white', fontSize: 16, fontWeight: 600 }}>+</Typography>
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
                <Typography sx={{ color: 'white', fontSize: 16, fontWeight: 600 }}>-</Typography>
              </Box>
            </Stack>
          </Panel>
        </ReactFlow>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

// Wrapper with ReactFlowProvider
export function DataFlowCanvas(props: DataFlowCanvasProps) {
  return (
    <ReactFlowProvider>
      <DataFlowCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
