'use client';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { grey } from 'src/theme/core';
import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { NodeDashboard } from 'src/components/nodes/NodeDashboard';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function NodeDashboardView({ nodeId }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb node={nodeId} pages={[{ pageName: 'Node Dashboard' }]} />
      <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[600], mt: 2 }}>
        Node Dashboard
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
