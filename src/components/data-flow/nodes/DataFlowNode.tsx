'use client';

import type { NodeProps } from '@xyflow/react';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {
  NODE_WIDTH,
  NODE_BORDER,
  NODE_BODY_BG,
  ACTION_COLOR,
  ACTION_GRAY,
  HEADER_BG,
  HEADER_BORDER,
  TEXT_SECONDARY,
  TEXT_TERTIARY,
} from '../constants';

import type { DataFlowAction, DataFlowNodeData } from '../types';

// ----------------------------------------------------------------------

function formatParam(param: Record<string, unknown>): string {
  const entries = Object.entries(param);
  if (entries.length === 0) return '{}';
  const parts = entries.map(([k, v]) => `${k}:'${v}'`);
  return `{${parts.join(',')}}`;
}

// ----------------------------------------------------------------------

function RecvNodeBody({ channels }: { channels: number[] }) {
  return (
    <Box sx={{ px: 1.5, py: 1 }}>
      <Typography
        sx={{
          color: ACTION_GRAY,
          fontSize: 15,
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 400,
          lineHeight: '22.5px',
        }}
      >
        {channels.join(', ')}
      </Typography>
      <Typography
        sx={{
          color: ACTION_GRAY,
          fontSize: 15,
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 400,
          lineHeight: '22.5px',
        }}
      >
        {channels.length} channels
      </Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

function EntityNodeBody({ actions }: { actions: DataFlowAction[] }) {
  return (
    <Stack sx={{ px: 1.5, pt: 1, pb: 1 }}>
      {actions.map((action, idx) => (
        <Box
          key={idx}
          sx={{
            alignSelf: 'stretch',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '4px',
            minHeight: 26,
          }}
        >
          {/* Left col: act 'name', */}
          <Box sx={{ width: 105, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <Typography
              component="span"
              sx={{
                fontSize: 15,
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                lineHeight: '22.5px',
                color: ACTION_GRAY,
              }}
            >
              {'act '}
            </Typography>
            <Typography
              component="span"
              sx={{
                fontSize: 15,
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                lineHeight: '22.5px',
                color: ACTION_COLOR,
                marginLeft: 0.5,
              }}
            >
              {`'${action.act}'`}
            </Typography>
            <Typography
              component="span"
              sx={{
                fontSize: 15,
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                lineHeight: '22.5px',
                color: ACTION_GRAY,
              }}
            >
              {','}
            </Typography>
          </Box>

          {/* Right col: {params} */}
          <Box sx={{ flex: 1, width: 200 }}>
            <Typography
              sx={{
                fontSize: 15,
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                lineHeight: '22.5px',
                color: ACTION_GRAY,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {formatParam(action.param)}
            </Typography>
          </Box>
        </Box>
      ))}
    </Stack>
  );
}

// ----------------------------------------------------------------------

function DataFlowNodeComponent({ data }: NodeProps) {
  const nodeData = data as DataFlowNodeData;

  const badgeLabel = 'ENTITY';

  return (
    <>
      <Handle type="target" position={Position.Left} style={{ opacity: 0, width: 8, height: 8 }} />

      <Box
        sx={{
          width: NODE_WIDTH,
          borderRadius: '12px',
          overflow: 'hidden',
          backgroundColor: NODE_BODY_BG,
          border: `1px solid ${NODE_BORDER}`,
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
          {/* Badge */}
          <Box
            sx={{
              px: 0.5,
              backgroundColor: NODE_BODY_BG,
              borderRadius: '4px',
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                fontSize: 15,
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                lineHeight: '22.5px',
                color: TEXT_TERTIARY,
              }}
            >
              {badgeLabel}
            </Typography>
          </Box>

          {/* Label */}
          <Typography
            sx={{
              flex: 1,
              fontSize: 15,
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 400,
              lineHeight: '22.5px',
              color: TEXT_SECONDARY,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {nodeData.label}
          </Typography>
        </Stack>

        {/* Body */}
        {nodeData.nodeType === 'recv' && nodeData.channels && nodeData.channels.length > 0 && (
          <RecvNodeBody channels={nodeData.channels} />
        )}

        {nodeData.nodeType === 'entity' && nodeData.actions && nodeData.actions.length > 0 && (
          <EntityNodeBody actions={nodeData.actions} />
        )}
      </Box>

      <Handle type="source" position={Position.Right} style={{ opacity: 0, width: 8, height: 8 }} />
    </>
  );
}

export const DataFlowNode = memo(DataFlowNodeComponent);
