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
      <Breadcrumb node={nodeId} pages={['Audit Log', 'List', 'Frame Detail']} />
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
