'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { AuditLogFrameList } from 'src/components/nodes/AuditLogFrameList';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
  file: string;
};

export function AuditFrameListView({ nodeId, file }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h3">
        Audit Frame List for {nodeId} - {file}{' '}
      </Typography>
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
