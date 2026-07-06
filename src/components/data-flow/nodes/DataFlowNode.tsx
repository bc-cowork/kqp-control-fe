'use client';

import type { NodeProps } from '@xyflow/react';

import { memo, useRef, useState, useEffect } from 'react';
import { Handle, Position, useUpdateNodeInternals } from '@xyflow/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { FONT_MONO } from 'src/theme/tokens';

import {
  BADGE_BG,
  BADGE_TEXT,
  SRC_BLUE,
  ACTION_FN,
  ACTION_COMMA,
  ACTION_LABEL,
  ACTION_PARAM,
  HANDLE_STROKE,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  RECV_NODE_BG,
  RECV_NODE_WIDTH,
  RECV_NODE_BORDER,
  ENTITY_NODE_BG,
  ENTITY_NODE_WIDTH,
  ENTITY_HEADER_BG,
  ENTITY_NODE_BORDER,
  ENTITY_HEADER_BORDER,
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

function ActionRow({ action, idx }: { action: DataFlowAction; idx: number }) {
  const isRouting = action.act === 'route' || action.act === 'kpass';
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '6px',
        fontFamily: FONT_MONO,
        fontSize: 13,
        lineHeight: 1.25,
        minWidth: 0,
      }}
    >
      {/* act 'name', */}
      <Box component="span" sx={{ flexShrink: 0, minWidth: 70 }}>
        <Box component="span" sx={{ color: ACTION_LABEL }}>
          {'act '}
        </Box>
        <Box component="span" sx={{ color: ACTION_FN }}>
          {`'${action.act}'`}
        </Box>
        <Box component="span" sx={{ color: ACTION_COMMA }}>
          ,
        </Box>
      </Box>

      {/* {params} */}
      <Box
        component="span"
        sx={{ flex: 1, minWidth: 0, color: ACTION_PARAM, wordBreak: 'break-all' }}
      >
        {formatParam(action.param)}
      </Box>

      {/* connection dot + handle (only routing rows emit edges) */}
      {isRouting && (
        <Box sx={{ position: 'relative', flexShrink: 0, width: 8, height: 8, alignSelf: 'center' }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: ENTITY_NODE_BG,
              border: `1px solid ${HANDLE_STROKE}`,
            }}
          />
          <Handle
            type="source"
            position={Position.Right}
            id={`action-${idx}`}
            style={{ opacity: 0, width: 1, height: 1, position: 'absolute', top: '50%', right: 4 }}
          />
        </Box>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

function DataFlowNodeComponent({ id, data }: NodeProps) {
  const nodeData = data as DataFlowNodeData;
  const isRecv = nodeData.nodeType === 'recv';
  const updateNodeInternals = useUpdateNodeInternals();
  const bodyRef = useRef<HTMLDivElement>(null);
  const [handleTop, setHandleTop] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (isRecv && bodyRef.current) {
      setHandleTop(bodyRef.current.offsetHeight / 2);
      updateNodeInternals(id);
    }
  }, [isRecv, nodeData.channels, id, updateNodeInternals]);

  // ---------- Source (recv) node — single padded column ----------
  if (isRecv) {
    return (
      <>
        <Handle type="target" position={Position.Left} style={{ opacity: 0, width: 1, height: 1 }} />

        <Box
          ref={bodyRef}
          sx={{
            width: RECV_NODE_WIDTH,
            border: `1.5px solid ${RECV_NODE_BORDER}`,
            borderRadius: '8px',
            backgroundColor: RECV_NODE_BG,
            overflow: 'hidden',
            position: 'relative',
            px: '10px',
            py: '8px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography sx={{ fontSize: 15, fontWeight: 700, fontFamily: FONT_MONO, color: TEXT_PRIMARY }}>
            {String(nodeData.badgeLabel || 'recv2r')}
          </Typography>
          <Typography sx={{ fontSize: 13, color: TEXT_SECONDARY, mt: '1px' }}>
            {nodeData.label}
          </Typography>
          <Typography
            sx={{
              fontSize: 13,
              color: '#6A6878',
              fontFamily: FONT_MONO,
              mt: '5px',
              lineHeight: 1.5,
              flex: 1,
              wordBreak: 'break-word',
            }}
          >
            {(nodeData.channels || []).join(', ')}
          </Typography>
          <Typography sx={{ fontSize: 13, color: SRC_BLUE, mt: '2px' }}>
            {(nodeData.channels || []).length} channels
          </Typography>

          {/* connection dot */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              right: 8,
              transform: 'translateY(-50%)',
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: RECV_NODE_BG,
              border: `1px solid ${HANDLE_STROKE}`,
            }}
          />
        </Box>

        <Handle
          type="source"
          position={Position.Right}
          style={{
            opacity: 0,
            width: 1,
            height: 1,
            ...(handleTop !== undefined && { top: handleTop }),
            right: 12,
          }}
        />
      </>
    );
  }

  // ---------- Processing (entity) node — gradient header + PMR + rows ----------
  const actions = nodeData.actions || [];

  return (
    <>
      <Handle type="target" position={Position.Left} style={{ opacity: 0, width: 1, height: 1, top: 20 }} />

      <Box
        sx={{
          width: ENTITY_NODE_WIDTH,
          border: `1.5px solid ${ENTITY_NODE_BORDER}`,
          borderRadius: '8px',
          background: ENTITY_NODE_BG,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Header: id (left, bold) + PMR badge (right) */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            height: 39,
            px: '10px',
            background: ENTITY_HEADER_BG,
            borderBottom: `1px solid ${ENTITY_HEADER_BORDER}`,
          }}
        >
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 700,
              fontFamily: FONT_MONO,
              color: TEXT_PRIMARY,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {nodeData.label}
          </Typography>
          <Box
            sx={{
              px: '6px',
              py: '1px',
              backgroundColor: BADGE_BG,
              borderRadius: '3px',
              flexShrink: 0,
            }}
          >
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: BADGE_TEXT, lineHeight: 1.4 }}>
              PMR
            </Typography>
          </Box>
        </Stack>

        {/* Body: action rows */}
        {actions.length > 0 && (
          <Stack
            sx={{ px: '10px', py: '8px', justifyContent: 'space-around', minHeight: 32 }}
            spacing={0.75}
          >
            {actions.map((action, idx) => (
              <ActionRow key={idx} action={action} idx={idx} />
            ))}
          </Stack>
        )}
      </Box>

      <Handle type="source" position={Position.Right} id="default" style={{ opacity: 0, width: 1, height: 1 }} />
    </>
  );
}

export const DataFlowNode = memo(DataFlowNodeComponent);
