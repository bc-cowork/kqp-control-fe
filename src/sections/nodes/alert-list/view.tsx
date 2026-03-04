'use client';

import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Add from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import EditOutlined from '@mui/icons-material/EditOutlined';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';

import { paths } from 'src/routes/paths';

import { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/common/Breadcrumb';

// ----------------------------------------------------------------------

type AlertItem = {
  name: string;
  status: 'active' | 'inactive';
  desc?: string;
  file?: string;
  start_at?: string;
  end_at?: string;
  interval?: number;
  last_exec?: string;
};

type Props = { nodeId: string };

// ----------------------------------------------------------------------

function StatusBadge({ status }: { status: 'active' | 'inactive' }) {
  const isActive = status === 'active';
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        pl: 1,
        pr: 1.5,
        bgcolor: isActive ? '#1D2F20' : '#331B1E',
        borderRadius: '100px',
        border: `1px solid ${isActive ? '#36573C' : '#4A2C31'}`,
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
        sx={{ color: isActive ? '#7EE081' : '#FF8882', fontSize: 15, fontWeight: 400, lineHeight: '22.5px' }}
      >
        {status}
      </Typography>
    </Box>
  );
}

// ----------------------------------------------------------------------

function AlertRow({ item, nodeId }: { item: AlertItem; nodeId: string }) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const COL_HEADER = '#667085';
  const COL_VALUE = '#AFB7C8';
  const COL_DIVIDER = '#202838';

  const columns = [
    { label: 'Start At', value: item.start_at ?? '00:00' },
    { label: 'End At', value: item.end_at ?? '00:00' },
    { label: 'Interval (sec)', value: String(item.interval ?? 0) },
    { label: 'Last exec.', value: item.last_exec ?? '0000-00-00 00:00:00' },
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
    <Box sx={{ borderBottom: '1px solid #2A3142' }}>
      {/* Row header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1.5 }}>
        {/* Left: icon placeholder + name + status + description */}
        <Stack direction="row" alignItems="center" gap={2} sx={{ flex: 1, height: 65, px: 1.5 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9 1.33301C9.14134 1.33301 9.27696 1.38938 9.37695 1.48926L13.1768 5.29004C13.2766 5.39003 13.333 5.52567 13.333 5.66699V13.4668C13.333 14.1295 12.7956 14.667 12.1328 14.667H3.86621C3.20368 14.6667 2.66699 14.1294 2.66699 13.4668V2.5332C2.66706 1.87067 3.20372 1.33325 3.86621 1.33301H9ZM3.86621 2.40039C3.79283 2.40064 3.73347 2.45978 3.7334 2.5332V13.4668C3.7334 13.5403 3.79278 13.6003 3.86621 13.6006H12.1328C12.2064 13.6006 12.2666 13.5404 12.2666 13.4668V6.2002H9.66699C9.00425 6.2002 8.4668 5.66274 8.4668 5V2.40039H3.86621ZM9.99902 10.667C10.2936 10.667 10.5332 10.9056 10.5332 11.2002C10.5331 11.4947 10.2935 11.7334 9.99902 11.7334H5.33301C5.03852 11.7334 4.79991 11.4947 4.7998 11.2002C4.7998 10.9056 5.03846 10.667 5.33301 10.667H9.99902ZM7.99902 8.40039C8.29358 8.40039 8.5332 8.63904 8.5332 8.93359C8.5331 9.22806 8.29351 9.4668 7.99902 9.4668H5.33301C5.03852 9.4668 4.79991 9.22806 4.7998 8.93359C4.7998 8.63904 5.03846 8.40039 5.33301 8.40039H7.99902ZM9.5332 5C9.5332 5.07364 9.59335 5.13379 9.66699 5.13379H11.5117L9.5332 3.1543V5Z" fill="#667085" />
          </svg>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" gap={1.5} sx={{ py: 0.5 }}>
              <Typography
                onClick={() => router.push(paths.dashboard.nodes.alertsDetail(nodeId, item.name))}
                sx={{ color: '#D1D6E0', fontSize: 15, fontWeight: 400, lineHeight: '22.5px', cursor: 'pointer' }}
              >
                {item.name}
              </Typography>
              <StatusBadge status={item.status} />
            </Stack>
            {item.desc && (
              <Typography sx={{ color: '#AFB7C8', fontSize: 12, fontWeight: 400, lineHeight: '16.8px', py: '2px' }}>
                {item.desc}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* Right: filename + expand chevron */}
        <Stack direction="row" alignItems="center" gap={2} sx={{ width: 189, justifyContent: 'flex-end' }}>
          <Typography sx={{ flex: 1, color: '#667085', fontSize: 12, fontWeight: 400, lineHeight: '18px' }}>
            {item.file}
          </Typography>
          <Box
            onClick={() => setExpanded((p) => !p)}
            sx={{ height: 26, px: 1.5, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <KeyboardArrowDown
              sx={{
                color: '#667085',
                fontSize: 16,
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </Box>
        </Stack>
      </Stack>

      {/* Expanded sub-section */}
      <Collapse in={expanded} unmountOnExit>
        <Stack direction="row" alignItems="center" sx={{ pl: 6, pr: 6, bgcolor: '#161C25' }}>
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
            sx={{
              width: 76,
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: `1px solid ${COL_DIVIDER}`,
            }}
          >
            <IconButton sx={{ width: 26, height: 26, borderRadius: '4px', color: '#667085' }}>
              <EditOutlined sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>

          {/* Delete button */}
          <Box
            sx={{ width: 76, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <IconButton sx={{ width: 26, height: 26, borderRadius: '4px', color: '#667085' }}>
              <DeleteOutline sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        </Stack>
      </Collapse>
    </Box>
  );
}

// ----------------------------------------------------------------------

export function AlertListView({ nodeId }: Props) {
  const { t } = useTranslate('alert-list');

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
          sx={{ px: 1.5, bgcolor: '#667085', minHeight: 46.5 }}
        >
          <Stack direction="row" alignItems="center" gap={1} sx={{ flex: 1, px: 1.5 }}>
            <Typography sx={{ color: '#E0E4EB', fontSize: 15, fontWeight: 400, lineHeight: '22.5px' }}>
              {t('top.title')}
            </Typography>
            <Typography sx={{ color: '#AFB7C8', fontSize: 13, fontWeight: 400, lineHeight: '19.5px' }}>
              ({rows.length})
            </Typography>
          </Stack>

          <Button
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
            Add Item
          </Button>
        </Stack>

        {/* List body */}
        <Box sx={{ bgcolor: '#202838', border: '1px solid #202838' }}>
          {isLoading && (
            <Typography sx={{ p: 2, color: '#AFB7C8', fontSize: 15 }}>Loading...</Typography>
          )}
          {!isLoading && rows.length === 0 && (
            <Typography sx={{ p: 2, color: '#AFB7C8', fontSize: 15 }}>No alert items</Typography>
          )}
          {rows.map((row) => (
            <AlertRow key={row.name} item={row} nodeId={nodeId} />
          ))}
        </Box>
      </Box>
    </DashboardContent>
  );
}
