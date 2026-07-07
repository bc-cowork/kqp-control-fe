'use client';

import type { Column } from 'src/components/v5';

import useSWR from 'swr';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';

import { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { T } from 'src/theme/tokens';

import { PageShell, DataTable, CodeBlock, SectionLabel } from 'src/components/v5';

// ----------------------------------------------------------------------

type Props = {
  params: {
    node: string;
    process: string;
  };
};

export default function Page({ params }: Props) {
  const { node, process } = params;
  const router = useRouter();
  const { t } = useTranslate('process');
  const decodedProcess = decodeURIComponent(process);

  const url = endpoints.dashboard.processDetail(node, decodedProcess);
  const { data, isLoading, error } = useSWR(url, fetcher);

  const processItem = data?.data?.item || {};
  const layoutDefinition: string = data?.data?.item?.layout_def || '';

  const summaryRows = !isLoading && !error && processItem?.name ? [processItem] : [];

  const summaryColumns: Column<any>[] = [
    {
      key: 'name',
      label: t('process_detail.process_name'),
      render: (r) => <span style={{ fontWeight: 500 }}>{r.name}</span>,
    },
    { key: 'timestamp', label: t('process_detail.timestamp'), mono: true, dim: true },
    { key: 'cpu', label: t('process_detail.cpu'), mono: true, align: 'right' },
    { key: 'mem', label: t('process_detail.mem'), mono: true, align: 'right' },
    { key: 'desc', label: t('process_detail.desc'), color: T.textSec },
  ];

  return (
    <PageShell
      node={node}
      crumbs={[
        { label: t('top.process'), onClick: () => router.push(paths.dashboard.nodes.process(node)) },
        { label: decodedProcess },
      ]}
      title={`${t('top.process')} : ${decodedProcess}`}
      scroll={false}
    >
      <Box sx={{ flexShrink: 0 }}>
        <DataTable<any>
          columns={summaryColumns}
          rows={summaryRows}
          headerVariant="light"
          loading={isLoading}
          error={!!error}
          emptyLabel={t('empty')}
        />
      </Box>

      <SectionLabel>{t('detail_table.script_title')}</SectionLabel>
      <CodeBlock theme="default" fill>{isLoading ? '' : error ? '' : layoutDefinition}</CodeBlock>
    </PageShell>
  );
}
