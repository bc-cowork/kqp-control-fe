'use client';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { grey } from 'src/theme/core';
import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { AuditLogFrameList } from 'src/components/nodes/AuditLogFrameList';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
  file: string;
};

export function AuditFrameListView({ nodeId, file }: Props) {
  const { t } = useTranslate('audit-frame-list');
  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb
        node={nodeId}
        pages={[
          { pageName: t('top.audit_logs'), link: `/dashboard/nodes/${nodeId}/audit-log` },
          { pageName: file },
        ]}
      />
      <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[50], mt: 2 }}>
        {file}
      </Typography>
      <Box
        sx={{
          mt: '28px',
          width: 1,
        }}
      >
        <AuditLogFrameList selectedNodeId={nodeId} selectedFile={file} />
      </Box>
    </DashboardContent>
  );
}
