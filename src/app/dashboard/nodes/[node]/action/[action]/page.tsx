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

import { PageShell, DataTable, CodeBlock } from 'src/components/v5';

// ----------------------------------------------------------------------

type Props = {
  params: {
    node: string;
    action: string;
  };
};

type RefItem = { name: string; ref_count?: number; url: string };

const lastSeg = (url: string) => {
  const parts = url.split('/');
  return parts[parts.length - 1];
};

export default function Page({ params }: Props) {
  const { node, action } = params;
  const router = useRouter();
  const { t } = useTranslate('action-list');
  const decodedAction = decodeURIComponent(action);

  const url = endpoints.actions.detail(node, decodedAction);
  const { data, error, isLoading } = useSWR(url, fetcher);

  const actionItem = data?.data || {};
  const layoutList: RefItem[] = data?.data?.layouts || [];
  const processList: RefItem[] = data?.data?.processes || [];
  const script: string = data?.data?.definition || '';

  const summaryRows = !isLoading && !error && actionItem?.name ? [actionItem] : [];

  const summaryColumns: Column<any>[] = [
    {
      key: 'name',
      label: t('table.action_name'),
      render: (r) => <span style={{ color: T.primary }}>{r.name}</span>,
    },
    { key: 'path', label: t('table.path'), mono: true, dim: true },
    { key: 'timestamp', label: t('table.timestamp'), mono: true, dim: true },
    { key: 'ref_layout', label: t('table.ref_layout'), mono: true, align: 'right', color: T.textSec },
    { key: 'ref_process', label: t('table.ref_process'), mono: true, align: 'right', color: T.textSec },
    { key: 'desc', label: t('table.desc'), color: T.textSec, grow: true },
  ];

  const refColumns = (label: string, freqLabel: string): Column<RefItem>[] => [
    { key: 'no', label: t('detail_table.layout_no'), mono: true, align: 'right', width: 60, color: T.textSec, render: (_r, i) => i + 1 },
    {
      key: 'name',
      label,
      render: (r) => (
        <span style={{ color: T.primary }}>{r.name}</span>
      ),
    },
    { key: 'ref_count', label: freqLabel, mono: true, align: 'right', grow: true, color: T.textSec },
  ];

  return (
    <PageShell
      node={node}
      crumbs={[
        { label: t('top.action_list'), onClick: () => router.push(paths.dashboard.nodes.actionList(node)) },
        { label: decodedAction },
      ]}
      title={`${t('top.title_prefix')} : ${decodedAction}`}
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
          alignItems: 'stretch',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
        }}
      >
        <Box sx={{ flex: '1 1 58%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.75 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 400, color: T.textDim }}>{t('detail_table.layouts_title')}</Typography>
            <DataTable<RefItem>
              columns={refColumns(t('detail_table.layout_name'), t('detail_table.layout_ref_freq'))}
              rows={layoutList}
              maxHeight="calc(100vh - 400px)"
              loading={isLoading}
              error={!!error}
              emptyLabel={t('detail_table.empty_layouts')}
              onRowClick={(row) =>
                router.push(paths.dashboard.nodes.layoutDetail(node, lastSeg(row.url)))
              }
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 400, color: T.textDim }}>{t('detail_table.processes_title')}</Typography>
            <DataTable<RefItem>
              columns={refColumns(t('detail_table.process_name'), t('detail_table.process_usage_freq'))}
              rows={processList}
              maxHeight="calc(100vh - 400px)"
              loading={isLoading}
              error={!!error}
              emptyLabel={t('detail_table.empty_processes')}
              onRowClick={(row) =>
                router.push(paths.dashboard.nodes.processDetail(node, lastSeg(row.url)))
              }
            />
          </Box>
        </Box>

        <Box sx={{ flex: '1 1 42%', minWidth: 0, width: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography sx={{ fontSize: 17, fontWeight: 400, color: T.textDim }}>{t('detail_table.script_title')}</Typography>
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
              -- {decodedAction}.moon
            </Typography>
            <CodeBlock theme="moon" fill flush>{isLoading ? '' : error ? '' : script}</CodeBlock>
          </Box>
        </Box>
      </Box>
    </PageShell>
  );
}
