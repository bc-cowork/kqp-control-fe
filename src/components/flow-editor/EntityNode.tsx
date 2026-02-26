'use client';

import type { NodeProps } from '@xyflow/react';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { NODE_WIDTH } from './flow-utils';

import type { EntityNodeData } from './flow-types';

// ----------------------------------------------------------------------

function EntityNodeComponent({ data, selected }: NodeProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const nodeData = data as EntityNodeData;
  const propCount = Object.keys(nodeData.entityData || {}).length;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: selected ? theme.palette.primary.main : isDark ? '#4E576A' : '#B0B7C3',
          border: `2px solid ${isDark ? '#141C2A' : '#F9FAFB'}`,
          width: 10,
          height: 10,
          transition: 'background 0.2s',
        }}
      />

      <Box
        sx={{
          width: NODE_WIDTH,
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: isDark ? '#202838' : '#FFFFFF',
          border: `2px solid ${selected ? theme.palette.primary.main : isDark ? '#2A3448' : '#E0E4EB'}`,
          boxShadow: selected
            ? `0 0 0 3px ${theme.palette.primary.main}25, 0 4px 16px rgba(0,0,0,0.15)`
            : isDark
              ? '0 2px 8px rgba(0,0,0,0.3)'
              : '0 2px 8px rgba(0,0,0,0.06)',
          transition: 'all 0.2s ease',
          cursor: 'grab',
          '&:hover': {
            borderColor: theme.palette.primary.main,
            boxShadow: isDark
              ? `0 4px 16px rgba(0,0,0,0.4)`
              : '0 4px 16px rgba(0,0,0,0.1)',
            transform: 'translateY(-1px)',
          },
        }}
      >
        {/* Top accent bar */}
        <Box
          sx={{
            height: 4,
            background: selected
              ? theme.palette.primary.main
              : 'linear-gradient(90deg, #4A3BFF 0%, #7B6FFF 100%)',
          }}
        />

        <Stack spacing={0.5} sx={{ px: 2, py: 1.5 }} alignItems="center">
          {/* Entity icon circle */}
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDark ? '#1A2235' : '#F0F1FF',
              border: `1px solid ${isDark ? '#2A3448' : '#DDDEFF'}`,
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: theme.palette.primary.main,
                lineHeight: 1,
              }}
            >
              {nodeData.label.charAt(0)}
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: 13,
              fontWeight: 700,
              color: isDark ? '#F0F1F5' : '#373F4E',
              textAlign: 'center',
              lineHeight: 1.2,
              letterSpacing: '0.02em',
            }}
          >
            {nodeData.label}
          </Typography>

          {nodeData?.entityData && (
            <Typography
              sx={{
                fontSize: 10,
                color: isDark ? '#667085' : '#98A2B3',
                textAlign: 'center',
                fontWeight: 500,
              }}
            >
              {(nodeData?.entityData?.description as string) || 'No description'}
            </Typography>
          )}
        </Stack>
      </Box>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: selected ? theme.palette.primary.main : isDark ? '#4E576A' : '#B0B7C3',
          border: `2px solid ${isDark ? '#141C2A' : '#F9FAFB'}`,
          width: 10,
          height: 10,
          transition: 'background 0.2s',
        }}
      />
    </>
  );
}

export const EntityNode = memo(EntityNodeComponent);
