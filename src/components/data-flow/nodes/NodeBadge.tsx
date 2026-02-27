'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { TEXT_TERTIARY, NODE_TYPE_COLORS, NODE_TYPE_LABELS } from '../constants';

import type { DataFlowNodeType } from '../types';

// ----------------------------------------------------------------------

type NodeBadgeProps = {
  type: DataFlowNodeType;
};

export function NodeBadge({ type }: NodeBadgeProps) {
  const colors = NODE_TYPE_COLORS[type];

  return (
    <Box
      sx={{
        px: 0.5,
        borderRadius: '4px',
        backgroundColor: colors.badgeBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        sx={{
          fontSize: 15,
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 400,
          lineHeight: '22.5px',
          color: TEXT_TERTIARY,
          textAlign: 'center',
        }}
      >
        {NODE_TYPE_LABELS[type]}
      </Typography>
    </Box>
  );
}
