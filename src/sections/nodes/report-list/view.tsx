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

type ReportItem = {
  id: string;
  name: string;
  job_at: string;
  last_exec?: number | string;
  desc?: string;
};

export function ReportListView({ nodeId }: Props) {
  const router = useRouter();
  const { t } = useTranslate('daily-report-list');

  const url = endpoints.report.list(nodeId);
  const { data, error, isLoading } = useSWR(url, fetcher);

  const rows: ReportItem[] = (data && data.data && data.data.list) || [];

  const columns: Column<ReportItem>[] = [
    { key: 'id', label: t('table.id'), mono: true, align: 'right', width: 56, color: T.textSec, render: (_r, i) => i + 1 },
    {
      key: 'name',
      label: t('table.report_name'),
      render: (r) => <span style={{ color: T.primary, fontWeight: 400 }}>{r.name}</span>,
    },
    { key: 'job_at', label: t('table.job_at'), mono: true, align: 'right', color: T.textSec },
    { key: 'last_exec', label: t('table.last_exec'), mono: true, dim: true },
    { key: 'desc', label: t('table.desc'), dim: true, grow: true },
  ];

  return (
    <PageShell node={nodeId} crumbs={[{ label: t('top.title') }]} title={t('top.title')}>
      <DataTable<ReportItem>
        columns={columns}
        rows={rows}
        loading={isLoading}
        error={!!error}
        emptyLabel={t('empty')}
        onRowClick={(row) =>
          router.push(paths.dashboard.nodes.dailyReportDetail(nodeId, String(row.name)))
        }
      />
    </PageShell>
  );
}
