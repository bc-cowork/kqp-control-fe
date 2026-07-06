'use client';

import type { Column } from 'src/components/v5';
import type { IProcessItem } from 'src/types/dashboard';

import { useRouter } from 'next/navigation';

import { paths } from 'src/routes/paths';

import { useGetProcesses } from 'src/actions/dashboard';

import { useTranslate } from 'src/locales';
import { T } from 'src/theme/tokens';
import { DataTable } from 'src/components/v5';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
};

export function ProcessDetail({ selectedNodeId }: Props) {
  const router = useRouter();
  const { t } = useTranslate('process');
  const { processes, processLoading, processError } = useGetProcesses(selectedNodeId) as {
    processes: IProcessItem[];
    processLoading: boolean;
    processError: boolean;
  };

  const columns: Column<IProcessItem>[] = [
    { key: 'PID', label: t('table_header.pid'), mono: true, width: 120, color: T.textSec },
    { key: 'NAME', label: t('table_header.name'), color: T.textSec },
    { key: 'PARAM', label: t('table_header.param'), mono: true, dim: true, grow: true },
    {
      key: 'CPU',
      label: t('table_header.cpu'),
      mono: true,
      align: 'right',
      render: (r) => <span style={{ color: Number(r.CPU) > 0 ? T.primary : T.textSec }}>{r.CPU}</span>,
    },
    {
      key: 'MEM',
      label: t('table_header.mem'),
      mono: true,
      align: 'right',
      color: T.textSec,
      render: (r) => Number(r?.MEM)?.toLocaleString(),
    },
    { key: 'PPID', label: t('table_header.ppid'), mono: true, align: 'right', dim: true },
    { key: 'COMMAND', label: t('table_header.command'), mono: true, dim: true, grow: true },
  ];

  return (
    <DataTable<IProcessItem>
      columns={columns}
      rows={processes || []}
      loading={processLoading}
      error={processError}
      emptyLabel={t('empty')}
      onRowClick={(row) =>
        router.push(paths.dashboard.nodes.processDetail(selectedNodeId, String(row.APPCODE)))
      }
    />
  );
}
