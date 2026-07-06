'use client';

import type { Column } from 'src/components/v5';

import useSWR from 'swr';

import { useRouter } from 'next/navigation';

import { paths } from 'src/routes/paths';

import { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { T, FONT_MONO } from 'src/theme/tokens';
import { PageShell, DataTable } from 'src/components/v5';

// ----------------------------------------------------------------------

type Props = { nodeId: string };

type IdentifyItem = {
  id: string;
  name: string;
  path: string;
  timestamp: string;
  ref_specs?: number | string;
  desc?: string;
};

export function IdentifyListView({ nodeId }: Props) {
  const router = useRouter();
  const { t } = useTranslate('identify-list');

  const url = endpoints.identify.list(nodeId);
  const { data, error, isLoading } = useSWR(url, fetcher);

  const rows: IdentifyItem[] = (data && data.data && data.data.list) || [];

  const columns: Column<IdentifyItem>[] = [
    { key: 'id', label: t('table.id'), mono: true, align: 'right', width: 56, render: (_r, i) => i + 1 },
    {
      key: 'name',
      label: t('table.identity_name'),
      render: (r) => (
        <span style={{ color: T.primary, fontWeight: 400, fontFamily: FONT_MONO }}>{r.name}</span>
      ),
    },
    { key: 'path', label: t('table.path'), mono: true, dim: true },
    { key: 'timestamp', label: t('table.timestamp'), mono: true, dim: true },
    { key: 'ref_specs', label: t('table.ref_specs'), mono: true, align: 'right' },
    { key: 'desc', label: t('table.explanation'), dim: true, grow: true },
  ];

  return (
    <PageShell node={nodeId} crumbs={[{ label: t('top.identify_list') }]} title={t('top.identify_list')}>
      <DataTable<IdentifyItem>
        columns={columns}
        rows={rows}
        loading={isLoading}
        error={!!error}
        emptyLabel={t('empty')}
        onRowClick={(row) =>
          router.push(paths.dashboard.nodes.identifyDetail(nodeId, String(row.name)))
        }
      />
    </PageShell>
  );
}
