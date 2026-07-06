'use client';

import useSWR from 'swr';
import React from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';

import { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { T, ACCENT2, FONT_MONO } from 'src/theme/tokens';

import { PageShell } from 'src/components/v5';

// ----------------------------------------------------------------------

type Props = {
  params: {
    node: string;
    dailyReportId: string;
  };
};

type Cell = {
  label: string;
  value: React.ReactNode;
  color?: string;
  weight?: number;
  mono?: boolean;
  grow?: boolean;
};

export default function Page({ params }: Props) {
  const { node, dailyReportId } = params;
  const router = useRouter();
  const { t } = useTranslate('daily-report-list');
  const decodedReport = decodeURIComponent(dailyReportId);

  const url = endpoints.report.detail(node, decodedReport);
  const { data, isLoading, error } = useSWR(url, fetcher);

  const reportItem = data?.data?.report || {};
  const reportEmpty = data?.data?.report == null;
  const reportDefinition: string = data?.data?.contents || '';

  // The backend returns the key figures inside the report `contents` text
  // (e.g. "수신 건수: 1,234,567"), not as structured fields — parse them out so
  // they can be surfaced in the summary like the reference.
  const parseCount = (label: string): { text: string; num: number } => {
    const pattern = label.replace(/\s+/g, '\\s*');
    const m = reportDefinition.match(new RegExp(`${pattern}\\s*[:：]\\s*([\\d,]+)`));
    if (!m) return { text: '—', num: 0 };
    const num = Number(m[1].replace(/,/g, ''));
    return { text: Number.isFinite(num) ? num.toLocaleString() : m[1], num: Number.isFinite(num) ? num : 0 };
  };
  const recv = parseCount('수신 건수');
  const send = parseCount('송출 건수');
  const abn = parseCount('이상 건수');
  const hasCounts = recv.text !== '—' || send.text !== '—' || abn.text !== '—';

  const row1: Cell[] = [
    { label: t('table.report_name'), value: reportItem?.name, color: T.primary, weight: 400 },
    { label: t('table.job_at'), value: reportItem?.job_at, color: T.textSec, mono: true },
    { label: t('table.last_exec'), value: reportItem?.last_exec, color: T.textSec, mono: true },
    { label: t('table.desc'), value: reportItem?.desc, color: T.textSec, weight: 550, grow: true },
  ];
  const row2: Cell[] = [
    { label: t('table.recv_count'), value: recv.text, color: T.textSec, mono: true },
    { label: t('table.send_count'), value: send.text, color: T.textSec, mono: true },
    {
      label: t('table.abn_count'),
      value: abn.text,
      color: abn.num > 0 ? ACCENT2 : T.textSec,
      mono: true,
      weight: abn.num > 0 ? 400 : undefined,
      grow: true,
    },
  ];

  const statusText = isLoading
    ? t('loading')
    : error
      ? t('error')
      : reportEmpty
        ? t('empty_detail')
        : null;

  const renderRow = (cells: Cell[], lastRow: boolean) => (
    <Box component="tr">
      {cells.map((c, i) => {
        const lastCell = i === cells.length - 1;
        return (
          <React.Fragment key={c.label}>
            <Box
              component="th"
              sx={{
                p: '11px 14px',
                width: 110,
                color: T.textSec,
                fontSize: 14.5,
                fontWeight: 500,
                textAlign: 'left',
                borderRight: `1px solid ${T.borderSub}`,
                borderBottom: lastRow ? 'none' : `1px solid ${T.border}`,
                bgcolor: T.bgPanel,
                whiteSpace: 'nowrap',
              }}
            >
              {c.label}
            </Box>
            <Box
              component="td"
              sx={{
                p: '11px 14px',
                width: c.grow ? 'auto' : undefined,
                borderRight: lastCell ? 'none' : `1px solid ${T.borderSub}`,
                borderBottom: lastRow ? 'none' : `1px solid ${T.border}`,
                fontFamily: c.mono ? FONT_MONO : 'inherit',
                color: c.color || T.textSec,
                fontWeight: c.weight ?? 350,
              }}
            >
              {c.value ?? '—'}
            </Box>
          </React.Fragment>
        );
      })}
    </Box>
  );

  return (
    <PageShell
      node={node}
      crumbs={[
        {
          label: t('top.title'),
          onClick: () => router.push(paths.dashboard.nodes.dailyReportList(node)),
        },
        { label: decodedReport },
      ]}
      title={`${t('report')} : ${decodedReport}`}
    >
      <Box
        sx={{
          border: `1px solid ${T.border}`,
          borderRadius: '6px',
          bgcolor: T.bgCard,
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        {statusText ? (
          <Box sx={{ p: '28px 14px', textAlign: 'center', color: error ? T.off : T.textDim, fontSize: 15 }}>
            {statusText}
          </Box>
        ) : (
          <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', fontSize: 17 }}>
            <Box component="tbody">
              {renderRow(row1, !hasCounts)}
              {hasCounts && renderRow(row2, true)}
            </Box>
          </Box>
        )}
      </Box>
    </PageShell>
  );
}
