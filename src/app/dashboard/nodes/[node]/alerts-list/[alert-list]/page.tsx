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
import {
  Panel,
  BtnGhost,
  BtnDanger,
  CodeBlock,
  DataTable,
  PageShell,
  StatusBadge,
} from 'src/components/v5';

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
    { key: 'name', label: t('table.alert_name'), color: ACCENT2, render: (r) => r.name },
    {
      key: 'schedule',
      label: t('table.schedule'),
      mono: true,
      color: T.textSec,
      render: () => scheduleText || '—',
    },
    { key: 'start_at', label: t('table.start_at'), mono: true, render: (r) => r.start_at || '—' },
    { key: 'end_at', label: t('table.end_at'), mono: true, render: (r) => r.end_at || '—' },
    {
      key: 'interval',
      label: t('table.interval'),
      mono: true,
      render: (r) => (r.interval_sec ?? '—'),
    },
    {
      key: 'status',
      label: t('table.status'),
      render: () => (
        <StatusBadge on={isActive} labelOn={t('detail.active')} labelOff={t('detail.stopped')} />
      ),
    },
  ];

  // ---- info rows ----
  const infoRows: { label: string; value: string; isStatus?: boolean }[] = [
    { label: t('detail.item_name'), value: detail.name },
    { label: t('detail.desc'), value: detail.desc || '-' },
    {
      label: t('detail.schedule'),
      value: scheduleText ? `${scheduleText} — ${t('detail.crontab')}: ${scheduleText}` : '-',
    },
    {
      label: t('detail.timezone'),
      value: `${detail.start_at || '-'} ~ ${detail.end_at || '-'}, ${detail.interval_sec ?? '-'} ${t('form.interval_suffix')}`,
    },
    {
      label: t('detail.status'),
      value: isActive ? t('detail.active') : t('detail.stopped'),
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

        {/* Two columns */}
        <Stack direction="row" gap={1.75} sx={{ flex: 1, minHeight: 0 }}>
          {/* Left — info + actions */}
          <Stack sx={{ flex: 5, minWidth: 0, gap: 1.75 }}>
            <Panel>
              <Box sx={{ px: 2, py: 1.25, bgcolor: T.bgHover, borderBottom: `1px solid ${T.border}` }}>
                <Typography sx={{ color: T.textPrim, fontSize: 16, fontWeight: 500 }}>
                  {t('detail.info_title')}
                </Typography>
              </Box>
              <Stack sx={{ px: 2.5, py: 2.5, gap: 2 }}>
                {infoRows.map((row) => (
                  <Stack key={row.label} direction="row" gap={2} alignItems="flex-start">
                    <Typography
                      sx={{ width: 96, flexShrink: 0, color: T.textSec, fontSize: 14, pt: '1px' }}
                    >
                      {row.label}
                    </Typography>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {row.isStatus ? (
                        <StatusBadge on={isActive} labelOn={row.value} labelOff={row.value} />
                      ) : (
                        <Typography sx={{ color: T.textPrim, fontSize: 15 }}>{row.value}</Typography>
                      )}
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Panel>

            <Stack direction="row" gap={1.25}>
              <BtnGhost icon="eva:edit-outline" onClick={handleEdit}>
                {t('detail.btn_edit')}
              </BtnGhost>
              <BtnDanger icon="eva:trash-2-outline" onClick={handleDelete}>
                {t('detail.btn_delete')}
              </BtnDanger>
            </Stack>
          </Stack>

          {/* Right — script viewer */}
          <Panel sx={{ flex: 7, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ px: 2, py: 1.25, bgcolor: T.bgHover, borderBottom: `1px solid ${T.border}` }}>
              <Typography sx={{ color: T.textDim, fontSize: 14, fontFamily: FONT_MONO }}>
                -- {scriptFileName}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minHeight: 0, p: 1.75, overflow: 'auto' }}>
              <CodeBlock theme="moon">{alertCode}</CodeBlock>
            </Box>
          </Panel>
        </Stack>
      </Stack>
    </PageShell>
  );
}
