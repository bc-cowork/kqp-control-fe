'use client';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { grey } from 'src/theme/core';
import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Memory } from 'src/components/nodes/Memory';
import { Breadcrumb } from 'src/components/common/Breadcrumb';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
};

export function MemoryView({ nodeId }: Props) {
  const { t } = useTranslate('memory');
  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb node={nodeId} pages={[{ pageName: t('top.memory') }]} />
      <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[50], mt: 2 }}>
        {t('top.memory')}
      </Typography>
      <Box
        sx={{
          mt: '28px',
          width: 1,
        }}
      >
        <Memory selectedNodeId={nodeId} />
      </Box>
    </DashboardContent>
  );
}
