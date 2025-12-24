'use client';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { grey } from 'src/theme/core';
import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { NodeDashboard } from 'src/components/nodes/NodeDashboard';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function NodeDashboardView({ nodeId }: Props) {
  const { t } = useTranslate('node-dashboard');
  return (
    <DashboardContent maxWidth='xl'>
      <Breadcrumb node={nodeId} pages={[{ pageName: t('top.node_dashboard') }]} />
      <Typography sx={{ fontSize: 28, fontWeight: 600, color: (theme) => theme.palette.mode === 'dark' ? grey[50] : '#373F4E', mt: 2 }}>
        {t('top.node_dashboard')}
      </Typography>
      <Box
        sx={{
          mt: '28px',
          width: 1,
        }}
      >
        <NodeDashboard selectedNodeId={nodeId} />
      </Box>
    </DashboardContent>
  );
}
