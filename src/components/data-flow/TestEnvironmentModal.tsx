'use client';

import '@xyflow/react/dist/style.css';

import type { Edge } from '@xyflow/react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { useRef, useMemo, useState, useCallback } from 'react';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
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
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { DataFlowNode } from './nodes/DataFlowNode';
import { buildDataFlowGraph } from './graph-builder';
import { computeDataFlowLayout } from './layout-algorithm';
import { CANVAS_BG, HEADER_BG, HEADER_BORDER, TEXT_TERTIARY, TEXT_SECONDARY, GRID_LINE_COLOR } from './constants';

import type { DataFlowDefinition, DataFlowNodeInstance } from './types';

// ----------------------------------------------------------------------

type TestEnvironmentModalProps = {
  open: boolean;
  onClose: () => void;
  definition: DataFlowDefinition;
  fileName: string;
  layoutDefinition: string;
};

// ----------------------------------------------------------------------

function ModalContent({
  onClose,
  definition,
  fileName,
  layoutDefinition,
}: Omit<TestEnvironmentModalProps, 'open'>) {
  const { t } = useTranslate('data-flow');
  const { zoomIn, zoomOut, getZoom } = useReactFlow();
  const [zoom, setZoom] = useState(100);

  const nodeTypes = useMemo(() => ({ dataFlow_node: DataFlowNode }), []);

  const initialGraph = useMemo(() => {
    const { nodes, edges } = buildDataFlowGraph(definition);
    const laidOut = computeDataFlowLayout(nodes, edges);
    return { nodes: laidOut, edges };
  }, [definition]);

  const [nodes, , onNodesChange] = useNodesState<DataFlowNodeInstance>(initialGraph.nodes);
  const [edges, , onEdgesChange] = useEdgesState<Edge>(initialGraph.edges);

  const handleViewportChange = useCallback(() => {
    setZoom(Math.round(getZoom() * 100));
  }, [getZoom]);

  // Scrollbar ref for layout definition
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        bottom: 20,
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto',
        bgcolor: '#0A0E15',
        borderRadius: '16px',
        outline: '5px solid #373F4E',
        outlineOffset: '-5px',
        pt: 3,
        pb: 5,
        px: 4.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        // Thin scrollbar for the modal itself
        scrollbarWidth: 'thin',
        scrollbarColor: '#4E576A #202838',
      }}
    >
      {/* ========== Modal Header ========== */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ pb: 2 }}
      >
        {/* File icon */}
        <Box sx={{ width: 24, height: 24, position: 'relative' }}>
          <Box
            sx={{
              width: 15,
              height: 20,
              position: 'absolute',
              left: 5,
              top: 2,
              border: '0.67px solid #D1D6E0',
              borderRadius: '1px',
            }}
          />
        </Box>

        {/* Title */}
        <Typography
          sx={{
            flex: 1,
            fontSize: 19,
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            lineHeight: '28.5px',
            color: '#F0F1F5',
          }}
        >
          {t('sandbox.title')}
        </Typography>

        {/* Right-side controls */}
        <Stack direction="row" alignItems="center" spacing={1}>
          {/* Zoom label */}
          <Box sx={{ px: 1.5, py: 0.5, borderRadius: '4px' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 400, lineHeight: '16.8px', color: 'white' }}>
              100%
            </Typography>
          </Box>

          {/* Vertical view */}
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Typography sx={{ fontSize: 15, fontWeight: 400, lineHeight: '22.5px', color: TEXT_TERTIARY }}>
              {t('sandbox.vertical_view')}
            </Typography>
            <Box sx={{ width: 12, height: 12, opacity: 0.1 }} />
          </Stack>

          {/* Fullscreen button */}
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              backgroundColor: '#373F4E',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#4E576A' },
            }}
          >
            <Box sx={{ width: 16, height: 16, opacity: 0.1 }} />
          </Box>

          {/* Close button */}
          <Box
            onClick={onClose}
            sx={{
              px: 1.5,
              py: 0.5,
              backgroundColor: '#373F4E',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': { backgroundColor: '#4E576A' },
            }}
          >
            <Typography sx={{ fontSize: 15, fontWeight: 400, color: TEXT_TERTIARY, lineHeight: '22.5px' }}>
              ✕
            </Typography>
          </Box>
        </Stack>
      </Stack>

      {/* ========== Data Flow Canvas Preview ========== */}
      <Box
        sx={{
          minHeight: 832,
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
          {/* PREVIEW badge (danger/red) */}
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

          {/* Title */}
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

          {/* Filename */}
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

          {/* Save button */}
          <Button
            size="small"
            sx={{
              px: 1.5,
              py: 0.5,
              backgroundColor: '#373F4E',
              borderRadius: '4px',
              color: TEXT_TERTIARY,
              fontSize: 15,
              fontWeight: 400,
              textTransform: 'none',
              lineHeight: '22.5px',
              '&:hover': { backgroundColor: '#4E576A' },
            }}
          >
            {t('sandbox.save')}
          </Button>

          {/* Revert button */}
          <Button
            size="small"
            sx={{
              px: 1.5,
              py: 0.5,
              backgroundColor: '#4A3BFF',
              borderRadius: '4px',
              color: TEXT_TERTIARY,
              fontSize: 15,
              fontWeight: 400,
              textTransform: 'none',
              lineHeight: '22.5px',
              '&:hover': { backgroundColor: '#3A2BE0' },
            }}
          >
            {t('sandbox.revert')}
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

      {/* ========== Layout Definition Panel ========== */}
      <Box
        sx={{
          minHeight: 837,
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1.2px solid #667085',
          backgroundColor: CANVAS_BG,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
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
          {/* MOON DSL badge (info/blue) */}
          <Box
            sx={{
              px: 1.5,
              pl: 1,
              py: 0,
              backgroundColor: '#212447',
              borderRadius: '100px',
              border: '1px solid #1D2654',
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
                backgroundColor: '#7AA2FF',
              }}
            />
            <Typography
              sx={{
                fontSize: 15,
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                lineHeight: '22.5px',
                color: '#7AA2FF',
              }}
            >
              MOON DSL
            </Typography>
          </Box>

          {/* Title */}
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
            {t('sandbox.layout_definition')}
          </Typography>

          {/* Preview button */}
          <Button
            size="small"
            sx={{
              px: 1.5,
              py: 0.5,
              backgroundColor: '#4A3BFF',
              borderRadius: '4px',
              color: '#F0F1F5',
              fontSize: 15,
              fontWeight: 400,
              textTransform: 'none',
              lineHeight: '22.5px',
              '&:hover': { backgroundColor: '#3A2BE0' },
            }}
          >
            {t('sandbox.preview_btn')}
          </Button>
        </Stack>

        {/* Code viewer */}
        <Box
          ref={scrollRef}
          sx={{
            flex: 1,
            overflow: 'auto',
            backgroundColor: CANVAS_BG,
            scrollbarWidth: 'thin',
            scrollbarColor: '#4E576A #202838',
          }}
        >
          <Box sx={{ p: 3.5 }}>
            <Box
              component="pre"
              sx={{
                whiteSpace: 'pre-wrap',
                fontFamily: 'Roboto, monospace',
                fontSize: 15,
                lineHeight: '22.5px',
                color: '#AFB7C8',
                m: 0,
              }}
            >
              <SyntaxHighlighter
                language="moonscript"
                style={a11yDark}
                customStyle={{
                  background: 'transparent',
                  whiteSpace: 'pre-wrap',
                  padding: 0,
                  margin: 0,
                  fontSize: 15,
                  lineHeight: '22.5px',
                }}
              >
                {layoutDefinition}
              </SyntaxHighlighter>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function TestEnvironmentModal({
  open,
  onClose,
  definition,
  fileName,
  layoutDefinition,
}: TestEnvironmentModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      disablePortal
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      slotProps={{
        backdrop: {
          sx: { position: 'absolute' },
        },
      }}
    >
      <ReactFlowProvider>
        <ModalContent
          onClose={onClose}
          definition={definition}
          fileName={fileName}
          layoutDefinition={layoutDefinition}
        />
      </ReactFlowProvider>
    </Modal>
  );
}
