'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { AuditLogFrame } from 'src/components/nodes/AuditLogFrame';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
  file: string;
};

export function AuditLogFileView({ nodeId, file }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h3">
        {' '}
        Audit Log Frame for {nodeId} - {file}{' '}
      </Typography>
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
