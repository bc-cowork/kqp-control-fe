'use client';

import type { INodeItem } from 'src/types/dashboard';

import { Trans } from 'react-i18next';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useTranslate } from 'src/locales';
import { useGetDiskMetrics } from 'src/actions/dashboard';

import { T, FONT_MONO } from 'src/theme/tokens';
import { Panel, StatusBadge } from 'src/components/v5';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeParam: string;
  selectedNode: INodeItem;
  nodeStatusLoading: boolean;
  nodeStatusError?: any;
};

const DISK_SEGMENTS = 24;

export function NodeStatusBig({
  selectedNodeParam,
  selectedNode,
  nodeStatusLoading,
  nodeStatusError,
}: Props) {
  const { t } = useTranslate('node-dashboard');

  const { diskMetricsData } = useGetDiskMetrics(selectedNodeParam);

  const isOnline = selectedNode?.online_status;
  const diskUsage = diskMetricsData?.disk_usage ?? 0;
  const filledSegments = Math.round((Math.min(Math.max(diskUsage, 0), 100) / 100) * DISK_SEGMENTS);

  if (nodeStatusLoading) {
    return (
      <Panel sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: T.primary }} />
      </Panel>
    );
  }

  if (nodeStatusError) {
    return (
      <Panel sx={{ p: 3 }}>
        <Typography sx={{ color: T.off, fontSize: 15 }}>{t('errors.fetch_status')}</Typography>
      </Panel>
    );
  }

  return (
    <Stack spacing={1.75}>
      {/* Status card */}
      <Panel>
        {/* Header strip */}
        <Box sx={{ p: 2, borderBottom: `1px solid ${T.border}`, bgcolor: T.bgCard }}>
          <StatusBadge on={isOnline} labelOn={t('left_side.online')} labelOff={t('left_side.offline')} />

          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.5 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 500, color: T.textPrim }}>
              {selectedNode.id}
            </Typography>
            {selectedNode.name && (
              <>
                <Box sx={{ width: '1px', height: 14, bgcolor: T.border }} />
                <Typography sx={{ fontSize: 15, color: T.textSec }}>
                  {selectedNode.name}
                </Typography>
              </>
            )}
          </Stack>

          {selectedNode.desc && (
            <Typography sx={{ mt: 0.75, fontSize: 14, color: T.textDim }}>
              {selectedNode.desc}
            </Typography>
          )}
        </Box>

        {/* Body rows */}
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
            <Typography sx={{ fontSize: 15, color: T.textSec }}>{t('left_side.emitable')}</Typography>
            <Typography
              sx={{ fontSize: 15, fontWeight: 500, color: selectedNode.emittable ? T.on : T.off }}
            >
              {selectedNode.emittable ? t('left_side.true') : t('left_side.false')}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography sx={{ fontSize: 15, color: T.textSec }}>{t('left_side.emit_count')}</Typography>
            <Typography sx={{ fontSize: 15, fontFamily: FONT_MONO, color: T.textPrim }}>
              {selectedNode.emit_count.toLocaleString()}
            </Typography>
          </Stack>
        </Box>
      </Panel>

      {/* Disk card */}
      <Panel sx={{ p: 2, bgcolor: T.bgCard }}>
        <Typography sx={{ fontSize: 15, color: T.textSec }}>{t('left_side.disk_usage')}</Typography>
        <Typography sx={{ fontSize: 28, fontWeight: 500, color: T.textPrim, lineHeight: 1.4 }}>
          {diskUsage}%
        </Typography>
        <Typography sx={{ fontSize: 14, color: T.textDim, mb: 1.5 }}>
          <Trans
            t={t}
            i18nKey="left_side.disk_detail"
            values={{
              used: diskMetricsData?.disk_used_size,
              total: diskMetricsData?.disk_total_size,
            }}
            components={{
              mono: <Box component="span" sx={{ color: T.textSec, fontFamily: FONT_MONO }} />,
            }}
          />
        </Typography>

        {/* Segmented bar */}
        <Stack direction="row" spacing={0.5}>
          {Array.from({ length: DISK_SEGMENTS }).map((_, i) => (
            <Box
              key={i}
              sx={{
                flex: 1,
                height: 10,
                borderRadius: '2px',
                bgcolor: i < filledSegments ? T.primary : T.bgHover,
              }}
            />
          ))}
        </Stack>
      </Panel>
    </Stack>
  );
}
