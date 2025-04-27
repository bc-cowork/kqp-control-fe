'use client';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { grey } from 'src/theme/core';
import { DashboardContent } from 'src/layouts/dashboard';

import { RuleList } from 'src/components/nodes/RuleList';
import { Breadcrumb } from 'src/components/common/Breadcrumb';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function RuleListView({ nodeId }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb node={nodeId} pages={[{ pageName: 'Rule List' }]} />
      <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[600], mt: 2 }}>
        Rule List
      </Typography>
      <Box
        sx={{
          mt: '28px',
          width: 1,
        }}
      >
        <RuleList selectedNodeId={nodeId} />
      </Box>
    </DashboardContent>
  );
}
