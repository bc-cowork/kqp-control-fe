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

type FunctionItem = {
  id: string;
  name: string;
  path: string;
  timestamp: string;
  ref_identifies?: number | string;
  desc?: string;
};

export function FunctionListView({ nodeId }: Props) {
  const router = useRouter();
  const { t } = useTranslate('function-list');

  const url = endpoints.function.list(nodeId);
  const { data, error, isLoading } = useSWR(url, fetcher);

  const rows: FunctionItem[] = (data && data.data && data.data.list) || [];

  const columns: Column<FunctionItem>[] = [
    { key: 'id', label: t('table.id'), mono: true, align: 'right', width: 56, render: (_r, i) => i + 1 },
    {
      key: 'name',
      label: t('table.function_name'),
      render: (r) => (
        <span style={{ color: T.primary, fontWeight: 400, fontFamily: FONT_MONO }}>{r.name}</span>
      ),
    },
    { key: 'path', label: t('table.path'), mono: true, dim: true },
    { key: 'timestamp', label: t('table.timestamp'), mono: true, dim: true },
    { key: 'ref_identifies', label: t('table.ref_identifies'), mono: true, align: 'right' },
    { key: 'desc', label: t('table.desc'), dim: true, grow: true },
  ];

  return (
    <PageShell node={nodeId} crumbs={[{ label: t('top.function_list') }]} title={t('top.function_list')}>
      <DataTable<FunctionItem>
        columns={columns}
        rows={rows}
        loading={isLoading}
        error={!!error}
        emptyLabel={t('empty')}
        onRowClick={(row) =>
          router.push(paths.dashboard.nodes.functionDetail(nodeId, String(row.name)))
        }
      />
    </PageShell>
  );
}
