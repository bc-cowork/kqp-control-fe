'use client';

import type { NodeProps } from '@xyflow/react';

import { memo, useRef, useState, useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals } from '@xyflow/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {
  BADGE_BG,
  BADGE_TEXT,
  ACTION_GRAY,
  ACTION_COLOR,
  HANDLE_GRAY,
  HANDLE_GREEN,
  HANDLE_PURPLE,
  TEXT_SECONDARY,
  HEADER_BORDER,
  RECV_NODE_BG,
  RECV_HEADER_BG,
  RECV_NODE_WIDTH,
  RECV_NODE_BORDER,
  ENTITY_NODE_BG,
  ENTITY_NODE_WIDTH,
  ENTITY_HEADER_BG,
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

function ActionRow({
  action,
  idx,
}: {
  action: DataFlowAction;
  idx: number;
}) {
  const isRouting = action.act === 'route' || action.act === 'kpass';
  const circleColor = isRouting ? HANDLE_GREEN : HANDLE_GRAY;
  return (
    <Box
      sx={{
        alignSelf: 'stretch',
        display: 'flex',
        alignItems: 'flex-start',
        borderRadius: '4px',
        minWidth: 0,
      }}
    >
      {/* Left col: act 'name', */}
      <Box sx={{ width: 105, display: 'flex', alignItems: 'flex-start', flexShrink: 0 }}>
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

      {/* Right col: {params} + circle indicator with handle */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
        <Typography
          sx={{
            flex: 1,
            minWidth: 0,
            fontSize: 15,
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            lineHeight: '22.5px',
            color: ACTION_GRAY,
            wordWrap: 'break-word',
          }}
        >
          {formatParam(action.param)}
        </Typography>
        {/* Circle with Handle placed directly on it */}
        <Box sx={{ position: 'relative', flexShrink: 0, width: 10, height: 10 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              border: `1.5px solid ${circleColor}`,
            }}
          />
          {isRouting && (
            <Handle
              type="source"
              position={Position.Right}
              id={`action-${idx}`}
              style={{
                opacity: 0,
                width: 1,
                height: 1,
                position: 'absolute',
                top: '50%',
                right: 8,
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

function DataFlowNodeComponent({ id, data }: NodeProps) {
  const nodeData = data as DataFlowNodeData;
  const isRecv = nodeData.nodeType === 'recv';
  const updateNodeInternals = useUpdateNodeInternals();
  const bodyRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [handleTop, setHandleTop] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (isRecv && headerRef.current && bodyRef.current) {
      const headerH = headerRef.current.offsetHeight;
      const bodyH = bodyRef.current.offsetHeight;
      setHandleTop(headerH + bodyH / 2);
      updateNodeInternals(id);
    }
  }, [isRecv, nodeData.channels, id, updateNodeInternals]);

  if (isRecv) {
    return (
      <>
        <Handle
          type="target"
          position={Position.Left}
          style={{ opacity: 0, width: 1, height: 1 }}
        />

        <Box
          sx={{
            width: RECV_NODE_WIDTH,
            borderRadius: '12px',
            overflow: 'visible',
            backgroundColor: RECV_NODE_BG,
            border: `1px solid ${RECV_NODE_BORDER}`,
            position: 'relative',
          }}
        >
          {/* Header: badge (left) + label (right) */}
          <Stack
            ref={headerRef}
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              p: 1.5,
              backgroundColor: RECV_HEADER_BG,
              borderBottom: `1px solid ${HEADER_BORDER}`,
              borderRadius: '12px 12px 0 0',
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
            <Box ref={bodyRef} sx={{ borderRadius: '0 0 12px 12px', position: 'relative' }}>
              <RecvNodeBody channels={nodeData.channels} />
              {/* Purple circle — vertically centered within body */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: 8,
                  transform: 'translateY(-50%)',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  border: `1.5px solid ${HANDLE_PURPLE}`,
                }}
              />
            </Box>
          )}


        </Box>

        {/* Source handle — dynamically positioned at the purple circle center */}
        <Handle
          type="source"
          position={Position.Right}
          style={{
            opacity: 0,
            width: 1,
            height: 1,
            ...(handleTop !== undefined && { top: handleTop }),
            right: 14,
          }}
        />
      </>
    );
  }

  // Entity node
  const actions = nodeData.actions || [];

  return (
    <>
      {/* Target handle — invisible, positioned at header center */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          opacity: 0,
          width: 1,
          height: 1,
          top: 24,
        }}
      />

      <Box
        sx={{
          width: ENTITY_NODE_WIDTH,
          borderRadius: '12px',
          overflow: 'visible',
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
        {actions.length > 0 && (
          <Stack spacing={0.5} sx={{ px: 1.5, pt: 0.5, pb: 0.5 }}>
            {actions.map((action, idx) => (
              <ActionRow key={idx} action={action} idx={idx} />
            ))}
          </Stack>
        )}
      </Box>

      {/* Fallback source handle for non-route edges */}
      <Handle
        type="source"
        position={Position.Right}
        id="default"
        style={{ opacity: 0, width: 1, height: 1 }}
      />
    </>
  );
}

export const DataFlowNode = memo(DataFlowNodeComponent);
