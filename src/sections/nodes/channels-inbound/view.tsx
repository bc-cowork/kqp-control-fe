'use client';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { grey } from 'src/theme/core';
import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { ChannelInbound } from 'src/components/nodes/ChannelInbound';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function ChannelInboundView({ nodeId }: Props) {
  const { t } = useTranslate('channels');
  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb node={nodeId} pages={[{ pageName: t('title.inbound') }]} />
      <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[600], mt: 2 }}>
        {t('title.inbound')}
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
