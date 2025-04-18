'use client';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { grey } from 'src/theme/core';
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
      <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[600], mt: 2 }}>
        Issue Item
      </Typography>
      <Box
        sx={{
          mt: '28px',
          width: 1,
        }}
      >
        <MemoryItem selectedNodeId={nodeId} code={code} />
      </Box>
    </DashboardContent>
  );
}
