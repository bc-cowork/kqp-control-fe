'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { ProcessDetail } from 'src/components/nodes/ProcessDetail';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function ProcessView({ nodeId }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h3"> Process Details for {nodeId} </Typography>
      <Box
        sx={{
          mt: 5,
          width: 1,
        }}
      >
        <ProcessDetail selectedNodeId={nodeId} />
      </Box>
    </DashboardContent>
  );
}
