'use client';

import type { NodeProps } from '@xyflow/react';

import { memo, useRef, useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';

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

function EntityNodeBody({ actions }: { actions: DataFlowAction[] }) {
  return (
    <Stack sx={{ px: 1.5, pt: 0.5, pb: 0.5 }}>
      {actions.map((action, idx) => {
        const isRouting = action.act === 'route' || action.act === 'kpass';
        const circleColor = isRouting ? HANDLE_GREEN : HANDLE_GRAY;
        return (
          <Box
            key={idx}
            sx={{
              alignSelf: 'stretch',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px',
              minHeight: 26,
              overflow: 'hidden',
              minWidth: 0,
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

            {/* Right col: {params} + circle indicator */}
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
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {formatParam(action.param)}
              </Typography>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  border: `1.5px solid ${circleColor}`,
                  flexShrink: 0,
                }}
              />
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}

// ----------------------------------------------------------------------

function DataFlowNodeComponent({ data }: NodeProps) {
  const nodeData = data as DataFlowNodeData;
  const isRecv = nodeData.nodeType === 'recv';
  const bodyRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [handleTop, setHandleTop] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (isRecv && headerRef.current && bodyRef.current) {
      const headerH = headerRef.current.offsetHeight;
      const bodyH = bodyRef.current.offsetHeight;
      setHandleTop(headerH + bodyH / 2);
    }
  }, [isRecv, nodeData.channels]);

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
  // Header height: p=1.5 (12px) + lineHeight 22.5px + p=1.5 (12px) + 1px border = 48px
  // Body top padding: pt=0.5 = 4px; each action row: 26px
  const HEADER_H = 48;
  const BODY_PT = 4;
  const ROW_H = 26;
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
          top: HEADER_H / 2,
        }}
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
        {actions.length > 0 && <EntityNodeBody actions={actions} />}
      </Box>

      {/* Source handles — positioned at each routing action's circle (inside node) */}
      {actions.map((action, idx) =>
        action.act === 'route' || action.act === 'kpass' ? (
          <Handle
            key={`action-${idx}`}
            type="source"
            position={Position.Right}
            id={`action-${idx}`}
            style={{
              opacity: 0,
              width: 1,
              height: 1,
              top: HEADER_H + BODY_PT + idx * ROW_H + ROW_H / 2,
              right: 20,
            }}
          />
        ) : null
      )}

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
