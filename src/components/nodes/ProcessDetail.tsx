'use client';

import type { Column } from 'src/components/v5';
import type { IProcessItem } from 'src/types/dashboard';

import { useRouter } from 'next/navigation';

import { paths } from 'src/routes/paths';

import { T } from 'src/theme/tokens';
import { useTranslate } from 'src/locales';
import { useGetProcesses } from 'src/actions/dashboard';

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
    { key: 'PID', label: t('table_header.pid'), width: 120, color: T.textSec },
    { key: 'NAME', label: t('table_header.name'), color: T.textSec },
    { key: 'PARAM', label: t('table_header.param'), grow: true, color: T.textSec },
    { key: 'CPU', label: t('table_header.cpu'), align: 'right', color: T.textSec },
    {
      key: 'MEM',
      label: t('table_header.mem'),
      align: 'right',
      color: T.textSec,
      render: (r) => Number(r?.MEM)?.toLocaleString(),
    },
    { key: 'PPID', label: t('table_header.ppid'), align: 'right', color: T.textSec },
    { key: 'COMMAND', label: t('table_header.command'), grow: true, color: T.textSec },
  ];

  return (
    <DataTable<IProcessItem>
      columns={columns}
      bodyWeight={300}
      headerWeight={400}
      headerSize={17}
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
