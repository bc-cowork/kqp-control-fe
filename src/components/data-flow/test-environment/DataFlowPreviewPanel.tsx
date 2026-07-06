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
} from '@xyflow/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { T, FONT_MONO } from 'src/theme/tokens';

import { useTranslate } from 'src/locales';

import { RevertIcon } from './icons';
import { DataFlowNode } from '../nodes/DataFlowNode';
import { buildDataFlowGraph } from '../graph-builder';
import { computeDataFlowLayout } from '../layout-algorithm';
import { CANVAS_BG, GRID_LINE_COLOR, HELP_TEXT_COLOR } from '../constants';

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
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Ctrl+wheel zoom (same behaviour as DataFlowCanvas)
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

  return (
    <Box
      ref={containerRef}
      sx={{
        minHeight: isHorizontal ? 600 : 832,
        width: isHorizontal ? '50%' : '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        border: `1px solid ${T.border}`,
        backgroundColor: T.bgPanel,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Preview toolbar */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          position: 'relative',
          gap: '11px',
          px: '14px',
          py: '10px',
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: T.textPrim }}>
          Data Flow
        </Typography>

        {/* Centered filename + status chip */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            pointerEvents: 'none',
          }}
        >
          <Typography sx={{ fontSize: 14, color: T.textSec, fontFamily: FONT_MONO }}>
            {fileName}
          </Typography>
          <Box
            sx={{
              fontSize: 14,
              fontWeight: 500,
              px: '10px',
              py: '3px',
              borderRadius: '5px',
              backgroundColor: `${T.primary}26`,
              color: T.accent,
            }}
          >
            미리보기 중
          </Box>
        </Box>

        {/* Revert button */}
        <Button
          size="small"
          disableRipple
          sx={{
            ml: 'auto',
            height: 30,
            px: '13px',
            minWidth: 0,
            backgroundColor: T.primary,
            borderRadius: '6px',
            color: T.onFill,
            gap: 0.75,
            fontSize: 14,
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { backgroundColor: T.primaryHov },
          }}
        >
          <RevertIcon />
          {t('sandbox.revert')}
        </Button>

        {/* Save button */}
        <Button
          size="small"
          disableRipple
          onClick={onSaveClick}
          disabled={isSaving}
          startIcon={isSaving ? <CircularProgress size={14} color="inherit" /> : undefined}
          sx={{
            height: 30,
            px: '15px',
            minWidth: 0,
            backgroundColor: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: '6px',
            color: T.textSec,
            fontSize: 14,
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { backgroundColor: T.bgHover, color: T.textPrim },
            '&.Mui-disabled': { color: T.textDim, backgroundColor: T.bgCard },
          }}
        >
          {isSaving ? t('sandbox.saving') : t('sandbox.save')}
        </Button>
      </Stack>

      {/* Canvas */}
      <Box sx={{ flex: 1, position: 'relative', backgroundColor: CANVAS_BG }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
          minZoom={0.1}
          maxZoom={2}
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
            id="dataflow-preview-grid"
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
