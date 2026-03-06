'use client';

import type { NodeProps } from '@xyflow/react';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {
  BADGE_BG,
  BADGE_TEXT,
  ACTION_GRAY,
  ACTION_COLOR,
  TEXT_SECONDARY,
  HEADER_BORDER,
  RECV_NODE_BG,
  RECV_HEADER_BG,
  RECV_NODE_WIDTH,
  RECV_NODE_BORDER,
  ENTITY_NODE_BG,
  ENTITY_NODE_WIDTH,
  ENTITY_NODE_BORDER,
  ENTITY_HEADER_BG,
} from '../constants';

import type { DataFlowAction, DataFlowNodeData } from '../types';

// ----------------------------------------------------------------------

function formatParam(param: Record<string, unknown>): string {
  const entries = Object.entries(param);
  if (entries.length === 0) return '{}';
  const parts = entries.map(([k, v]) => `${k}:'${v}'`);
  const text = `{${parts.join(',')}}`;
  if (text.length > 30) return `${text.slice(0, 28)}..}`;
  return text;
}

// ----------------------------------------------------------------------

function RecvNodeBody({ channels }: { channels: number[] }) {
  return (
    <Box sx={{ px: 1.5, py: 1 }}>
      <Typography
        sx={{
          color: '#AFB7C8',
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
          color: '#AFB7C8',
          fontSize: 15,
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 400,
          lineHeight: '22.5px',
          textAlign: 'left',
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
    <Stack sx={{ px: 1.5, pt: 0.5, pb: 0.5 }}>
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
              ,
            </Typography>
          </Box>

          {/* Right col: {params} */}
          <Box sx={{ flex: 1 }}>
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
  const isRecv = nodeData.nodeType === 'recv';

  if (isRecv) {
    return (
      <>
        <Handle
          type="target"
          position={Position.Left}
          style={{ opacity: 0, width: 8, height: 8 }}
        />

        <Box
          sx={{
            width: RECV_NODE_WIDTH,
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: RECV_NODE_BG,
            border: `1px solid ${RECV_NODE_BORDER}`,
          }}
        >
          {/* Header: badge (left) + label (right) */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              p: 1.5,
              backgroundColor: RECV_HEADER_BG,
              borderBottom: `1px solid ${HEADER_BORDER}`,
            }}
          >
            <Box
              sx={{
                px: 0.5,
                backgroundColor: BADGE_BG,
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
                  color: BADGE_TEXT,
                }}
              >
                {String(nodeData.badgeLabel || 'recv2r')}
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
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {nodeData.label}
            </Typography>
          </Stack>

          {/* Body: channel list */}
          {nodeData.channels && nodeData.channels.length > 0 && (
            <RecvNodeBody channels={nodeData.channels} />
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

  // Entity node
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ opacity: 0, width: 8, height: 8 }}
      />

      <Box
        sx={{
          width: ENTITY_NODE_WIDTH,
          borderRadius: '12px',
          overflow: 'hidden',
          background: ENTITY_NODE_BG,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(to right, rgba(55,63,78,0), #AFB7C8 50%, rgba(55,63,78,0))`,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: `linear-gradient(to right, rgba(55,63,78,0), #AFB7C8 50%, rgba(55,63,78,0))`,
          },
        }}
      >
        {/* Header: name (left, bold) + PMR badge (right) */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            p: 1.5,
            background: ENTITY_HEADER_BG,
            borderBottom: `1px solid ${HEADER_BORDER}`,
          }}
        >
          <Typography
            sx={{
              flex: 1,
              fontSize: 15,
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 600,
              lineHeight: '22.5px',
              color: TEXT_SECONDARY,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {nodeData.label}
          </Typography>
          <Box
            sx={{
              px: 0.5,
              backgroundColor: BADGE_BG,
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
                color: BADGE_TEXT,
              }}
            >
              PMR
            </Typography>
          </Box>
        </Stack>

        {/* Body: action rows */}
        {nodeData.actions && nodeData.actions.length > 0 && (
          <EntityNodeBody actions={nodeData.actions} />
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

export const DataFlowNode = memo(DataFlowNodeComponent);
