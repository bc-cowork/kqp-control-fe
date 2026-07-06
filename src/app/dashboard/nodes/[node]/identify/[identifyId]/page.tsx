'use client';

import type { Column } from 'src/components/v5';

import React from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Bar, XAxis, YAxis, Tooltip, BarChart, CartesianGrid, ResponsiveContainer } from 'recharts';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { T, CHART, FONT_MONO } from 'src/theme/tokens';
import { Panel, CodeBlock, DataTable, PageShell, SectionLabel } from 'src/components/v5';

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
    { key: 'name', label: t('table.identity_name'), color: T.textPrim },
    { key: 'path', label: t('table.path'), mono: true, dim: true },
    { key: 'timestamp', label: t('table.timestamp'), mono: true, dim: true },
    { key: 'ref_specs', label: t('table.ref_specs'), mono: true, align: 'right' },
    { key: 'desc', label: t('table.explanation'), dim: true, grow: true },
  ];
  const summaryRows: IdentifyDetail[] = detail?.name ? [detail] : [];

  // Related SPEC table.
  const specColumns: Column<SpecRow>[] = [
    { key: 'no', label: t('detail_table.no'), mono: true, align: 'right', width: 60, render: (_r, i) => i + 1 },
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
          sx={{ color: T.primary, textDecoration: 'underline', cursor: 'pointer' }}
        >
          {r.name}
        </Box>
      ),
    },
    { key: 'ref_count', label: t('detail_table.ref_freq'), mono: true, align: 'right', dim: true },
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

      <Box sx={{ display: 'flex', gap: 1.75, alignItems: 'flex-start' }}>
        <Box sx={{ flex: 7, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.75 }}>
          {/* Key box */}
          <Panel sx={{ p: 2 }}>
            <Typography sx={{ fontSize: 14, color: T.textDim, mb: 1 }}>{t('detail_table.key_label')}</Typography>
            <Typography sx={{ fontFamily: FONT_MONO, fontSize: 17, color: T.textPrim }}>
              {keyDisplay}
            </Typography>
          </Panel>

          {/* Related SPEC */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <SectionLabel>{t('detail_table.related_spec')}</SectionLabel>
            <DataTable<SpecRow>
              columns={specColumns}
              rows={specList}
              loading={isLoading}
              error={!!error}
              emptyLabel={t('detail_table.empty_related_specs')}
            />
          </Box>

          {/* Today Count */}
          <Panel>
            <Box sx={{ px: 2, py: 1.25, borderBottom: `1px solid ${T.border}` }}>
              <Typography sx={{ fontSize: 15, color: T.textSec, fontWeight: 500 }}>
                {t('detail_table.today_count')}
              </Typography>
            </Box>
            <Box sx={{ height: 264, p: 1.5 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={todayCountData} margin={{ top: 10, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke={CHART.grid} vertical={false} />
                  <XAxis
                    dataKey="timestamp"
                    tick={{ fill: T.textDim, fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: T.border }}
                  />
                  <YAxis
                    tick={{ fill: T.textDim, fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: T.border }}
                  />
                  <Tooltip
                    cursor={{ fill: T.bgHover }}
                    contentStyle={{
                      background: T.bgPanel,
                      border: `1px solid ${T.border}`,
                      borderRadius: '5px',
                    }}
                    labelStyle={{ color: T.textSec }}
                    itemStyle={{ color: T.textPrim }}
                  />
                  <Bar dataKey="count" fill={T.primary} radius={[3, 3, 0, 0]} maxBarSize={26} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Panel>
        </Box>

        {/* Identifier Definition */}
        <Box sx={{ flex: 5, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <SectionLabel>{t('detail_table.script_title')}</SectionLabel>
          <Panel sx={{ p: 1.5 }}>
            <Stack spacing={1}>
              <Typography sx={{ fontFamily: FONT_MONO, fontSize: 14, color: T.textDim }}>
                {`-- ${scriptFile}`}
              </Typography>
              <CodeBlock theme="moon">{scriptBody}</CodeBlock>
            </Stack>
          </Panel>
        </Box>
      </Box>
    </PageShell>
  );
}
