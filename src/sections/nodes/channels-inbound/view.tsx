'use client';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { grey } from 'src/theme/core';
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
      <Breadcrumb node={nodeId} pages={[{ pageName: 'Channels Inbound' }]} />
      <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[600], mt: 2 }}>
        Channels Inbound
      </Typography>
      <Box
        sx={{
          mt: '28px',
          width: 1,
        }}
      >
        <ChannelInbound selectedNodeId={nodeId} />
      </Box>
    </DashboardContent>
  );
}
