'use client';

import type { Column } from 'src/components/v5';

import useSWR from 'swr';

import { useRouter } from 'src/routes/hooks';

import { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';

import { T } from 'src/theme/tokens';
import { DataTable } from 'src/components/v5';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
};

type RuleItem = {
  name: string;
  path: string;
  timestamp: string;
  ref_layout?: string | number;
  ref_process?: string | number;
  ref_actions?: string | number;
  desc?: string;
};

export function RuleList({ selectedNodeId }: Props) {
  const router = useRouter();
  const { t } = useTranslate('rule-list');
  const url = endpoints.rules.list(selectedNodeId);
  const { data, error, isLoading } = useSWR(url, fetcher);
  const rows: RuleItem[] = (data && data.data && data.data.list) || [];

  const columns: Column<RuleItem>[] = [
    { key: 'id', label: t('table_header.id'), mono: true, align: 'right', width: 56, color: T.textSec, render: (_r, i) => i + 1 },
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
    { key: 'desc', label: t('table_header.desc'), color: T.textSec, grow: true },
  ];

  return (
    <DataTable<RuleItem>
      columns={columns}
      rows={rows}
      loading={isLoading}
      error={!!error}
      emptyLabel={t('empty')}
      onRowClick={(row) =>
        router.push(`/dashboard/nodes/${selectedNodeId}/rules/${row.name}`)
      }
    />
  );
}
