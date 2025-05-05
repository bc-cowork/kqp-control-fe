'use client';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { grey } from 'src/theme/core';
import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { AuditLogList } from 'src/components/nodes/AuditLogList';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function AuditLogView({ nodeId }: Props) {
  const { t } = useTranslate('audit-list');
  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb node={nodeId} pages={[{ pageName: t('top.audit_logs') }]} />
      <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[600], mt: 2 }}>
        {t('top.audit_logs')}
      </Typography>
      <Box
        sx={{
          mt: '28px',
          width: 1,
        }}
      >
        <AuditLogList selectedNodeId={nodeId} />
      </Box>
    </DashboardContent>
  );
}
