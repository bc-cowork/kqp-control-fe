'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Add from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

import { paths } from 'src/routes/paths';

import { fetcher, endpoints } from 'src/utils/axios';

import { grey } from 'src/theme/core';
import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/common/Breadcrumb';

// ----------------------------------------------------------------------

type AlertItem = {
  name: string;
  status: 'OK';
  desc?: string;
  file?: string;
  start_at?: string;
  end_at?: string;
  interval_sec?: number;
  last_exec?: string;
};

type Props = { nodeId: string };

// ----------------------------------------------------------------------

function StatusBadge({ status }: { status: 'OK' }) {
  const isActive = status === 'OK';
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        pl: 1,
        pr: 1.5,
        bgcolor: (theme) => theme.palette.mode === 'dark'
          ? (isActive ? '#1D2F20' : '#331B1E')
          : (isActive ? '#E8F5E9' : '#FFEBEE'),
        borderRadius: '100px',
        border: (theme) => `1px solid ${theme.palette.mode === 'dark'
          ? (isActive ? '#36573C' : '#4A2C31')
          : (isActive ? '#A5D6A7' : '#FFCDD2')}`,
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: isActive ? '#4FCB53' : '#FF5B5B',
          flexShrink: 0,
        }}
      />
      <Typography
        sx={{
          color: (theme) => theme.palette.mode === 'dark'
            ? (isActive ? '#7EE081' : '#FF8882')
            : (isActive ? '#2E7D32' : '#C62828'),
          fontSize: 15, fontWeight: 400, lineHeight: '22.5px',
        }}
      >
        {status === 'OK' ? "active" : "inactive"}
      </Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

type AlertRowProps = { item: AlertItem; nodeId: string; t: (key: string) => string };

