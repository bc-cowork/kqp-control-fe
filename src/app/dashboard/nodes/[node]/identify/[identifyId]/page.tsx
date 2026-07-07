'use client';

import type { Column } from 'src/components/v5';

import useSWR from 'swr';
import React from 'react';
import { useRouter } from 'next/navigation';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Bar, XAxis, YAxis, Tooltip, BarChart, CartesianGrid, ResponsiveContainer } from 'recharts';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { T, FONT_MONO } from 'src/theme/tokens';

import { CodeBlock, DataTable, PageShell, SectionLabel } from 'src/components/v5';

// ----------------------------------------------------------------------

type Props = {
  params: { node: string; identifyId: string };
};

type SpecRow = { name: string; ref_count: number; url: string };

type IdentifyDetail = {
  name?: string;
  path?: string;
  timestamp?: string;
  ref_specs?: number;
  desc?: string;
  related_specs?: SpecRow[];
  spec_def?: string;
};

// Hourly "Today Count" placeholder — mirrors the existing chart data source.
const todayCountData = Array.from({ length: 25 }, (_, h) => ({
  timestamp: `${h}H`,
  count: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 200, 250, 60, 65, 70, 75, 80, 85, 90, 95, 40, 100, 105, 110, 115][h],
}));

export default function Page({ params }: Props) {
  const { node, identifyId } = params;
  const decodedId = decodeURIComponent(identifyId);
  const router = useRouter();
  const { t } = useTranslate('identify-list');

  const url = endpoints.identify.detail(node, decodedId);
  const { data, error, isLoading } = useSWR(url, fetcher);

  const detail: IdentifyDetail = data?.data?.item || {};
  const specList: SpecRow[] = detail.related_specs || [];
  const script: string = detail.spec_def || '';

  // `keys` is not on the item directly — it lives inside the `spec_def` script,
  // e.g. `keys: { 'A301S', 'A301Q' }` (array) or `keys: 'A301S'` (single string).
  const parseKeys = (def: string): string[] => {
    if (!def) return [];
    const braceMatch = def.match(/keys\s*:\s*\{([^}]*)\}/);
    if (braceMatch) {
      return Array.from(braceMatch[1].matchAll(/['"]([^'"]+)['"]/g)).map((m) => m[1]);
    }
    const singleMatch = def.match(/keys\s*:\s*['"]([^'"]+)['"]/);
    return singleMatch ? [singleMatch[1]] : [];
  };
  const keys: string[] = parseKeys(script);
  const keysTitle = keys.length ? keys.join(', ') : detail?.name || '-';
  const keyDisplay = isLoading
    ? t('loading')
    : error
      ? t('error')
      : keys.length
        ? `'${keys.join("', '")}'`
        : '-';

  // Summary row — single-row light table.
  const summaryColumns: Column<IdentifyDetail>[] = [
    {
      key: 'name',
      label: t('table.identity_name'),
      render: (r) => <span style={{ color: T.primary, fontWeight: 400 }}>{r.name}</span>,
    },
    { key: 'path', label: t('table.path'), mono: true, dim: true },
    { key: 'timestamp', label: t('table.timestamp'), mono: true, dim: true },
    { key: 'ref_specs', label: t('table.ref_specs'), mono: true, align: 'right', color: T.textSec },
    { key: 'desc', label: t('table.explanation'), color: T.textSec, grow: true },
  ];
  const summaryRows: IdentifyDetail[] = detail?.name ? [detail] : [];

  // Related SPEC table.
  const specColumns: Column<SpecRow>[] = [
    { key: 'no', label: t('detail_table.no'), mono: true, align: 'right', width: 60, color: T.textSec, render: (_r, i) => i + 1 },
    {
      key: 'name',
      label: t('detail_table.related_spec'),
      render: (r) => (
        <Box
          component="span"
          onClick={() =>
            router.push(
              paths.dashboard.nodes.specDetail(node, r.url.split('/').filter(Boolean).pop() || '')
            )
          }
          sx={{ color: T.primary, fontWeight: 400, fontFamily: FONT_MONO, cursor: 'pointer' }}
        >
          {r.name}
        </Box>
      ),
    },
    { key: 'ref_count', label: t('detail_table.ref_freq'), mono: true, align: 'right', grow: true, color: T.textSec },
  ];

  const scriptFile = detail?.name || decodedId;
  const scriptBody = isLoading ? t('loading') : error ? t('error') : script || '';

  return (
    <PageShell
      node={node}
      crumbs={[
        { label: t('top.identify_list'), onClick: () => router.push(paths.dashboard.nodes.identifyList(node)) },
        { label: detail?.name || '-' },
      ]}
      title={keysTitle}
    >
      <DataTable<IdentifyDetail>
        headerVariant="light"
        columns={summaryColumns}
        rows={summaryRows}
        loading={isLoading}
        error={!!error}
        emptyLabel={t('empty_detail')}
      />

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
        <Box sx={{ flex: 7, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.75 }}>
          {/* Key box — header-less cell-style box (same tone as table body cells) */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <SectionLabel>{t('detail_table.key_label')}</SectionLabel>
            <Box
              sx={{
                border: `1px solid ${T.border}`,
                borderRadius: '6px',
                bgcolor: T.bgCard,
                p: '10px 14px',
                fontFamily: FONT_MONO,
                fontSize: 17,
                color: T.textPrim,
              }}
            >
              {keyDisplay}
            </Box>
          </Box>

          {/* Related SPEC */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <SectionLabel>{t('detail_table.related_spec')}</SectionLabel>
            <DataTable<SpecRow>
              columns={specColumns}
              rows={specList}
              maxHeight={340}
              loading={isLoading}
              error={!!error}
              emptyLabel={t('detail_table.empty_related_specs')}
            />
          </Box>

          {/* Today Count */}
          <Box
            sx={{
              border: `1px solid ${T.border}`,
              borderRadius: '6px',
              bgcolor: T.bgCard,
              overflow: 'hidden',
            }}
          >
            <Box sx={{ px: '14px', py: '9px', borderBottom: `1px solid ${T.border}` }}>
              <Typography sx={{ fontSize: 15, color: T.textSec, fontWeight: 500 }}>
                {t('detail_table.today_count')}
              </Typography>
            </Box>
            <Box sx={{ height: 264, p: '10px 10px 6px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={todayCountData} margin={{ top: 6, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={T.border} strokeWidth={0.5} vertical={false} />
                  <XAxis
                    dataKey="timestamp"
                    tick={{ fill: T.textDim, fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: T.border }}
                    minTickGap={8}
                  />
                  <YAxis
                    tick={{ fill: T.textDim, fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: T.border }}
                    width={36}
                    tickFormatter={(v) => Number(v).toLocaleString()}
                  />
                  <Tooltip
                    cursor={{ fill: `${T.primary}14` }}
                    contentStyle={{
                      background: T.bgPanel,
                      border: `1px solid ${T.border}`,
                      borderRadius: '5px',
                      fontSize: 14,
                    }}
                    labelStyle={{ color: T.textPrim }}
                    formatter={(v: number) => [Number(v).toLocaleString(), t('detail_table.count_unit')]}
                  />
                  <Bar
                    dataKey="count"
                    fill={T.primary}
                    radius={[3, 3, 0, 0]}
                    maxBarSize={26}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        </Box>

        {/* Identifier Definition */}
        <Box sx={{ flex: 5, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <SectionLabel>{t('detail_table.script_title')}</SectionLabel>
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
              {`-- ${scriptFile}.moon`}
            </Typography>
            <CodeBlock theme="moon" fill flush>{scriptBody}</CodeBlock>
          </Box>
        </Box>
      </Box>
    </PageShell>
  );
}
