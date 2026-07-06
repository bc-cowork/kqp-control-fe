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
import { PageShell, BtnPrimary, StatusBadge } from 'src/components/v5';

// ----------------------------------------------------------------------

type AlertItem = {
  name: string;
  status: 'active' | 'inactive';
  desc?: string;
  file?: string;
  schedule_days?: string;
  start_at?: string;
  end_at?: string;
  interval_sec?: number;
  last_exec_at?: string;
  url?: string;
};

type Props = { nodeId: string };

// ----------------------------------------------------------------------

type AlertRowProps = {
  item: AlertItem;
  nodeId: string;
  t: (key: string) => string;
  onDeleted: () => void;
  isLast: boolean;
};

function AlertRow({ item, nodeId, t, onDeleted, isLast }: AlertRowProps) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const isActive = item.status === 'active';
  const fileName = item.file ?? item.name;

  const columns = [
    { label: t('expand.start_at'), value: item.start_at ?? '00:00' },
    { label: t('expand.end_at'), value: item.end_at ?? '00:00' },
    { label: t('expand.interval'), value: String(item.interval_sec ?? 0) },
    { label: t('expand.last_exec'), value: item.last_exec_at ?? '-' },
  ];

  const headCell = {
    flex: '1 0 0',
    minWidth: 116,
    boxSizing: 'border-box' as const,
    borderBottom: `1px solid ${T.border}`,
    borderRight: `1px solid ${T.border}`,
    p: '8px 12px',
    fontSize: 15,
    color: T.textDim,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
  const dataCell = {
    flex: '1 0 0',
    minWidth: 116,
    boxSizing: 'border-box' as const,
    borderRight: `1px solid ${T.border}`,
    p: '8px 12px',
    fontSize: 15,
    fontFamily: FONT_MONO,
    color: T.textPrim,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
  const iconCell = {
    width: 76,
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: T.textDim,
    '&:hover': { bgcolor: T.bgHover },
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
    <Box sx={{ borderBottom: isLast ? 'none' : `1px solid ${T.borderSub}` }}>
      {/* Row header */}
      <Stack
        onClick={() => router.push(paths.dashboard.nodes.alertsDetail(nodeId, item.name))}
        direction="row"
        alignItems="center"
        gap={1.75}
        sx={{
          px: 2,
          py: 1.5,
          cursor: 'pointer',
          transition: 'background .12s',
          bgcolor: expanded ? T.bgHover : 'transparent',
          '&:hover': { bgcolor: T.bgHover },
        }}
      >
        {/* Lead file icon */}
        <Iconify icon="solar:file-linear" width={16} sx={{ color: T.textDim, flexShrink: 0 }} />

        {/* Name + status + description */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" gap={1.25} sx={{ mb: '3px' }}>
            <Typography sx={{ color: T.textPrim, fontSize: 17, fontFamily: FONT_MONO }}>
              {item.name}
            </Typography>
            <StatusBadge
              on={isActive}
              labelOn={t('detail.badge_active')}
              labelOff={t('detail.badge_inactive')}
              color={ACCENT2}
            />
          </Stack>
          <Typography sx={{ color: T.textSec, fontSize: 15, fontWeight: 350 }}>
            {item.desc}
          </Typography>
        </Box>

        {/* Filename */}
        <Typography sx={{ color: T.textDim, fontSize: 15, fontFamily: FONT_MONO, mr: 0.75 }}>
          {fileName}
        </Typography>

        {/* Expand chevron */}
        <Box
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((p) => !p);
          }}
          sx={{
            width: 26,
            height: 26,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#667085',
          }}
        >
          <Iconify
            icon="eva:chevron-down-fill"
            width={22}
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          />
        </Box>
      </Stack>

      {/* Expanded schedule grid */}
      <Collapse in={expanded} unmountOnExit>
        <Stack
          direction="row"
          alignItems="stretch"
          sx={{ bgcolor: T.bg, borderTop: `1px solid ${T.border}` }}
        >
          {/* 4-column mini table */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Header row */}
            <Stack direction="row">
              {columns.map((col) => (
                <Box key={col.label} sx={headCell}>
                  {col.label}
                </Box>
              ))}
            </Stack>
            {/* Value row */}
            <Stack direction="row">
              {columns.map((col) => (
                <Box key={col.label} sx={dataCell}>
                  {col.value}
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
            sx={{ ...iconCell, borderRight: `1px solid ${T.border}` }}
          >
            <Iconify icon="eva:edit-outline" width={14} />
          </Box>

          {/* Delete cell */}
          <Box onClick={handleDelete} sx={iconCell}>
            <Iconify icon="eva:trash-2-outline" width={14} />
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
    <PageShell node={nodeId} crumbs={[{ label: t('top.title') }]} title={t('top.title')}>
      <Box
        sx={{
          border: `1px solid ${T.border}`,
          borderRadius: '8px',
          overflow: 'hidden',
          bgcolor: T.bgCard,
          flexShrink: 0,
        }}
      >
        {/* Header band */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 2,
            py: '11px',
            bgcolor: T.bgHover,
            borderBottom: `1px solid ${T.border}`,
          }}
        >
          <Typography sx={{ color: T.textPrim, fontSize: 16, fontWeight: 500 }}>
            {t('list.watch_items')}
          </Typography>
          <BtnPrimary icon="eva:plus-fill" onClick={goAdd}>
            {t('btn.add')}
          </BtnPrimary>
        </Stack>

        {/* List body */}
        <Box>
          {isLoading && (
            <Typography sx={{ p: 2, color: T.textDim, fontSize: 15 }}>{t('loading')}</Typography>
          )}
          {!isLoading && rows.length === 0 && (
            <Typography sx={{ p: 2, color: T.textDim, fontSize: 15 }}>{t('empty')}</Typography>
          )}
          {rows.map((row, i) => (
            <AlertRow
              key={row.name}
              item={row}
              nodeId={nodeId}
              t={t}
              onDeleted={mutate}
              isLast={i === rows.length - 1}
            />
          ))}
        </Box>
      </Box>
    </PageShell>
  );
}
