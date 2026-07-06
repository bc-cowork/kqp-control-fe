'use client';

import type { Column } from 'src/components/v5';

import useSWR from 'swr';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { T, ACCENT2, FONT_MONO } from 'src/theme/tokens';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { CodeBlock, DataTable, PageShell, StatusBadge } from 'src/components/v5';

// ----------------------------------------------------------------------

// Detail action button (edit / delete) — ghost outline, red text for delete
const detailBtnSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 1,
  height: 32,
  px: '14px',
  bgcolor: T.bgCard,
  border: `1px solid ${T.border}`,
  borderRadius: '8px',
  fontSize: 15,
  fontFamily: 'inherit',
  cursor: 'pointer',
} as const;

// ----------------------------------------------------------------------

type Props = {
  params: {
    node: string;
    'alert-list': string;
  };
};

// ----------------------------------------------------------------------

export default function Page({ params }: Props) {
  const { node, 'alert-list': alertId } = params;
  const { t } = useTranslate('alert-list');
  const router = useRouter();
  const decodedAlertId = decodeURIComponent(alertId);

  const { data, isLoading, error } = useSWR(
    endpoints.alert.detail(node, decodedAlertId),
    fetcher
  );

  const detail = data?.data?.alert;
  const alertCode = data?.data?.script || '';
  const isActive = detail?.status === 'active';

  // Extract filename from first line of script (e.g. "-- alert_A351SQ.moon")
  const scriptFileName = (() => {
    const firstLine = alertCode.split('\n')[0] || '';
    const match = firstLine.match(/^--\s*(.+\.moon)/);
    return match ? match[1] : `${detail?.name || 'script'}.moon`;
  })();

  const handleEdit = useCallback(() => {
    router.push(paths.dashboard.nodes.alertsEdit(node, decodedAlertId));
  }, [router, node, decodedAlertId]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm(t('detail.delete_confirm'))) return;
    try {
      await axiosInstance.delete(endpoints.alert.delete(node, decodedAlertId));
      toast.success(t('detail.delete_success'));
      router.push(paths.dashboard.nodes.alertsList(node));
    } catch {
      toast.error(t('detail.delete_error'));
    }
  }, [t, node, decodedAlertId, router]);

  const scheduleText = detail?.schedule_days || '';

  const crumbs = [
    { label: t('top.title'), onClick: () => router.push(paths.dashboard.nodes.alertsList(node)) },
    { label: decodedAlertId },
  ];

  // ---- placeholder states ----
  if (isLoading || error || !detail) {
    return (
      <PageShell node={node} crumbs={crumbs} title={`${t('top.title_prefix')}: ${decodedAlertId}`}>
        <Typography sx={{ mt: 2, color: error ? T.off : T.textDim, fontSize: 15 }}>
          {isLoading ? t('loading') : error ? t('detail.error') : t('detail.empty')}
        </Typography>
      </PageShell>
    );
  }

  // ---- summary table ----
  const columns: Column<any>[] = [
    { key: 'name', label: t('table.surv_name'), mono: true, color: T.accent, render: (r) => r.name },
    {
      key: 'schedule',
      label: t('table.schedule'),
      color: T.textSec,
      render: () => scheduleText || '—',
    },
    {
      key: 'start_at',
      label: t('table.start_at'),
      mono: true,
      color: T.textSec,
      render: (r) => r.start_at || '—',
    },
    {
      key: 'end_at',
      label: t('table.end_at'),
      mono: true,
      color: T.textSec,
      render: (r) => r.end_at || '—',
    },
    {
      key: 'interval',
      label: t('table.interval'),
      mono: true,
      color: T.textSec,
      render: (r) => (r.interval_sec ?? '—'),
    },
    {
      key: 'status',
      label: t('table.status'),
      align: 'right',
      render: () => (
        <StatusBadge
          on={isActive}
          labelOn={t('detail.badge_active')}
          labelOff={t('detail.badge_inactive')}
          color={ACCENT2}
        />
      ),
    },
  ];

  // ---- info rows ----
  const infoRows: { label: string; value: string; isStatus?: boolean }[] = [
    { label: t('detail.item_name'), value: detail.name },
    { label: t('detail.desc'), value: detail.desc || '-' },
    {
      label: t('detail.schedule'),
      value: scheduleText || '-',
    },
    {
      label: t('detail.timezone'),
      value: `${detail.start_at || '-'} ~ ${detail.end_at || '-'}, ${t('detail.interval_fmt', { interval: detail.interval_sec ?? '-' })}`,
    },
    {
      label: t('detail.status'),
      value: isActive ? t('detail.badge_active') : t('detail.badge_inactive'),
      isStatus: true,
    },
    { label: t('detail.script_file'), value: scriptFileName },
  ];

  return (
    <PageShell
      node={node}
      crumbs={crumbs}
      title={`${t('top.title_prefix')}: ${decodedAlertId}`}
      scroll={false}
    >
      <Stack sx={{ flex: 1, minHeight: 0, gap: 1.75 }}>
        {/* Summary table (single row) */}
        <DataTable<any> headerVariant="light" columns={columns} rows={[detail]} />

        {/* Two columns — split 5 / 7 */}
        <Stack direction="row" gap={2} alignItems="stretch" sx={{ flex: 1, minHeight: 0 }}>
          {/* Left — info + actions */}
          <Stack sx={{ flex: 5, minWidth: 0, minHeight: 0 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 500, color: T.textSec, mb: 1 }}>
              {t('detail.info_title')}
            </Typography>
            <Box
              sx={{
                border: `1px solid ${T.border}`,
                borderRadius: '8px',
                overflow: 'hidden',
                bgcolor: T.bgCard,
                flexShrink: 0,
              }}
            >
              <Stack sx={{ p: 2, gap: 1.75 }}>
                {infoRows.map((row) => (
                  <Stack key={row.label} direction="row" gap={2} alignItems="flex-start">
                    <Typography sx={{ width: 96, flexShrink: 0, color: T.textSec, fontSize: 14 }}>
                      {row.label}
                    </Typography>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {row.isStatus ? (
                        <Box
                          component="span"
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.75,
                            fontSize: 15,
                            color: isActive ? T.on : T.off,
                          }}
                        >
                          <Box
                            sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'currentColor' }}
                          />
                          {row.value}
                        </Box>
                      ) : (
                        <Typography
                          sx={{
                            color: T.textPrim,
                            fontSize: 15,
                            lineHeight: 1.5,
                            wordBreak: 'break-word',
                          }}
                        >
                          {row.value}
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Box>

            <Stack direction="row" gap={1} sx={{ mt: 1.5, flexShrink: 0 }}>
              <Box component="button" type="button" onClick={handleEdit} sx={{ ...detailBtnSx, color: T.textSec }}>
                <Iconify icon="solar:pen-linear" width={13} />
                {t('detail.btn_edit')}
              </Box>
              <Box component="button" type="button" onClick={handleDelete} sx={{ ...detailBtnSx, color: T.off }}>
                {t('detail.btn_delete')}
              </Box>
            </Stack>
          </Stack>

          {/* Right — script viewer */}
          <Stack sx={{ flex: 7, minWidth: 0, minHeight: 0 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 500, color: T.textSec, mb: 1 }}>
              {t('alert')}
            </Typography>
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                display: 'flex',
                flexDirection: 'column',
                border: `1px solid ${T.border}`,
                borderRadius: '8px',
                overflow: 'hidden',
                bgcolor: '#161420',
              }}
            >
              <Typography sx={{ fontFamily: FONT_MONO, fontSize: 13, color: T.textDim, px: '16px', py: '10px', borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
                -- {scriptFileName}
              </Typography>
              <CodeBlock theme="moon" fill flush>{alertCode}</CodeBlock>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </PageShell>
  );
}
