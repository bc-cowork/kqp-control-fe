'use client';

import type { NodeProps } from '@xyflow/react';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { NodeBadge } from './NodeBadge';
import { ActionLine } from './ActionLine';
import { TEXT_GRAY, HEADER_BG, NODE_WIDTHS, HEADER_BORDER, TEXT_SECONDARY, NODE_TYPE_COLORS } from '../constants';

import type { DataFlowNodeData } from '../types';

// ----------------------------------------------------------------------

function EntityFlowNodeComponent({ data }: NodeProps) {
  const nodeData = data as DataFlowNodeData;
  const colors = NODE_TYPE_COLORS.entity;

  return (
    <>
      <Handle type="target" position={Position.Left} style={{ opacity: 0, width: 8, height: 8 }} />

      <Box
        sx={{
          width: NODE_WIDTHS.entity,
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: colors.bodyBg,
          border: `1px solid ${colors.border}`,
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
          <NodeBadge type="entity" />
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
            {nodeData.label}
          </Typography>
        </Stack>

        {/* Description */}
        {nodeData.desc && (
          <Box sx={{ px: 1.5, pt: 1, pb: 1 }}>
            <Typography
              sx={{
                fontSize: 12,
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                lineHeight: '16.8px',
                color: TEXT_GRAY,
              }}
            >
              == {nodeData.desc}
            </Typography>
          </Box>
        )}

        {/* Action lines */}
        {nodeData.actions && nodeData.actions.length > 0 && (
          <Stack sx={{ pb: 1, px: 1.5 }} alignItems="flex-start">
            {nodeData.actions.map((action, idx) => (
              <ActionLine key={idx} action={action} nodeType="entity" />
            ))}
          </Stack>
        )}
      </Box>

      <Handle
        type="source"
        position={Position.Right}
        style={{ opacity: 0, width: 8, height: 8 }}
      />
    </>
  );
}

export const EntityFlowNode = memo(EntityFlowNodeComponent);
