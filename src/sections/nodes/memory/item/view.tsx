'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { MemoryItem } from 'src/components/nodes/MemoryItem';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
  code: string;
};

export function MemoryItemView({ nodeId, code }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h3"> Memory for {nodeId} </Typography>
      <Box
        sx={{
          mt: 5,
          width: 1,
        }}
      >
        <MemoryItem selectedNodeId={nodeId} code={code} />
      </Box>
    </DashboardContent>
  );
}
