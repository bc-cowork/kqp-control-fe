'use client';

import Box from '@mui/material/Box';

import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { ProcessDetail } from 'src/components/nodes/ProcessDetail';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function ProcessView({ nodeId }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb node={nodeId} pages={[{ pageName: 'Process' }]} />
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
