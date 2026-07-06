'use client';

import type { Column } from 'src/components/v5';

import useSWR from 'swr';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { T, FONT_MONO } from 'src/theme/tokens';

import { Panel, PageShell, DataTable, CodeBlock, SectionLabel } from 'src/components/v5';

// ----------------------------------------------------------------------

type Props = {
  params: { node: string; identifyId: string };
};

type RefItem = { name: string; ref_count?: number; url: string };

const lastSeg = (url: string) => {
  const parts = url.split('/');
  return parts[parts.length - 1];
};

export default function Page({ params }: Props) {
  const { node, identifyId } = params;
  const router = useRouter();
  const { t } = useTranslate('function-list');
  const decodedId = decodeURIComponent(identifyId);

  const url = endpoints.function.detail(node, decodedId);
  const { data, error, isLoading } = useSWR(url, fetcher);

  const detail = data?.data || {};
  const fn = detail?.function || {};
  const specList: RefItem[] = detail.related_identifies || [];
  const script: string = detail.definition || '';

  const fnName = fn?.name || '-';
  const summaryRows = !isLoading && !error && fn?.name ? [fn] : [];

  const summaryColumns: Column<any>[] = [
    {
      key: 'name',
      label: t('table.function_name'),
      render: (r) => <span style={{ color: T.primary, fontWeight: 400 }}>{r.name}</span>,
    },
    { key: 'path', label: t('table.path'), mono: true, dim: true },
    { key: 'timestamp', label: t('table.timestamp'), mono: true, dim: true },
    { key: 'ref_identifies', label: t('table.ref_identifies'), mono: true, align: 'right', color: T.textSec },
    { key: 'desc', label: t('table.desc'), dim: true, grow: true },
  ];

  const refColumns: Column<RefItem>[] = [
    { key: 'no', label: t('detail_table.no'), mono: true, align: 'right', width: 60, color: T.textSec, render: (_r, i) => i + 1 },
    {
      key: 'name',
      label: t('detail_table.related_identifier'),
      render: (r) => (
        <span style={{ color: T.primary, fontWeight: 400, fontFamily: FONT_MONO }}>{r.name}</span>
      ),
    },
    { key: 'ref_count', label: t('detail_table.ref_freq'), mono: true, align: 'right', grow: true, color: T.textSec },
  ];

  return (
    <PageShell
      node={node}
      crumbs={[
        { label: t('top.function_list'), onClick: () => router.push(paths.dashboard.nodes.functionList(node)) },
        { label: fnName },
      ]}
      title={`${t('top.title_prefix')} : ${fnName}`}
    >
      <DataTable<any>
        columns={summaryColumns}
        rows={summaryRows}
        headerVariant="light"
        loading={isLoading}
        error={!!error}
        emptyLabel={t('empty_detail')}
      />

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'flex-start',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
        }}
      >
        <Box sx={{ flex: '1 1 58%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <SectionLabel>{t('detail_table.section_identifiers')}</SectionLabel>
          <DataTable<RefItem>
            columns={refColumns}
            rows={specList}
            loading={isLoading}
            error={!!error}
            emptyLabel={t('detail_table.empty_related_identifiers')}
            onRowClick={(row) =>
              router.push(paths.dashboard.nodes.specDetail(node, lastSeg(row.url)))
            }
          />
        </Box>

        <Box sx={{ flex: '1 1 42%', minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <SectionLabel>{t('detail_table.script_title')}</SectionLabel>
          <Panel sx={{ p: 2 }}>
            <Typography sx={{ fontFamily: FONT_MONO, fontSize: 13, color: T.textDim, mb: 1.25 }}>
              -- {fnName}.moon
            </Typography>
            <CodeBlock theme="moon">{isLoading ? '' : error ? '' : script}</CodeBlock>
          </Panel>
        </Box>
      </Box>
    </PageShell>
  );
}
