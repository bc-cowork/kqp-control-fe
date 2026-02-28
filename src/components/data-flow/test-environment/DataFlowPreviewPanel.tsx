import type { Edge } from '@xyflow/react';

import { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Panel,
  ReactFlow,
  Background,
  useReactFlow,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useTranslate } from 'src/locales';

import { RevertIcon } from './icons';
import { DataFlowNode } from '../nodes/DataFlowNode';
import { buildDataFlowGraph } from '../graph-builder';
import { computeDataFlowLayout } from '../layout-algorithm';
import {
  CANVAS_BG,
  HEADER_BG,
  HEADER_BORDER,
  TEXT_TERTIARY,
  TEXT_SECONDARY,
  GRID_LINE_COLOR,
} from '../constants';

import type { DataFlowDefinition, DataFlowNodeInstance } from '../types';

// ----------------------------------------------------------------------

type DataFlowPreviewPanelProps = {
  currentDefinition: DataFlowDefinition;
  fileName: string;
  isHorizontal: boolean;
  isSaving: boolean;
  onSaveClick: () => void;
  onZoomChange: (zoom: number) => void;
};

export function DataFlowPreviewPanel({
  currentDefinition,
  fileName,
  isHorizontal,
  isSaving,
  onSaveClick,
  onZoomChange,
}: DataFlowPreviewPanelProps) {
  const { t } = useTranslate('data-flow');
  const { zoomIn, zoomOut, getZoom } = useReactFlow();
  const [zoom, setZoom] = useState(100);

  const nodeTypes = useMemo(() => ({ dataFlow_node: DataFlowNode }), []);

  const initialGraph = useMemo(() => {
    const { nodes: builtNodes, edges: builtEdges } = buildDataFlowGraph(currentDefinition);
    const laidOut = computeDataFlowLayout(builtNodes, builtEdges);
    return { nodes: laidOut, edges: builtEdges };
  }, [currentDefinition]);

  const [nodes, setNodes, onNodesChange] = useNodesState<DataFlowNodeInstance>(initialGraph.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialGraph.edges);

  // Sync graph when currentDefinition changes (via preview)
  useEffect(() => {
    setNodes(initialGraph.nodes);
    setEdges(initialGraph.edges);
  }, [initialGraph, setNodes, setEdges]);

  const handleViewportChange = useCallback(() => {
    const newZoom = Math.round(getZoom() * 100);
    setZoom(newZoom);
    onZoomChange(newZoom);
  }, [getZoom, onZoomChange]);

  return (
    <Box
      sx={{
        minHeight: isHorizontal ? 600 : 832,
        width: isHorizontal ? '50%' : '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1.2px solid #667085',
        backgroundColor: CANVAS_BG,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Preview toolbar */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          p: 1.5,
          backgroundColor: HEADER_BG,
          borderBottom: `1px solid ${HEADER_BORDER}`,
        }}
      >
        {/* PREVIEW badge */}
        <Box
          sx={{
            px: 1.5,
            pl: 1,
            py: 0,
            backgroundColor: '#331B1E',
            borderRadius: '100px',
            border: '1px solid #4A2C31',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#FF5B5B',
            }}
          />
          <Typography
            sx={{
              fontSize: 15,
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 400,
              lineHeight: '22.5px',
              color: '#FF8882',
            }}
          >
            PREVIEW
          </Typography>
        </Box>

        <Typography
          sx={{
            flex: 1,
            fontSize: 15,
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            lineHeight: '22.5px',
            color: TEXT_SECONDARY,
          }}
        >
          Data Flow
        </Typography>

        <Typography
          sx={{
            flex: 1,
            fontSize: 15,
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            lineHeight: '22.5px',
            color: TEXT_SECONDARY,
          }}
        >
          {fileName}
        </Typography>

        {/* Revert button */}
        <Button
          size="small"
          sx={{
            px: 1.5,
            py: 0.5,
            backgroundColor: '#4A3BFF',
            borderRadius: '4px',
            color: TEXT_TERTIARY,
            gap: 0.75,
            fontSize: 15,
            fontWeight: 400,
            textTransform: 'none',
            lineHeight: '22.5px',
            '&:hover': { backgroundColor: '#3A2BE0' },
          }}
        >
          <RevertIcon />
          {t('sandbox.revert')}
        </Button>

        {/* Save button */}
        <Button
          size="small"
          onClick={onSaveClick}
          disabled={isSaving}
          startIcon={isSaving ? <CircularProgress size={14} color="inherit" /> : undefined}
          sx={{
            px: 1.5,
            py: '15px',
            backgroundColor: '#373F4E',
            borderRadius: '4px',
            color: TEXT_TERTIARY,
            fontSize: 15,
            fontWeight: 400,
            textTransform: 'none',
            lineHeight: '22.5px',
            '&:hover': { backgroundColor: '#4A3BFF' },
            '&.Mui-disabled': { color: '#6B7280', backgroundColor: '#2A3344' },
          }}
        >
          {isSaving ? t('sandbox.saving') : t('sandbox.save')}
        </Button>
      </Stack>

      {/* Canvas */}
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
        >
          <Background
            variant={BackgroundVariant.Lines}
            gap={50}
            lineWidth={0.5}
            color={GRID_LINE_COLOR}
          />

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
