'use client';

import type { Column } from 'src/components/v5';

import useSWR from 'swr';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { T } from 'src/theme/tokens';
import { PageShell, DataTable } from 'src/components/v5';

// ----------------------------------------------------------------------

type Props = { nodeId: string };

type LayoutItem = {
  id: string;
  name: string;
  path: string;
  timestamp: string;
  process?: number;
  channel_in?: number;
  desc?: string;
};

export function LayoutListView({ nodeId }: Props) {
  const router = useRouter();
  const { t } = useTranslate('layout-list');

  const url = endpoints.layouts.list(nodeId);
  const { data, error, isLoading } = useSWR(url, fetcher);

  const rows: LayoutItem[] = (data && data.data && data.data.list) || [];

  const columns: Column<LayoutItem>[] = [
    { key: 'id', label: t('table.id'), align: 'right', width: 56, color: T.textSec, render: (_r, i) => i + 1 },
    {
      key: 'name',
      label: t('table.layout_name'),
      render: (r) => <span style={{ color: T.link }}>{r.name}</span>,
    },
    { key: 'path', label: t('table.path'), dim: true },
    { key: 'timestamp', label: t('table.timestamp'), dim: true },
    { key: 'process', label: t('table.process'), align: 'right', color: T.textSec },
    { key: 'channel_in', label: t('table.channel_in'), align: 'right', color: T.textSec },
    { key: 'desc', label: t('table.desc'), color: T.textSec, grow: true },
  ];

  return (
    <PageShell node={nodeId} crumbs={[{ label: t('top.layout_list') }]} title={t('top.layout_list')}>
      <DataTable<LayoutItem>
        columns={columns}
        bodyWeight={300}
        headerWeight={400}
        headerSize={17}
        rows={rows}
        loading={isLoading}
        error={!!error}
        emptyLabel={t('empty')}
        onRowClick={(row) =>
          router.push(paths.dashboard.nodes.layoutDetail(nodeId, String(row.name)))
        }
      />
    </PageShell>
  );
}
