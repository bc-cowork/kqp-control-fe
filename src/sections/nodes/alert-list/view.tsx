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
    color: T.textSec,
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
    transition: 'background .12s, color .12s',
    '&:hover': { bgcolor: T.bgCard, color: T.textPrim },
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          bgcolor: expanded ? T.bgHover : 'transparent',
        }}
      >
        {/* Navigation area — hover highlights only this region */}
        <Stack
          onClick={() => router.push(paths.dashboard.nodes.alertsDetail(nodeId, item.name))}
          direction="row"
          alignItems="center"
          gap={1.75}
          sx={{
            flex: 1,
            minWidth: 0,
            px: 2,
            py: 1.5,
            cursor: 'pointer',
            transition: 'background .12s',
            '&:hover': { bgcolor: T.bgHover },
          }}
        >
          {/* Lead file icon */}
          <Iconify icon="solar:file-linear" width={16} sx={{ color: T.textDim, flexShrink: 0 }} />

          {/* Name + status + description */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" gap={1.25} sx={{ mb: '3px' }}>
              <Typography sx={{ color: T.textPrim, fontSize: 16, fontWeight: 300, fontFamily: FONT_MONO }}>
                {item.name}
              </Typography>
              <StatusBadge
                on={isActive}
                labelOn={t('detail.badge_active')}
                labelOff={t('detail.badge_inactive')}
                color={ACCENT2}
              />
            </Stack>
            <Typography sx={{ color: T.textSec, fontSize: 15 }}>
              {item.desc}
            </Typography>
          </Box>

          {/* Filename */}
          <Typography sx={{ color: T.textDim, fontSize: 15, fontFamily: FONT_MONO }}>
            {fileName}
          </Typography>
        </Stack>

        {/* Dropdown button area — divider + independent hover */}
        <Box
          onClick={() => setExpanded((p) => !p)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 1.75,
            borderLeft: `1px solid ${T.borderSub}`,
            cursor: 'pointer',
            color: '#667085',
            transition: 'background .12s, color .12s',
            '&:hover': { bgcolor: T.bgHover, color: T.textSec },
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
      </Box>

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
            <Box
              component="svg"
              width={26}
              height={26}
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              sx={{ display: 'block' }}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.0387 7.76545C14.5288 7.27534 15.1935 7 15.8866 7C16.5797 7 17.2444 7.27534 17.7346 7.76545C18.2247 8.25555 18.5 8.92028 18.5 9.61339C18.5 10.3065 18.2247 10.9712 17.7346 11.4613L12.4402 16.7557C12.1377 17.0582 11.9602 17.2357 11.7615 17.3903C11.5278 17.5734 11.2767 17.7287 11.008 17.8563C10.7814 17.964 10.5426 18.0439 10.1374 18.1789L8.2777 18.7984L7.83009 18.948C7.65206 19.0074 7.461 19.0161 7.27833 18.973C7.09565 18.9299 6.92859 18.8368 6.79588 18.7041C6.66317 18.5714 6.57005 18.4043 6.52697 18.2217C6.48389 18.039 6.49255 17.8479 6.55198 17.6699L7.32108 15.3632C7.45614 14.9574 7.53596 14.7186 7.64367 14.4914C7.77167 14.2235 7.92701 13.9723 8.10971 13.7379C8.26375 13.5404 8.44179 13.3623 8.74429 13.0598L14.0387 7.76545ZM8.25817 17.9233L9.8438 17.3942C10.2853 17.2469 10.4728 17.1838 10.6475 17.1006C10.8603 16.9987 11.06 16.8753 11.2464 16.7306C11.3987 16.6112 11.5394 16.4722 11.8687 16.1429L16.0937 11.9179C15.5144 11.7126 14.9886 11.38 14.5549 10.9445C14.1198 10.5108 13.7876 9.98494 13.5827 9.40577L9.35767 13.6308C9.02838 13.9595 8.88885 14.0996 8.76997 14.2525C8.62486 14.4386 8.50151 14.6382 8.39993 14.8514C8.31677 15.0261 8.2537 15.2136 8.10636 15.6551L7.57726 17.2418L8.25817 17.9233ZM14.2608 8.72653C14.2803 8.82421 14.3121 8.95704 14.3663 9.11164C14.5296 9.57882 14.7967 10.0028 15.1476 10.3518C15.4964 10.7027 15.9203 10.9698 16.3872 11.1332C16.5424 11.1873 16.6752 11.2191 16.7729 11.2387L17.1424 10.8692C17.4735 10.5357 17.659 10.0846 17.6582 9.61468C17.6573 9.14475 17.4703 8.6943 17.138 8.362C16.8057 8.02971 16.3553 7.84266 15.8853 7.84184C15.4154 7.84102 14.9643 8.02649 14.6308 8.35761L14.2608 8.72653Z"
                fill="currentColor"
              />
            </Box>
          </Box>

          {/* Delete cell */}
          <Box onClick={handleDelete} sx={iconCell}>
            <Box
              component="svg"
              width={26}
              height={26}
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              sx={{ display: 'block' }}
            >
              <path
                d="M8 9.4H18M16.8889 9.4V17.8C16.8889 18.4 16.3333 19 15.7778 19H10.2222C9.66667 19 9.11111 18.4 9.11111 17.8V9.4M10.7778 9.4V8.2C10.7778 7.6 11.3333 7 11.8889 7H14.1111C14.6667 7 15.2222 7.6 15.2222 8.2V9.4M11.8889 12.4V16M14.1111 12.4V16"
                stroke="currentColor"
                strokeWidth="1.16667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Box>
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
          <Typography sx={{ color: T.textSec, fontSize: 16, fontWeight: 500 }}>
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
