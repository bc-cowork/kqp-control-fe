'use client';

import Box from '@mui/material/Box';

import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { AuditLogFrameList } from 'src/components/nodes/AuditLogFrameList';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
  file: string;
};

export function AuditFrameListView({ nodeId, file }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb node={nodeId} pages={['Audit Log', 'List']} />
      <Box
        sx={{
          mt: 5,
          width: 1,
        }}
      >
        <AuditLogFrameList selectedNodeId={nodeId} selectedFile={file} />
      </Box>
    </DashboardContent>
  );
}
