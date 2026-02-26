'use client';

import '@xyflow/react/dist/style.css';

import type { Edge, OnEdgesChange, OnNodesChange } from '@xyflow/react';

import { useMemo } from 'react';
import { Controls, ReactFlow, Background, BackgroundVariant } from '@xyflow/react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { EntityNode } from './EntityNode';

import type { EntityNodeType } from './flow-types';

// ----------------------------------------------------------------------

type FlowCanvasProps = {
  nodes: EntityNodeType[];
  edges: Edge[];
  onNodesChange: OnNodesChange<EntityNodeType>;
  onEdgesChange: OnEdgesChange<Edge>;
};

export function FlowCanvas({ nodes, edges, onNodesChange, onEdgesChange }: FlowCanvasProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const nodeTypes = useMemo(() => ({ entity: EntityNode }), []);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: isDark ? '#141C2A' : '#F9FAFB',
        '& .react-flow__controls': {
          borderRadius: '10px',
          overflow: 'hidden',
          border: `1px solid ${isDark ? '#2A3448' : '#E0E4EB'}`,
          boxShadow: isDark
            ? '0 4px 12px rgba(0,0,0,0.3)'
            : '0 4px 12px rgba(0,0,0,0.08)',
          bottom: 12,
          left: 12,
        },
        '& .react-flow__controls-button': {
          backgroundColor: isDark ? '#202838' : '#FFFFFF',
          borderBottom: `1px solid ${isDark ? '#2A3448' : '#E0E4EB'}`,
          color: isDark ? '#F0F1F5' : '#373F4E',
          width: 32,
          height: 32,
          '&:hover': {
            backgroundColor: isDark ? '#2A3448' : '#F3F4F6',
          },
          '& svg': {
            fill: isDark ? '#F0F1F5' : '#373F4E',
            maxWidth: 14,
            maxHeight: 14,
          },
        },
        '& .react-flow__minimap': {
          borderRadius: '10px',
          overflow: 'hidden',
          border: `1px solid ${isDark ? '#2A3448' : '#E0E4EB'}`,
          boxShadow: isDark
            ? '0 4px 12px rgba(0,0,0,0.3)'
            : '0 4px 12px rgba(0,0,0,0.08)',
          bottom: 12,
          right: 12,
        },
        '& .react-flow__edge-path': {
          strokeWidth: 2,
        },
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.4 }}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: {
            stroke: '#22C55E',
            strokeWidth: 2,
          },
        }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.5}
          color={isDark ? '#1E2A3E' : '#D0D5DD'}
        />
        <Controls showInteractive={false} />
      </ReactFlow>
    </Box>
  );
}
