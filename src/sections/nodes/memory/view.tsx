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
    <DashboardContent maxWidth='xl'>
      <Breadcrumb node={nodeId} pages={[{ pageName: t('top.memory') }]} />
      <Typography sx={{ fontSize: 28, fontWeight: 600, color: (theme) => theme.palette.mode === 'dark' ? grey[50] : '#373F4E', mt: 2 }}>
        {t('top.memory')}
      </Typography>

      <Memory selectedNodeId={nodeId} />
    </DashboardContent>
  );
}
