'use client';

import type { Column } from 'src/components/v5';

import useSWR from 'swr';

import { useRouter } from 'next/navigation';

import { paths } from 'src/routes/paths';

import { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { T } from 'src/theme/tokens';
import { PageShell, DataTable } from 'src/components/v5';

// ----------------------------------------------------------------------

type Props = { nodeId: string };

type ActionItem = {
  id: string;
  name: string;
  path: string;
  timestamp: string;
  ref_layout?: string;
  ref_process?: string;
  desc?: string;
};

export function ActionListView({ nodeId }: Props) {
  const router = useRouter();
  const { t } = useTranslate('action-list');

  const url = endpoints.actions.list(nodeId);
  const { data, error, isLoading } = useSWR(url, fetcher);

  const rows: ActionItem[] = (data && data.data && data.data.auditLogList) || [];

  const columns: Column<ActionItem>[] = [
    { key: 'id', label: t('table.id'), mono: true, align: 'right', width: 56, color: T.textSec, render: (_r, i) => i + 1 },
    {
      key: 'name',
      label: t('table.action_name'),
      render: (r) => <span style={{ color: T.primary, fontWeight: 400 }}>{r.name}</span>,
    },
    { key: 'path', label: t('table.path'), mono: true, dim: true },
    { key: 'timestamp', label: t('table.timestamp'), mono: true, dim: true },
    { key: 'ref_layout', label: t('table.ref_layout'), mono: true, align: 'right', color: T.textSec },
    { key: 'ref_process', label: t('table.ref_process'), mono: true, align: 'right', color: T.textSec },
    { key: 'desc', label: t('table.desc'), color: T.textSec, grow: true },
  ];

  return (
    <PageShell node={nodeId} crumbs={[{ label: t('top.action_list') }]} title={t('top.action_list')}>
      <DataTable<ActionItem>
        columns={columns}
        rows={rows}
        loading={isLoading}
        error={!!error}
        emptyLabel={t('empty')}
        onRowClick={(row) =>
          router.push(paths.dashboard.nodes.actionDetail(nodeId, String(row.name)))
        }
      />
    </PageShell>
  );
}
