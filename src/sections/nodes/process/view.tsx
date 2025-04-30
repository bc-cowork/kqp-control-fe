'use client';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { grey } from 'src/theme/core';
import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/common/Breadcrumb';
import { ProcessDetail } from 'src/components/nodes/ProcessDetail';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function ProcessView({ nodeId }: Props) {
  const { t } = useTranslate('process');
  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb node={nodeId} pages={[{ pageName: 'Process' }]} />
      <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[600], mt: 2 }}>
        {t('top.process')}
      </Typography>
      <Box
        sx={{
          mt: '28px',
          width: 1,
        }}
      >
        <ProcessDetail selectedNodeId={nodeId} />
      </Box>
    </DashboardContent>
  );
}
