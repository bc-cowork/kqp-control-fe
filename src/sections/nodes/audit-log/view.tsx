'use client';

import Box from '@mui/material/Box';

import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { AuditLogList } from 'src/components/nodes/AuditLogList';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function AuditLogView({ nodeId }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb node={nodeId} pages={[{ pageName: 'Audit Logs' }]} />
      <Box
        sx={{
          mt: 5,
          width: 1,
        }}
      >
        <AuditLogList selectedNodeId={nodeId} />
      </Box>
    </DashboardContent>
  );
}
