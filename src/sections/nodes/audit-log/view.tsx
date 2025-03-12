'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { AuditLogList } from 'src/components/nodes/AuditLogList';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function AuditLogView({ nodeId }: Props) {
  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h3"> Audit Logs for {nodeId} </Typography>
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
