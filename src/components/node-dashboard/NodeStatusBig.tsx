'use client';

import type { INodeItem } from 'src/types/dashboard';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { T } from 'src/theme/tokens';
import { useTranslate } from 'src/locales';
import { useGetDiskMetrics } from 'src/actions/dashboard';

import { DiskUsage } from 'src/components/dashboard/DiskUsage';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeParam: string;
  selectedNode: INodeItem;
  nodeStatusLoading: boolean;
  nodeStatusError?: any;
};

export function NodeStatusBig({
  selectedNodeParam,
  selectedNode,
  nodeStatusLoading,
  nodeStatusError,
}: Props) {
  const { t } = useTranslate('node-dashboard');

  const { diskMetricsData } = useGetDiskMetrics(selectedNodeParam);

  const online = selectedNode?.online_status;
  const sc = online ? T.on : T.offline;

  if (nodeStatusLoading) {
    return (
      <Box sx={{ border: `1px solid ${T.border}`, borderRadius: '8px', bgcolor: T.bgCard, p: 3, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: T.primary }} />
      </Box>
    );
  }

  if (nodeStatusError) {
    return (
      <Box sx={{ border: `1px solid ${T.border}`, borderRadius: '8px', bgcolor: T.bgCard, p: 3 }}>
        <Typography sx={{ color: T.off, fontSize: 15 }}>{t('errors.fetch_status')}</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Status card */}
      <Box sx={{ border: `1px solid ${T.border}`, borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
        {/* Header strip */}
        <Box
          sx={{
            p: '14px 16px',
            background: online ? 'linear-gradient(135deg, #9384FF2E, #9384FF10)' : T.offlineBg,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: 13,
              fontWeight: 600,
              p: '2px 8px',
              borderRadius: '3px',
              letterSpacing: '0.04em',
              background: `${sc}26`,
              color: sc,
              border: `1px solid ${sc}55`,
            }}
          >
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'currentColor' }} />
            {online ? 'ON' : 'OFF'}
          </Box>

          <Box sx={{ mt: '10px', fontSize: 17 }}>
            <Box component="span" sx={{ fontWeight: 500, color: T.textPrim }}>
              {selectedNode.id}
            </Box>
            {selectedNode.name && (
              <Box component="span" sx={{ color: T.textSec }}> | {selectedNode.name}</Box>
            )}
          </Box>

          {selectedNode.desc && (
            <Typography sx={{ fontSize: 15, color: T.textSec, mt: '2px' }}>{selectedNode.desc}</Typography>
          )}
        </Box>

        {/* Body rows */}
        <Box sx={{ p: '12px 16px', bgcolor: T.bgCard, display: 'flex', flexDirection: 'column', gap: '9px' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ fontSize: 15 }}>
            <Typography sx={{ fontSize: 15, color: T.textSec }}>{t('left_side.emitable')}</Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 500, color: selectedNode.emittable ? T.on : T.off }}>
              {selectedNode.emittable ? t('left_side.true') : t('left_side.false')}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ fontSize: 15 }}>
            <Typography sx={{ fontSize: 15, color: T.textSec }}>{t('left_side.emit_count')}</Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 500, color: T.textSec }}>
              {selectedNode.emit_count.toLocaleString()}
            </Typography>
          </Stack>
        </Box>
      </Box>

      {/* Disk card */}
      <Box sx={{ border: `1px solid ${T.border}`, borderRadius: '8px', p: '14px 16px', bgcolor: T.bgCard, flexShrink: 0 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 500, color: T.textSec, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {t('left_side.disk_usage')}
        </Typography>
        {online && diskMetricsData?.disk_total_size ? (
          <DiskUsage used={Number(diskMetricsData.disk_used_size)} total={Number(diskMetricsData.disk_total_size)} />
        ) : (
          <Typography sx={{ fontSize: 15, color: T.textDim, mt: '10px' }}>데이터 없음</Typography>
        )}
      </Box>
    </>
  );
}
