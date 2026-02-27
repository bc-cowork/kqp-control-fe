'use client';

import type { NodeProps } from '@xyflow/react';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { NodeBadge } from './NodeBadge';
import { NODE_WIDTHS, EMIT_NODE_HEIGHT, NODE_TYPE_COLORS } from '../constants';

// ----------------------------------------------------------------------

function EmitFlowNodeComponent(_props: NodeProps) {
  const colors = NODE_TYPE_COLORS.emit;

  return (
    <>
      <Handle type="target" position={Position.Left} style={{ opacity: 0, width: 8, height: 8 }} />

      <Box
        sx={{
          width: NODE_WIDTHS.emit,
          height: EMIT_NODE_HEIGHT,
          borderRadius: '4px',
          overflow: 'hidden',
          border: `0.5px solid ${colors.border}`,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            p: 1.5,
            height: '100%',
            background: `linear-gradient(90deg, ${colors.border} 0%, rgba(97, 62, 10, 0.12) 100%)`,
          }}
        >
          <NodeBadge type="emit" />
        </Stack>
      </Box>
    </>
  );
}

export const EmitFlowNode = memo(EmitFlowNodeComponent);
