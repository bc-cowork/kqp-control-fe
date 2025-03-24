'use client';

import Box from '@mui/material/Box';

import { DashboardContent } from 'src/layouts/dashboard';

import { Memory } from 'src/components/nodes/Memory';
import { Breadcrumb } from 'src/components/common/Breadcrumb';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function MemoryView({ nodeId }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb node={nodeId} page="Memory" />
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
