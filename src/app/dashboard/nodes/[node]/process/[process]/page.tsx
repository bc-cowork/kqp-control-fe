'use client';

import type { Column } from 'src/components/v5';

import useSWR from 'swr';
import { useRouter } from 'next/navigation';

import { paths } from 'src/routes/paths';

import { fetcher, endpoints } from 'src/utils/axios';

import { T, FONT_MONO } from 'src/theme/tokens';
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
  const decodedProcess = decodeURIComponent(process);

  const url = endpoints.dashboard.processDetail(node, decodedProcess);
  const { data, isLoading, error } = useSWR(url, fetcher);

  const processItem = data?.data?.item || {};
  const layoutDefinition: string = data?.data?.item?.layout_def || '';

  const summaryRows = !isLoading && !error && processItem?.name ? [processItem] : [];

  const summaryColumns: Column<any>[] = [
    {
      key: 'name',
      label: 'Process Name',
      render: (r) => (
        <span style={{ color: T.primary, fontWeight: 500, fontFamily: FONT_MONO }}>{r.name}</span>
      ),
    },
    { key: 'timestamp', label: 'Timestamp', mono: true },
    { key: 'cpu', label: 'CPU', mono: true, align: 'right' },
    { key: 'mem', label: 'Memory', mono: true, align: 'right' },
    { key: 'desc', label: 'Description', dim: true, grow: true },
  ];

  return (
    <PageShell
      node={node}
      crumbs={[
        { label: 'Process', onClick: () => router.push(paths.dashboard.nodes.process(node)) },
        { label: decodedProcess },
      ]}
      title={`Process : ${decodedProcess}`}
    >
      <DataTable<any>
        columns={summaryColumns}
        rows={summaryRows}
        headerVariant="light"
        loading={isLoading}
        error={!!error}
        emptyLabel="No process found"
      />

      <SectionLabel>Process Definition</SectionLabel>
      <CodeBlock theme="default">{isLoading ? '' : error ? '' : layoutDefinition}</CodeBlock>
    </PageShell>
  );
}
