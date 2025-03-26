'use client';

import Box from '@mui/material/Box';

import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { AuditLogFrame } from 'src/components/nodes/AuditLogFrame';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
  file: string;
};

export function AuditLogFileView({ nodeId, file }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb
        node={nodeId}
        pages={[
          { pageName: 'Audit Log', link: `/dashboard/nodes/${nodeId}/audit-log` },
          { pageName: 'List', link: `/dashboard/nodes/${nodeId}/audit-log/${file}/list` },
          { pageName: 'Frame Detail' },
        ]}
      />
      <Box
        sx={{
          mt: 5,
          width: 1,
        }}
      >
        <AuditLogFrame selectedNodeId={nodeId} selectedFile={file} />
      </Box>
    </DashboardContent>
  );
}