function AlertRow({ item, nodeId, t }: AlertRowProps) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const COL_HEADER = isDark ? '#667085' : grey[500];
  const COL_VALUE = isDark ? '#AFB7C8' : grey[600];
  const COL_DIVIDER = isDark ? '#202838' : grey[200];

  const columns = [
    { label: t('table.start_at'), value: item.start_at ?? '00:00' },
    { label: t('table.end_at'), value: item.end_at ?? '00:00' },
    { label: t('table.interval'), value: String(item.interval_sec ?? 0) },
    { label: t('table.last_exec'), value: item.last_exec ?? '0000-00-00 00:00:00' },
  ];

  const cellBase = {
    flex: '1 1 0',
    height: 32,
    minWidth: 116,
    px: 1.5,
    display: 'flex',
    alignItems: 'center',
    borderRight: `1px solid ${COL_DIVIDER}`,
  };

  return (
    <Box sx={{ borderBottom: (th) => `1px solid ${th.palette.mode === 'dark' ? '#2A3142' : grey[200]}` }}>
      {/* Row header */}
      <Stack
        onClick={() => router.push(paths.dashboard.nodes.alertsDetail(nodeId, item.name))}
        direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1.5, cursor: 'pointer' }}>
        {/* Left: icon placeholder + name + status + description */}
        <Stack direction="row" alignItems="center" gap={2} sx={{ flex: 1, height: 65, px: 1.5 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M9 1.33301C9.14134 1.33301 9.27696 1.38938 9.37695 1.48926L13.1768 5.29004C13.2766 5.39003 13.333 5.52567 13.333 5.66699V13.4668C13.333 14.1295 12.7956 14.667 12.1328 14.667H3.86621C3.20368 14.6667 2.66699 14.1294 2.66699 13.4668V2.5332C2.66706 1.87067 3.20372 1.33325 3.86621 1.33301H9ZM3.86621 2.40039C3.79283 2.40064 3.73347 2.45978 3.7334 2.5332V13.4668C3.7334 13.5403 3.79278 13.6003 3.86621 13.6006H12.1328C12.2064 13.6006 12.2666 13.5404 12.2666 13.4668V6.2002H9.66699C9.00425 6.2002 8.4668 5.66274 8.4668 5V2.40039H3.86621ZM9.99902 10.667C10.2936 10.667 10.5332 10.9056 10.5332 11.2002C10.5331 11.4947 10.2935 11.7334 9.99902 11.7334H5.33301C5.03852 11.7334 4.79991 11.4947 4.7998 11.2002C4.7998 10.9056 5.03846 10.667 5.33301 10.667H9.99902ZM7.99902 8.40039C8.29358 8.40039 8.5332 8.63904 8.5332 8.93359C8.5331 9.22806 8.29351 9.4668 7.99902 9.4668H5.33301C5.03852 9.4668 4.79991 9.22806 4.7998 8.93359C4.7998 8.63904 5.03846 8.40039 5.33301 8.40039H7.99902ZM9.5332 5C9.5332 5.07364 9.59335 5.13379 9.66699 5.13379H11.5117L9.5332 3.1543V5Z" fill={isDark ? '#667085' : grey[500]} />
          </svg>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" gap={1.5} sx={{ py: 0.5 }}>
              <Typography
                sx={{ color: (th) => th.palette.mode === 'dark' ? '#D1D6E0' : '#373F4E', fontSize: 15, fontWeight: 400, lineHeight: '22.5px', cursor: 'pointer' }}
              >
                {item.name}
              </Typography>
              <StatusBadge status={item.status} />
            </Stack>
            {item.desc && (
              <Typography sx={{ color: (th) => th.palette.mode === 'dark' ? '#AFB7C8' : grey[500], fontSize: 12, fontWeight: 400, lineHeight: '16.8px', py: '2px' }}>
                {item.desc}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* Right: filename + expand chevron */}
        <Stack direction="row" alignItems="center" gap={2} sx={{ width: 189, justifyContent: 'flex-end' }}>
          <Typography sx={{ flex: 1, color: (th) => th.palette.mode === 'dark' ? '#667085' : grey[500], fontSize: 12, fontWeight: 400, lineHeight: '18px' }}>
            {item.file || "KOSPI_KOSDAQ.moon"}
          </Typography>
          <Box
            onClick={(e) => {
              setExpanded((p) => !p)
              e.stopPropagation();
            }}
            sx={{ height: 26, px: 1.5, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <KeyboardArrowDown
              sx={{
                color: (th) => th.palette.mode === 'dark' ? '#667085' : grey[500],
                fontSize: 22,
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </Box>
        </Stack>
      </Stack>

      {/* Expanded sub-section */}
      <Collapse in={expanded} unmountOnExit>
        <Stack direction="row" alignItems="center" sx={{ pl: 6, pr: 6, bgcolor: (th) => th.palette.mode === 'dark' ? '#161C25' : grey[50] }}>
          {/* 4-column mini table */}
          <Box sx={{ flex: 1, height: 65, display: 'flex', flexDirection: 'column' }}>
            {/* Header row */}
            <Stack direction="row" sx={{ flex: 1 }}>
              {columns.map((col) => (
                <Box key={col.label} sx={{ ...cellBase, borderBottom: `1px solid ${COL_DIVIDER}` }}>
                  <Typography sx={{ color: COL_HEADER, fontSize: 15, lineHeight: '22.5px' }}>
                    {col.label}
                  </Typography>
                </Box>
              ))}
            </Stack>
            {/* Value row */}
            <Stack direction="row" sx={{ flex: 1, overflow: 'hidden' }}>
              {columns.map((col) => (
                <Box key={col.label} sx={cellBase}>
                  <Typography sx={{ color: COL_VALUE, fontSize: 15, lineHeight: '22.5px' }}>
                    {col.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Edit button */}
          <Box
            onClick={(e) => {
              e.stopPropagation();
              router.push(paths.dashboard.nodes.alertsEdit(nodeId, item.name));
            }}
            sx={{
              width: 76,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: `1px solid ${COL_DIVIDER}`,
              cursor: 'pointer',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M14.0387 7.76545C14.5288 7.27534 15.1935 7 15.8866 7C16.5797 7 17.2444 7.27534 17.7346 7.76545C18.2247 8.25555 18.5 8.92028 18.5 9.61339C18.5 10.3065 18.2247 10.9712 17.7346 11.4613L12.4402 16.7557C12.1377 17.0582 11.9602 17.2357 11.7615 17.3903C11.5278 17.5734 11.2767 17.7287 11.008 17.8563C10.7814 17.964 10.5426 18.0439 10.1374 18.1789L8.2777 18.7984L7.83009 18.948C7.65206 19.0074 7.461 19.0161 7.27833 18.973C7.09565 18.9299 6.92859 18.8368 6.79588 18.7041C6.66317 18.5714 6.57005 18.4043 6.52697 18.2217C6.48389 18.039 6.49255 17.8479 6.55198 17.6699L7.32108 15.3632C7.45614 14.9574 7.53596 14.7186 7.64367 14.4914C7.77167 14.2235 7.92701 13.9723 8.10971 13.7379C8.26375 13.5404 8.44179 13.3623 8.74429 13.0598L14.0387 7.76545ZM8.25817 17.9233L9.8438 17.3942C10.2853 17.2469 10.4728 17.1838 10.6475 17.1006C10.8603 16.9987 11.06 16.8753 11.2464 16.7306C11.3987 16.6112 11.5394 16.4722 11.8687 16.1429L16.0937 11.9179C15.5144 11.7126 14.9886 11.38 14.5549 10.9445C14.1198 10.5108 13.7876 9.98494 13.5827 9.40577L9.35767 13.6308C9.02838 13.9595 8.88885 14.0996 8.76997 14.2525C8.62486 14.4386 8.50151 14.6382 8.39993 14.8514C8.31677 15.0261 8.2537 15.2136 8.10636 15.6551L7.57726 17.2418L8.25817 17.9233ZM14.2608 8.72653C14.2803 8.82421 14.3121 8.95704 14.3663 9.11164C14.5296 9.57882 14.7967 10.0028 15.1476 10.3518C15.4964 10.7027 15.9203 10.9698 16.3872 11.1332C16.5424 11.1873 16.6752 11.2191 16.7729 11.2387L17.1424 10.8692C17.4735 10.5357 17.659 10.0846 17.6582 9.61468C17.6573 9.14475 17.4703 8.6943 17.138 8.362C16.8057 8.02971 16.3553 7.84266 15.8853 7.84184C15.4154 7.84102 14.9643 8.02649 14.6308 8.35761L14.2608 8.72653Z" fill={isDark ? '#667085' : grey[500]} />
            </svg>
          </Box>

          {/* Delete button */}
          <Box
            sx={{
              width: 76, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 9.4H18M16.8889 9.4V17.8C16.8889 18.4 16.3333 19 15.7778 19H10.2222C9.66667 19 9.11111 18.4 9.11111 17.8V9.4M10.7778 9.4V8.2C10.7778 7.6 11.3333 7 11.8889 7H14.1111C14.6667 7 15.2222 7.6 15.2222 8.2V9.4M11.8889 12.4V16M14.1111 12.4V16" stroke={isDark ? '#667085' : grey[500]} strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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

  const { data, isLoading } = useSWR(endpoints.alert.list(nodeId), fetcher);
  const rows: AlertItem[] = data?.data?.list ?? [];

  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb node={nodeId} pages={[{ pageName: t('top.title') }]} />

      <Box sx={{ mt: 3, borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1.5, bgcolor: (theme) => theme.palette.mode === 'dark' ? '#667085' : grey[200], minHeight: 46.5 }}
        >
          <Stack direction="row" alignItems="center" gap={1} sx={{ flex: 1, px: 1.5 }}>
            <Typography sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#E0E4EB' : '#373F4E', fontSize: 15, fontWeight: 400, lineHeight: '22.5px' }}>
              {t('top.title')}
            </Typography>
            <Typography sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#AFB7C8' : grey[500], fontSize: 13, fontWeight: 400, lineHeight: '19.5px' }}>
              ({rows.length})
            </Typography>
          </Stack>

          <Button
            onClick={() => router.push(paths.dashboard.nodes.alertsAdd(nodeId))}
            startIcon={<Add sx={{ fontSize: 16 }} />}
            sx={{
              px: 1.5,
              py: 0.5,
              bgcolor: '#5E66FF',
              color: 'white',
              fontSize: 15,
              fontWeight: 400,
              lineHeight: '22.5px',
              textTransform: 'none',
              borderRadius: '4px',
              '&:hover': { bgcolor: '#4A52E0' },
            }}
          >
            {t('btn.add')}
          </Button>
        </Stack>

        {/* List body */}
        <Box sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? '#202838' : '#FFFFFF', border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? '#202838' : grey[200]}` }}>
          {isLoading && (
            <Typography sx={{ p: 2, color: (theme) => theme.palette.mode === 'dark' ? '#AFB7C8' : grey[500], fontSize: 15 }}>{t('loading')}</Typography>
          )}
          {!isLoading && rows.length === 0 && (
            <Typography sx={{ p: 2, color: (theme) => theme.palette.mode === 'dark' ? '#AFB7C8' : grey[500], fontSize: 15 }}>{t('empty')}</Typography>
          )}
          {rows.map((row) => (
            <AlertRow key={row.name} item={row} nodeId={nodeId} t={t} />
          ))}
        </Box>
      </Box>
    </DashboardContent>
  );
}
