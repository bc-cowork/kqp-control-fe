'use client';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { grey } from 'src/theme/core';
import { DashboardContent } from 'src/layouts/dashboard';

import { RuleDetail } from 'src/components/nodes/RuleDetail';
import { Breadcrumb } from 'src/components/common/Breadcrumb';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
  code: string;
};

export function RuleDetailView({ nodeId, code }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb
        node={nodeId}
        pages={[
          { pageName: 'Rule List', link: `/dashboard/nodes/${nodeId}/rules` },
          { pageName: 'Rule Detail' },
        ]}
      />
      <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[50], mt: 2 }}>
        Rule Detail
      </Typography>
      <Box
        sx={{
          mt: '28px',
          width: 1,
        }}
      >
        <RuleDetail selectedNodeId={nodeId} selectedRuleId={code} />
      </Box>
    </DashboardContent>
  );
}
