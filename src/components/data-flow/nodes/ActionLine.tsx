'use client';

import Box from '@mui/material/Box';

import { TEXT_GRAY, NODE_TYPE_COLORS } from '../constants';

import type { DataFlowAction, DataFlowNodeType } from '../types';

// ----------------------------------------------------------------------

type ActionLineProps = {
  action: DataFlowAction;
  nodeType: DataFlowNodeType;
};

export function ActionLine({ action, nodeType }: ActionLineProps) {
  const actionColor = NODE_TYPE_COLORS[nodeType]?.actionHighlight || TEXT_GRAY;

  // Determine param color based on action type
  const paramColor = getParamColor(action);

  // Format params string
  const paramsStr = formatParams(action.params);

  return (
    <Box
      sx={{
        height: 25.67,
        borderRadius: '4px',
        fontFamily: 'Roboto, monospace',
        fontSize: 15,
        lineHeight: '22.5px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      <Box component="span" sx={{ color: TEXT_GRAY }}>
        act{' '}
      </Box>
      <Box component="span" sx={{ color: actionColor }}>
        &apos;{action.act}&apos;
      </Box>
      <Box component="span" sx={{ color: TEXT_GRAY }}>
        ,{' '}
      </Box>
      <Box component="span" sx={{ color: paramColor }}>
        {paramsStr}
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

function getParamColor(action: DataFlowAction): string {
  if (action.act === 'log' && action.params.to) return '#FF5B5B';
  if (action.act === 'route' && action.params.to) return '#4FCB53';
  return TEXT_GRAY;
}

function formatParams(params: Record<string, string>): string {
  const entries = Object.entries(params);
  if (entries.length === 0) return '{}';
  const inner = entries.map(([k, v]) => `${k}:'${v}'`).join(',');
  return `{${inner}}`;
}
