'use client';

import Box from '@mui/material/Box';

import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { ChannelOutbound } from 'src/components/nodes/ChannelOutbound';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function ChannelOutboundView({ nodeId }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb node={nodeId} pages={[{ pageName: 'Channels Outbound' }]} />
      <Box
        sx={{
          mt: 5,
          width: 1,
        }}
      >
        <ChannelOutbound selectedNodeId={nodeId} />
      </Box>
    </DashboardContent>
  );
}
