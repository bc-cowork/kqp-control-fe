'use client';

import { Box, Stack, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';
import { T, FONT_MONO } from 'src/theme/tokens';

// ----------------------------------------------------------------------

type Props = {
  issueInfo: any;
};

const fmt = (v: number | undefined) => (v || v === 0 ? v.toLocaleString() : '-');

type QuoteRow = { label: string; uni: string; krx: string; nxt: string };

const cellSx = {
  flex: 1,
  textAlign: 'right' as const,
  fontFamily: FONT_MONO,
  fontSize: 15,
  color: T.textPrim,
};

const DataRow = ({ row }: { row: QuoteRow }) => (
  <Stack
    direction="row"
    alignItems="center"
    sx={{ px: 1.5, py: 1, borderTop: `1px solid ${T.borderSub}` }}
  >
    <Typography sx={{ flex: 1, fontSize: 14, color: T.textSec }}>{row.label}</Typography>
    <Typography sx={cellSx}>{row.uni}</Typography>
    <Typography sx={cellSx}>{row.krx}</Typography>
    <Typography sx={cellSx}>{row.nxt}</Typography>
  </Stack>
);

export function MemoryIssueInfoTable({ issueInfo }: Props) {
  const { t } = useTranslate('memory');

  const rows: { label: string; uni: string; krx: string; nxt: string }[] = [
    {
      label: t('item.left.last_price'),
      uni: fmt(issueInfo.last_price?.uni),
      krx: fmt(issueInfo.last_price?.krx),
      nxt: fmt(issueInfo.last_price?.nxt),
    },
    {
      label: t('item.left.last_vol'),
      uni: fmt(issueInfo.last_vol?.uni),
      krx: fmt(issueInfo.last_vol?.krx),
      nxt: fmt(issueInfo.last_vol?.nxt),
    },
    {
      label: t('item.left.vol_accum'),
      uni: fmt(issueInfo.vol_accum?.uni),
      krx: fmt(issueInfo.vol_accum?.krx),
      nxt: fmt(issueInfo.vol_accum?.nxt),
    },
    {
      label: t('item.left.amt_accum'),
      uni: fmt(issueInfo.amt_accum?.uni),
      krx: fmt(issueInfo.amt_accum?.krx),
      nxt: fmt(issueInfo.amt_accum?.nxt),
    },
  ];

  const priceRows: { label: string; uni: string; krx: string; nxt: string }[] = [
    {
      label: t('item.left.open'),
      uni: fmt(issueInfo.open?.uni),
      krx: fmt(issueInfo.open?.krx),
      nxt: fmt(issueInfo.open?.nxt),
    },
    {
      label: t('item.left.high'),
      uni: fmt(issueInfo.high?.uni),
      krx: fmt(issueInfo.high?.krx),
      nxt: fmt(issueInfo.high?.nxt),
    },
    {
      label: t('item.left.low'),
      uni: fmt(issueInfo.low?.uni),
      krx: fmt(issueInfo.low?.krx),
      nxt: fmt(issueInfo.low?.nxt),
    },
  ];

  return (
    <Box sx={{ mt: 1.5, border: `1px solid ${T.border}`, borderRadius: '8px', overflow: 'hidden' }}>
      {/* Header row */}
      <Stack direction="row" alignItems="center" sx={{ px: 1.5, py: 1, bgcolor: T.bgRowSel }}>
        <Typography sx={{ flex: 1 }} />
        <Typography sx={{ flex: 1, textAlign: 'right', fontSize: 14, color: T.textSec }}>
          {t('item.table.uni')}
        </Typography>
        <Typography sx={{ flex: 1, textAlign: 'right', fontSize: 14, color: T.textSec }}>
          {t('item.table.krx')}
        </Typography>
        <Typography sx={{ flex: 1, textAlign: 'right', fontSize: 14, color: T.textSec }}>
          {t('item.table.nxt')}
        </Typography>
      </Stack>

      {rows.map((row) => (
        <DataRow key={row.label} row={row} />
      ))}

      {/* Spacer between accumulated + price groups */}
      <Box sx={{ height: 6, bgcolor: T.bgPanel }} />

      {priceRows.map((row) => (
        <DataRow key={row.label} row={row} />
      ))}
    </Box>
  );
}
