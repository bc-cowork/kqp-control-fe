'use client';

import type { INodeItem } from 'src/types/dashboard';

import { Trans } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { T, ACCENT2, FONT_MONO } from 'src/theme/tokens';
import { useGetDiskMetrics } from 'src/actions/dashboard';

import { StatusBadge } from 'src/components/v5';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeParam: string;
  selectedNode: INodeItem;
};

export function NodeStatus({ selectedNodeParam, selectedNode }: Props) {
  const { diskMetricsData } = useGetDiskMetrics(selectedNodeParam);

  const { t } = useTranslate('dashboard');

  const isOnline = selectedNode.online_status;
  const diskUsage = Number(diskMetricsData?.disk_usage) || 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* Identity / status card */}
      <Box
        sx={{
          p: 1.75,
          borderRadius: '6px',
          bgcolor: T.bgCard,
          border: `1px solid ${T.border}`,
        }}
      >
        <Box sx={{ mb: 1.25 }}>
          <StatusBadge
            on={isOnline}
            labelOn={t('info.online')}
            labelOff={t('info.offline')}
          />
        </Box>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: 19, fontWeight: 500, color: T.textPrim, fontFamily: FONT_MONO }}>
            {selectedNode.id}
          </Typography>
          <Box sx={{ width: '1px', height: 12, bgcolor: T.border }} />
          <Typography sx={{ fontSize: 15, color: T.textSec }}>{selectedNode.name}</Typography>
        </Stack>

        <Typography sx={{ fontSize: 14, color: T.textDim }}>{selectedNode.desc}</Typography>
      </Box>

      {/* Emit metrics card */}
      <Box
        sx={{
          p: 1.75,
          borderRadius: '6px',
          bgcolor: T.bgCard,
          border: `1px solid ${T.border}`,
        }}
      >
        <Stack direction="row" alignItems="center" sx={{ mb: 1.5 }}>
          <Typography sx={{ width: '55%', fontSize: 15, color: T.textSec }}>
            {t('info.emittable')}
          </Typography>
          {selectedNode.emittable ? (
            <Typography sx={{ fontSize: 15, color: ACCENT2 }}>{t('info.true')}</Typography>
          ) : (
            <Typography sx={{ fontSize: 15, color: T.textDim }}>{t('info.false')}</Typography>
          )}
        </Stack>
        <Stack direction="row" alignItems="center">
          <Typography sx={{ width: '55%', fontSize: 15, color: T.textSec }}>
            {t('info.emit_count')}
          </Typography>
          <Typography sx={{ fontSize: 15, color: T.textPrim, fontFamily: FONT_MONO }}>
            {selectedNode.emit_count.toLocaleString()}
          </Typography>
        </Stack>
      </Box>

      {/* Disk usage card */}
      <Box
        sx={{
          p: 1.75,
          borderRadius: '6px',
          bgcolor: T.bgCard,
          border: `1px solid ${T.border}`,
        }}
      >
        <Typography sx={{ fontSize: 15, fontWeight: 500, color: T.textSec, mb: 0.5 }}>
          {t('disk.disk')}
        </Typography>
        <Typography sx={{ fontSize: 28, fontWeight: 400, color: T.textPrim, fontFamily: FONT_MONO }}>
          {diskUsage}%
        </Typography>
        <Typography sx={{ fontSize: 14, color: T.textDim, mb: 1 }}>
          <Trans
            i18nKey="disk.usage"
            ns="dashboard"
            values={{
              used: diskMetricsData?.disk_used_size,
              total: diskMetricsData?.disk_total_size,
            }}
            components={{
              mono: <Box component="span" sx={{ color: T.textSec, fontFamily: FONT_MONO }} />,
            }}
          />
        </Typography>

        {/* Progress bar */}
        <Box sx={{ position: 'relative', width: '100%', height: 10, borderRadius: 5, bgcolor: T.bgHover, overflow: 'hidden' }}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${Math.min(diskUsage, 100)}%`,
              bgcolor: diskUsage >= 90 ? T.off : T.primary,
              borderRadius: 5,
              transition: 'width .2s',
            }}
          />
          {/* Danger zone marker at 90% */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: '90%',
              width: '10%',
              height: '100%',
              bgcolor: `${T.off}33`,
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}
