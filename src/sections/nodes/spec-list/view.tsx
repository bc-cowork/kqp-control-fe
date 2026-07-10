'use client';

import type { Column } from 'src/components/v5';

import useSWR from 'swr';
import { useRouter } from 'next/navigation';

import { paths } from 'src/routes/paths';

import { fetcher, endpoints } from 'src/utils/axios';

import { T } from 'src/theme/tokens';
import { useTranslate } from 'src/locales';

import { PageShell, DataTable } from 'src/components/v5';

// ----------------------------------------------------------------------

type SpecItem = {
  id: string;
  name: string;
  path: string;
  timestamp: string;
  ref_identifies?: string;
  frags?: number;
  size?: number;
  desc?: string;
};

type Props = { nodeId: string };

export function SpecListView({ nodeId }: Props) {
  const router = useRouter();
  const { t } = useTranslate('spec-list');
  const url = endpoints.spec.list(nodeId);
  const { data, error, isLoading } = useSWR(url, fetcher);
  const rows: SpecItem[] = (data && data.data && data.data.list) || [];

  const columns: Column<SpecItem>[] = [
    { key: 'id', label: t('table.id'), mono: true, align: 'right', width: 56, color: T.textSec, render: (_r, i) => i + 1 },
    {
      key: 'name',
      label: t('table.spec_name'),
      render: (r) => <span style={{ color: T.link }}>{r.name}</span>,
    },
    { key: 'path', label: t('table.path'), mono: true, dim: true },
    { key: 'timestamp', label: t('table.timestamp'), mono: true, dim: true },
    { key: 'ref_identifies', label: t('table.ref_identifies'), mono: true, align: 'right', color: T.textSec },
    { key: 'frags', label: t('table.frags'), mono: true, align: 'right', color: T.textSec },
    { key: 'size', label: t('table.size'), mono: true, align: 'right', color: T.textSec },
    { key: 'desc', label: t('table.explanation'), color: T.textSec, grow: true },
  ];

  return (
    <PageShell node={nodeId} crumbs={[{ label: t('top.spec_list') }]} title={t('top.spec_list')}>
      <DataTable<SpecItem>
        columns={columns}
        rows={rows}
        loading={isLoading}
        error={!!error}
        emptyLabel={t('empty')}
        onRowClick={(row) => router.push(paths.dashboard.nodes.specDetail(nodeId, String(row.name)))}
      />
    </PageShell>
  );
}
