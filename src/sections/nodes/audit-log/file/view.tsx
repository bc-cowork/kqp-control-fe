'use client';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { grey } from 'src/theme/core';
import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { AuditLogFrame } from 'src/components/nodes/AuditLogFrame';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
  file: string;
  seq: string;
};

export function AuditLogFileView({ nodeId, file, seq }: Props) {
  const { t } = useTranslate('audit-frame-detail');
  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb
        node={nodeId}
        pages={[
          { pageName: t('top.audit_logs'), link: `/dashboard/nodes/${nodeId}/audit-log` },
          { pageName: t('top.list'), link: `/dashboard/nodes/${nodeId}/audit-log/${file}` },
          { pageName: t('top.detail') },
        ]}
      />
      <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[600], mt: 2 }}>
        {t('top.detail')}
      </Typography>
      <Box
        sx={{
          mt: '28px',
          width: 1,
        }}
      >
        <AuditLogFrame selectedNodeId={nodeId} selectedFile={file} selectedSeq={seq} />
      </Box>
    </DashboardContent>
  );
}
