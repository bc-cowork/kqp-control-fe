'use client';

import { Box } from '@mui/material';

import { T } from 'src/theme/tokens';
import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

type Props = {
  issueInfo: any;
};

const fmt = (v: number | undefined) => (v || v === 0 ? v.toLocaleString() : '-');

type QuoteRow = {
  label: string;
  uni: string;
  krx: string;
  nxt: string;
  dot?: string; // leading colour dot
  arrow?: string; // ▲ / ▼ prefix before each value
  arrowColor?: string;
};

const sTh = {
  color: T.textSec,
  fontSize: 17,
  fontWeight: 400,
  textAlign: 'right' as const,
  p: '8px 10px',
  width: '24%',
};

const sLabel = {
  color: T.textSec,
  fontSize: 16,
  textAlign: 'left' as const,
  p: '8px 10px',
  whiteSpace: 'nowrap' as const,
};

const sVal = {
  color: T.textPrim,
  fontSize: 16,
  fontWeight: 300,
  fontFamily: "'Spoqa Han Sans Neo'",
  textAlign: 'right' as const,
  p: '8px 10px',
  wordBreak: 'break-all' as const,
  verticalAlign: 'middle' as const,
};

export function MemoryIssueInfoTable({ issueInfo }: Props) {
  const { t } = useTranslate('memory');

  const rows: QuoteRow[] = [
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
    {
      label: t('item.left.open'),
      uni: fmt(issueInfo.open?.uni),
      krx: fmt(issueInfo.open?.krx),
      nxt: fmt(issueInfo.open?.nxt),
      dot: T.on,
    },
    {
      label: t('item.left.high'),
      uni: fmt(issueInfo.high?.uni),
      krx: fmt(issueInfo.high?.krx),
      nxt: fmt(issueInfo.high?.nxt),
      dot: T.off,
      arrow: '▲',
      arrowColor: T.off,
    },
    {
      label: t('item.left.low'),
      uni: fmt(issueInfo.low?.uni),
      krx: fmt(issueInfo.low?.krx),
      nxt: fmt(issueInfo.low?.nxt),
      dot: T.accent,
      arrow: '▼',
      arrowColor: T.accent,
    },
  ];

  return (
    <Box
      sx={{
        mt: '14px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid ${T.border}`,
        borderRadius: '8px',
        overflow: 'hidden',
        bgcolor: T.bgCard,
      }}
    >
      <Box
        component="table"
        sx={{ width: '100%', height: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}
      >
        <Box component="thead">
          <Box component="tr" sx={{ bgcolor: `${T.primary}26` }}>
            <Box component="th" sx={{ ...sTh, textAlign: 'left', width: '28%' }} />
            <Box component="th" sx={sTh}>
              {t('item.table.uni')}
            </Box>
            <Box component="th" sx={sTh}>
              {t('item.table.krx')}
            </Box>
            <Box component="th" sx={sTh}>
              {t('item.table.nxt')}
            </Box>
          </Box>
        </Box>
        <Box component="tbody">
          {rows.map((row, i) => (
            <Box
              component="tr"
              key={row.label}
              sx={{ bgcolor: i % 2 ? 'transparent' : `${T.bgHover}66` }}
            >
              <Box component="td" sx={sLabel}>
                {row.dot && (
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-block',
                      width: 9,
                      height: 9,
                      borderRadius: '2px',
                      bgcolor: row.dot,
                      mr: '7px',
                      verticalAlign: 'middle',
                    }}
                  />
                )}
                {row.label}
              </Box>
              {[row.uni, row.krx, row.nxt].map((v, j) => (
                <Box component="td" key={j} sx={sVal}>
                  {row.arrow && (
                    <Box component="span" sx={{ color: row.arrowColor, mr: '2px' }}>
                      {row.arrow}
                    </Box>
                  )}
                  {v}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
