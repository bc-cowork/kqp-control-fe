'use client';

import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import { grey } from 'src/theme/core';
import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { MemoryItem } from 'src/components/nodes/MemoryItem';
import { Breadcrumb } from 'src/components/common/Breadcrumb';

// ----------------------------------------------------------------------

type Props = {
  nodeId: string;
  code: string;
};

export function MemoryItemView({ nodeId, code }: Props) {
  const { t } = useTranslate('memory');
  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb
        node={nodeId}
        pages={[
          { pageName: t('top.memory'), link: `/dashboard/nodes/${nodeId}/memory` },
          { pageName: t('top.memory_item') },
        ]}
      />
      <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[50], mt: 2 }}>
        {t('top.memory_item')}
      </Typography>
      <Box
        sx={{
          mt: '28px',
          width: 1,
        }}
      >
        <MemoryItem selectedNodeId={nodeId} code={code} />
      </Box>
    </DashboardContent>
  );
}
