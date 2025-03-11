'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { ChannelInbound } from 'src/components/nodes/ChannelInbound';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function ChannelInboundView({ nodeId }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h3"> Channel Inbound for {nodeId} </Typography>
      <Box
        sx={{
          mt: 5,
          width: 1,
        }}
      >
        <ChannelInbound selectedNodeId={nodeId} />
      </Box>
    </DashboardContent>
  );
}
