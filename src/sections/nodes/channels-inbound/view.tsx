'use client';

import Box from '@mui/material/Box';

import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { ChannelInbound } from 'src/components/nodes/ChannelInbound';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function ChannelInboundView({ nodeId }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb node={nodeId} page="Channels Inbound" />
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
