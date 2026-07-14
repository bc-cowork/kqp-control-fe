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
  useNodesInitialized,
} from '@xyflow/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useTranslate } from 'src/locales';
import { T, FONT_MONO } from 'src/theme/tokens';

import { getViewportScale } from 'src/components/viewport-zoom';

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
  const { fitView, zoomTo, zoomIn, zoomOut, getZoom } = useReactFlow();
  const nodesInitialized = useNodesInitialized();
  const [zoom, setZoom] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  // The app applies a root CSS `zoom` (<html>) to fit smaller viewports. React
  // Flow can't see that zoom, so it mis-measures handle/edge geometry and the
  // edges drift off the connection dots. Counteract it by applying the inverse
  // `zoom` on the canvas pane so React Flow renders at an effective root zoom of 1.
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
      onZoomChange(next);
    },
    [getZoom, zoomTo, onZoomChange]
  );

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

  // Track zoom % (snapped to the nearest 5-step) and report it to the modal header.
  const handleViewportChange = useCallback(() => {
    const snapped = Math.round((getZoom() * 100) / 5) * 5;
    setZoom(snapped);
    onZoomChange(snapped);
  }, [getZoom, onZoomChange]);

  // Center the graph once custom nodes are measured — the ReactFlow default
  // viewport can't account for dynamic-height nodes. Fold docScale into the graph
  // zoom so it scales in step with the responsive layout (the counter-zoom
  // otherwise decouples the canvas from the root zoom); re-fit on scale change.
  useEffect(() => {
    if (!nodesInitialized) return;
    const z = 0.95 * docScale;
    fitView({ padding: 0.08, minZoom: z, maxZoom: z });
    const snapped = Math.round((z * 100) / 5) * 5;
    setZoom(snapped);
    onZoomChange(snapped);
  }, [nodesInitialized, fitView, docScale, onZoomChange]);

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

  // Keyboard zoom: Ctrl/Cmd + (+/=), Ctrl/Cmd + (-), Ctrl/Cmd + 0 (reset)
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

  // Ctrl+wheel zoom
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
        minHeight: isHorizontal ? 780 : 832,
        width: isHorizontal ? '50%' : '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        border: `1px solid ${T.link}`,
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
        <Typography sx={{ fontSize: 17, fontWeight: 400, color: T.link }}>Data Flow</Typography>

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
          <Typography sx={{ fontSize: 14, color: T.textDim, fontFamily: FONT_MONO }}>
            {fileName}
          </Typography>
          <Box
            sx={{
              fontSize: 14,
              fontWeight: 500,
              px: '10px',
              py: '3px',
              borderRadius: '5px',
              backgroundColor: `${T.link}26`,
              color: T.link,
            }}
          >
            미리보기 중
          </Box>
        </Box>

        {/* Revert button — secondary (neutral) style */}
        <Button
          size="small"
          disableRipple
          sx={{
            ml: 'auto',
            height: 32,
            px: '14px',
            minWidth: 0,
            backgroundColor: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: '6px',
            color: T.textSec,
            gap: 0.75,
            fontSize: 15,
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { backgroundColor: T.bgHover, color: T.textSec },
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
            height: 32,
            px: '14px',
            minWidth: 0,
            backgroundColor: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: '6px',
            color: T.link,
            fontSize: 15,
            fontWeight: 500,
            textTransform: 'none',
            '&:hover': { backgroundColor: T.bgHover, color: T.link },
            '&.Mui-disabled': { color: T.textDim, backgroundColor: T.bgCard },
          }}
        >
          {isSaving ? t('sandbox.saving') : t('sandbox.save')}
        </Button>
      </Stack>

      {/* Canvas */}
      <Box sx={{ flex: 1, position: 'relative', backgroundColor: CANVAS_BG }}>
        <Box
          // `zoom` (React inline style, unitless) — inverse of the root zoom so
          // React Flow sees an effective root zoom of 1 and the edges stay
          // attached to the connection dots. Fills the pane on screen.
          style={{ zoom: 1 / docScale }}
          sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
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
              id="dataflow-preview-grid"
              variant={BackgroundVariant.Lines}
              gap={50}
              lineWidth={1}
              color={GRID_LINE_COLOR}
            />

            {/* Help text — scaled by docScale to stay in step with the root zoom */}
            <Panel position="top-left">
              <Typography
                sx={{
                  color: HELP_TEXT_COLOR,
                  opacity: 0.65,
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
