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
      <Breadcrumb
        node={nodeId}
        pages={[
          { pageName: 'Memory', link: `/dashboard/nodes/${nodeId}/memory` },
          { pageName: 'Issue Item' },
        ]}
      />
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
