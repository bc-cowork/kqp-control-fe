'use client';

import type { Edge } from '@xyflow/react';
import type { EntityNodeType } from 'src/components/flow-editor/flow-types';

import { useState, useEffect, useCallback } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { grey } from 'src/theme/core';
import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { FlowCanvas } from 'src/components/flow-editor/FlowCanvas';
import { JsonEditorPanel } from 'src/components/flow-editor/JsonEditorPanel';
import { INITIAL_JSON, documentToGraph, validateFlowJson, parseFlowDocument } from 'src/components/flow-editor/flow-utils';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function FlowEditorView({ nodeId }: Props) {
  const { t } = useTranslate('flow-editor');
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [jsonValue, setJsonValue] = useState<string>(INITIAL_JSON);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<EntityNodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    const result = validateFlowJson(INITIAL_JSON);
    if (result.valid) {
      const graph = documentToGraph(parseFlowDocument(INITIAL_JSON));
      setNodes(graph.nodes);
      setEdges(graph.edges);
    }
  }, [setNodes, setEdges]);

  const handleJsonChange = useCallback((value: string) => {
    setJsonValue(value);
    const result = validateFlowJson(value);
    setValidationErrors(result.errors);
  }, []);

  const handleApply = useCallback(() => {
    const result = validateFlowJson(jsonValue);
    if (!result.valid) {
      setValidationErrors(result.errors);
      return;
    }

    setValidationErrors([]);
    const doc = parseFlowDocument(jsonValue);
    const graph = documentToGraph(doc);
    setNodes(graph.nodes);
    setEdges(graph.edges);
  }, [jsonValue, setNodes, setEdges]);

  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb node={nodeId} pages={[{ pageName: t('top.title') }]} />
      <Typography
        sx={{
          fontSize: 28,
          fontWeight: 600,
          color: isDark ? grey[50] : '#373F4E',
          mt: 2,
        }}
      >
        {t('top.title')}
      </Typography>

      {/* Stats bar */}
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <StatChip label={t('stats.entities')} value={nodes.length} isDark={isDark} color="#4A3BFF" />
        <StatChip label={t('stats.relations')} value={edges.length} isDark={isDark} color="#22C55E" />
      </Stack>

      <Box
        sx={{
          mt: 2.5,
          height: 'calc(100vh - 290px)',
          minHeight: 480,
        }}
      >
        <Grid container spacing={2.5} sx={{ height: '100%' }}>
          {/* Left: Flow Canvas */}
          <Grid xs={12} md={7} sx={{ height: { xs: 420, md: '100%' } }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <PanelHeader isDark={isDark} icon="graph" title={t('panel.graph_view')} />
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <FlowCanvas
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                />
              </Box>
            </Box>
          </Grid>

          {/* Right: JSON Editor */}
          <Grid xs={12} md={5} sx={{ height: { xs: 420, md: '100%' } }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <PanelHeader isDark={isDark} icon="code" title={t('panel.definition')} />
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <JsonEditorPanel
                  jsonValue={jsonValue}
                  onJsonChange={handleJsonChange}
                  onApply={handleApply}
                  validationErrors={validationErrors}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function PanelHeader({
  isDark,
  icon,
  title,
}: {
  isDark: boolean;
  icon: 'graph' | 'code';
  title: string;
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDark ? '#1A2235' : '#F0F1FF',
          border: `1px solid ${isDark ? '#2A3448' : '#DDDEFF'}`,
        }}
      >
        <SvgIcon sx={{ width: 16, height: 16, color: '#4A3BFF' }}>
          {icon === 'graph' ? (
            <path
              d="M14 2H6a2 2 0 00-2 2v4a2 2 0 002 2h1v2a2 2 0 002 2h1v2a2 2 0 002 2h2a2 2 0 002-2v-2h1a2 2 0 002-2v-2h1a2 2 0 002-2V4a2 2 0 00-2-2zm0 2v4h-4V4h4z"
              fill="currentColor"
            />
          ) : (
            <path
              d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"
              fill="currentColor"
            />
          )}
        </SvgIcon>
      </Box>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 600,
          color: isDark ? '#AFB7C8' : '#4E576A',
          letterSpacing: '0.02em',
        }}
      >
        {title}
      </Typography>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function StatChip({
  label,
  value,
  isDark,
  color,
}: {
  label: string;
  value: number;
  isDark: boolean;
  color: string;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        px: 2,
        py: 1,
        borderRadius: '10px',
        backgroundColor: isDark ? '#202838' : '#FFFFFF',
        border: `1px solid ${isDark ? '#2A3448' : '#E0E4EB'}`,
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 0 6px ${color}50`,
        }}
      />
      <Typography sx={{ fontSize: 13, fontWeight: 500, color: isDark ? '#667085' : '#98A2B3' }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 700, color: isDark ? '#F0F1F5' : '#373F4E' }}>
        {value}
      </Typography>
    </Stack>
  );
}
