'use client';

import Box from '@mui/material/Box';

import { DashboardContent } from 'src/layouts/dashboard';

import { MemoryItem } from 'src/components/nodes/MemoryItem';
import { Breadcrumb } from 'src/components/common/Breadcrumb';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
  code: string;
};

export function MemoryItemView({ nodeId, code }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb node={nodeId} page="Memory" itemPage="Issue Item" levels={4} />
      <Box
        sx={{
          mt: 5,
          width: 1,
        }}
      >
        <MemoryItem selectedNodeId={nodeId} code={code} />
      </Box>
    </DashboardContent>
  );
}
