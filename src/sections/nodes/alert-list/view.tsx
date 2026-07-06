'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { T, ACCENT2, FONT_MONO } from 'src/theme/tokens';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { PageShell, StatusBadge, BtnPrimary } from 'src/components/v5';

// ----------------------------------------------------------------------

type AlertItem = {
  name: string;
  status: 'active' | 'inactive';
  desc?: string;
  schedule_days?: string;
  start_at?: string;
  end_at?: string;
  interval_sec?: number;
  last_exec_at?: string;
  url?: string;
};

type Props = { nodeId: string };

// ----------------------------------------------------------------------

type AlertRowProps = { item: AlertItem; nodeId: string; t: (key: string) => string; onDeleted: () => void };

function AlertRow({ item, nodeId, t, onDeleted }: AlertRowProps) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const isActive = item.status === 'active';

  const columns = [
    { label: t('table.start_at'), value: item.start_at ?? '00:00' },
    { label: t('table.end_at'), value: item.end_at ?? '00:00' },
    { label: t('table.interval'), value: String(item.interval_sec ?? 0) },
    { label: t('table.last_exec'), value: item.last_exec_at ?? '-' },
  ];

  const cellBase = {
    flex: '1 1 0',
    minWidth: 120,
    px: 1.5,
    display: 'flex',
    alignItems: 'center',
    height: 34,
    borderRight: `1px solid ${T.border}`,
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(t('detail.delete_confirm'))) return;
    try {
      await axiosInstance.delete(endpoints.alert.delete(nodeId, item.name));
      toast.success(t('detail.delete_success'));
      onDeleted();
    } catch {
      toast.error(t('detail.delete_error'));
    }
  };

  return (
    <Box sx={{ borderBottom: `1px solid ${T.borderSub}` }}>
      {/* Row header */}
      <Stack
        onClick={() => router.push(paths.dashboard.nodes.alertsDetail(nodeId, item.name))}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 2, cursor: 'pointer', '&:hover': { bgcolor: T.bgHover } }}
      >
        {/* Left: lead icon + name + status + description */}
        <Stack direction="row" alignItems="center" gap={2} sx={{ flex: 1, py: 1.75 }}>
          <Iconify icon="solar:file-text-linear" width={18} sx={{ color: T.textDim, flexShrink: 0 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Typography sx={{ color: T.textPrim, fontSize: 17, fontFamily: FONT_MONO }}>
                {item.name}
              </Typography>
              <StatusBadge on={isActive} labelOn={t('detail.active')} labelOff={t('detail.stopped')} color={ACCENT2} />
            </Stack>
            {item.desc && (
              <Typography sx={{ color: T.textSec, fontSize: 13, mt: 0.5 }}>{item.desc}</Typography>
            )}
          </Box>
        </Stack>

        {/* Right: filename + expand chevron */}
        <Stack direction="row" alignItems="center" gap={2} sx={{ flexShrink: 0 }}>
          <Typography sx={{ color: T.textDim, fontSize: 13, fontFamily: FONT_MONO }}>
            {item.name}
          </Typography>
          <Box
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((p) => !p);
            }}
            sx={{ px: 0.5, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <Iconify
              icon="eva:chevron-down-fill"
              width={22}
              sx={{
                color: T.textDim,
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </Box>
        </Stack>
      </Stack>

      {/* Expanded schedule grid */}
      <Collapse in={expanded} unmountOnExit>
        <Stack direction="row" alignItems="stretch" sx={{ pl: 6, bgcolor: T.bg }}>
          {/* 4-column mini table */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Header row */}
            <Stack direction="row">
              {columns.map((col) => (
                <Box key={col.label} sx={{ ...cellBase, borderBottom: `1px solid ${T.border}` }}>
                  <Typography sx={{ color: T.textDim, fontSize: 15 }}>{col.label}</Typography>
                </Box>
              ))}
            </Stack>
            {/* Value row */}
            <Stack direction="row">
              {columns.map((col) => (
                <Box key={col.label} sx={cellBase}>
                  <Typography sx={{ color: T.textPrim, fontSize: 15, fontFamily: FONT_MONO }}>
                    {col.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Edit cell */}
          <Box
            onClick={(e) => {
              e.stopPropagation();
              router.push(paths.dashboard.nodes.alertsEdit(nodeId, item.name));
            }}
            sx={{
              width: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: `1px solid ${T.border}`,
              cursor: 'pointer',
              color: T.textDim,
              '&:hover': { color: ACCENT2, bgcolor: T.bgHover },
            }}
          >
            <Iconify icon="eva:edit-outline" width={22} />
          </Box>

          {/* Delete cell */}
          <Box
            onClick={handleDelete}
            sx={{
              width: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: T.textDim,
              '&:hover': { color: T.off, bgcolor: T.bgHover },
            }}
          >
            <Iconify icon="eva:trash-2-outline" width={22} />
          </Box>
        </Stack>
      </Collapse>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function AlertListView({ nodeId }: Props) {
  const { t } = useTranslate('alert-list');
  const router = useRouter();

  const { data, isLoading, mutate } = useSWR(endpoints.alert.list(nodeId), fetcher);
  const rows: AlertItem[] = data?.data?.list ?? [];

  const goAdd = () => router.push(paths.dashboard.nodes.alertsAdd(nodeId));

  return (
    <PageShell
      node={nodeId}
      crumbs={[{ label: t('top.title') }]}
      title={t('top.title')}
      actions={
        <BtnPrimary icon="eva:plus-fill" onClick={goAdd}>
          {t('btn.add')}
        </BtnPrimary>
      }
    >
      <Box
        sx={{
          border: `1px solid ${T.border}`,
          borderRadius: '8px',
          overflow: 'hidden',
          bgcolor: T.bgCard,
        }}
      >
        {/* Header band */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 2,
            py: 1.25,
            bgcolor: T.bgHover,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography sx={{ color: T.textPrim, fontSize: 16, fontWeight: 500 }}>
              {t('list.watch_items')}
            </Typography>
            <Typography sx={{ color: T.textDim, fontSize: 14, fontFamily: FONT_MONO }}>
              ({rows.length})
            </Typography>
          </Stack>
          <BtnPrimary icon="eva:plus-fill" onClick={goAdd}>
            {t('btn.add')}
          </BtnPrimary>
        </Stack>

        {/* List body */}
        <Box sx={{ '& > div:last-of-type': { borderBottom: 'none' } }}>
          {isLoading && (
            <Typography sx={{ p: 2, color: T.textDim, fontSize: 15 }}>{t('loading')}</Typography>
          )}
          {!isLoading && rows.length === 0 && (
            <Typography sx={{ p: 2, color: T.textDim, fontSize: 15 }}>{t('empty')}</Typography>
          )}
          {rows.map((row) => (
            <AlertRow key={row.name} item={row} nodeId={nodeId} t={t} onDeleted={mutate} />
          ))}
        </Box>
      </Box>
    </PageShell>
  );
}
