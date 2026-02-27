'use client';

import type { NodeProps } from '@xyflow/react';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { HEADER_BG, NODE_WIDTH, NODE_BORDER, NODE_BODY_BG, ACTION_COLOR, TEXT_SECONDARY } from '../constants';

import type { DataFlowNodeData } from '../types';

// ----------------------------------------------------------------------

function DataFlowNodeComponent({ data }: NodeProps) {
  const nodeData = data as DataFlowNodeData;

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
          sx={{
            p: 1.5,
            backgroundColor: HEADER_BG,
            borderBottom: '1px solid',
            borderImage: `linear-gradient(to right, rgba(55, 63, 78, 0.00), rgb(170, 170, 170) 50%, rgba(55, 63, 78, 0.00)) 1`,
          }}
        >
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

        {/* Actions */}
        {nodeData.actions && nodeData.actions.length > 0 && (
          <Stack sx={{ pt: 1, pb: 1, pl: 1.5, pr: 3 }} alignItems="flex-end">
            {nodeData.actions.map((action, idx) => (
              <Box
                key={idx}
                sx={{
                  alignSelf: 'stretch',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                <Typography
                  sx={{
                    flex: 1,
                    height: 25.67,
                    textAlign: 'right',
                    fontSize: 15,
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400,
                    lineHeight: '22.5px',
                    color: ACTION_COLOR,
                  }}
                >
                  {action}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Box>

      <Handle type="source" position={Position.Right} style={{ opacity: 0, width: 8, height: 8 }} />
    </>
  );
}

export const DataFlowNode = memo(DataFlowNodeComponent);
