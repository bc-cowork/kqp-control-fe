'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Memory } from 'src/components/nodes/Memory';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function MemoryView({ nodeId }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h3"> Memory for {nodeId} </Typography>
      <Box
        sx={{
          mt: 5,
          width: 1,
        }}
      >
        <Memory selectedNodeId={nodeId} />
      </Box>
    </DashboardContent>
  );
}
