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
  params: {
    node: string;
    id: string;
  };
};

type RefItem = { name: string; ref_count?: number; usage_count?: number; url: string };

const lastSeg = (url: string) => {
  const parts = url.split('/');
  return parts[parts.length - 1];
};

export default function Page({ params }: Props) {
  const { node, id } = params;
  const router = useRouter();
  const { t } = useTranslate('rule-list');
  const decodedRule = decodeURIComponent(id);

  const url = endpoints.rules.detail(node, decodedRule);
  const { data, error, isLoading } = useSWR(url, fetcher);

  const ruleItem = data?.data?.detail || {};
  const layoutList: RefItem[] = data?.data?.detail?.related_layouts || [];
  const processList: RefItem[] = data?.data?.detail?.related_processes || [];
  const actionList: RefItem[] = data?.data?.detail?.related_actions || [];
  const script: string = data?.data?.detail?.function_def?.code || '';

  const summaryRows = !isLoading && !error && ruleItem?.name ? [ruleItem] : [];

  const summaryColumns: Column<any>[] = [
    {
      key: 'name',
      label: t('table_header.name'),
      render: (r) => <span style={{ color: T.primary, fontWeight: 400 }}>{r.name}</span>,
    },
    { key: 'path', label: t('table_header.path'), mono: true, dim: true },
    { key: 'timestamp', label: t('table_header.timestamp'), mono: true, dim: true },
    { key: 'ref_layout', label: t('table_header.ref_layout'), mono: true, align: 'right', color: T.textSec },
    { key: 'ref_process', label: t('table_header.ref_process'), mono: true, align: 'right', color: T.textSec },
    { key: 'ref_actions', label: t('table_header.ref_actions'), mono: true, align: 'right', color: T.textSec },
    { key: 'desc', label: t('table_header.desc'), dim: true, grow: true },
  ];

  const refColumns = (
    label: string,
    countKey: 'ref_count' | 'usage_count',
    freqLabel: string
  ): Column<RefItem>[] => [
    { key: 'no', label: t('detail_table.layout_no'), mono: true, align: 'right', width: 60, color: T.textSec, render: (_r, i) => i + 1 },
    {
      key: 'name',
      label,
      render: (r) => (
        <span style={{ color: T.primary, fontWeight: 400, fontFamily: FONT_MONO }}>{r.name}</span>
      ),
    },
    { key: countKey, label: freqLabel, mono: true, align: 'right', grow: true, color: T.textSec },
  ];

  return (
    <PageShell
      node={node}
      crumbs={[
        { label: t('top.title'), onClick: () => router.push(paths.dashboard.nodes.rules(node)) },
        { label: decodedRule },
      ]}
      title={`${t('top.title_prefix')} : ${decodedRule}`}
    >
      <DataTable<any>
        columns={summaryColumns}
        rows={summaryRows}
        headerVariant="light"
        loading={isLoading}
        error={!!error}
        emptyLabel={t('detail.empty')}
      />

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'flex-start',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
        }}
      >
        <Box sx={{ flex: '1 1 58%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.75 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <SectionLabel>{t('detail_table.related_layouts')}</SectionLabel>
            <DataTable<RefItem>
              columns={refColumns(t('detail_table.layout_name'), 'ref_count', t('detail_table.layout_ref_freq'))}
              rows={layoutList}
              loading={isLoading}
              error={!!error}
              emptyLabel={t('detail_table.empty_layouts')}
              onRowClick={(row) =>
                router.push(paths.dashboard.nodes.layoutDetail(node, lastSeg(row.url)))
              }
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <SectionLabel>{t('detail_table.related_processes')}</SectionLabel>
            <DataTable<RefItem>
              columns={refColumns(t('detail_table.process_name'), 'usage_count', t('detail_table.process_usage_freq'))}
              rows={processList}
              loading={isLoading}
              error={!!error}
              emptyLabel={t('detail_table.empty_processes')}
              onRowClick={(row) =>
                router.push(paths.dashboard.nodes.processDetail(node, lastSeg(row.url)))
              }
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <SectionLabel>{t('detail_table.related_actions')}</SectionLabel>
            <DataTable<RefItem>
              columns={refColumns(t('detail_table.action_name'), 'usage_count', t('detail_table.process_usage_freq'))}
              rows={actionList}
              loading={isLoading}
              error={!!error}
              emptyLabel={t('detail_table.empty_actions')}
              onRowClick={(row) =>
                router.push(paths.dashboard.nodes.actionDetail(node, lastSeg(row.url)))
              }
            />
          </Box>
        </Box>

        <Box sx={{ flex: '1 1 42%', minWidth: 0, width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <SectionLabel>{t('detail_table.script_title')}</SectionLabel>
          <Panel sx={{ p: 2 }}>
            <Typography sx={{ fontFamily: FONT_MONO, fontSize: 13, color: T.textDim, mb: 1.25 }}>
              -- {decodedRule}.moon
            </Typography>
            <CodeBlock theme="moon">{isLoading ? '' : error ? '' : script}</CodeBlock>
          </Panel>
        </Box>
      </Box>
    </PageShell>
  );
}
