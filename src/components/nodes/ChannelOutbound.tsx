'use client';

import type { Column } from 'src/components/v5';
import type { IChannelItem } from 'src/types/node';

import { T } from 'src/theme/tokens';
import { useTranslate } from 'src/locales';
import { useGetChannelList } from 'src/actions/nodes';

import { DataTable } from 'src/components/v5';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
};

export function ChannelOutbound({ selectedNodeId }: Props) {
  const { t } = useTranslate('channels');
  const { channels, channelsLoading, channelsError } = useGetChannelList(
    selectedNodeId,
    'outbound'
  );

  const columns: Column<IChannelItem>[] = [
    { key: 'id', label: t('table.id'), width: 70, color: T.textSec },
    { key: 'name', label: t('table.name'), color: T.textSec },
    { key: 'topic', label: t('table.topic'), color: T.textSec },
    { key: 'type', label: t('table.type'), dim: true },
    { key: 'utype', label: t('table.u_type'), dim: true },
    { key: 'port', label: t('table.port'), align: 'right', color: T.textSec },
    { key: 'mip', label: t('table.ip'), color: T.textSec },
    { key: 'nic', label: t('table.nic'), dim: true },
    {
      key: 'count',
      label: t('table.count'),
      align: 'right',
      color: T.textSec,
      render: (r) => r.count?.toLocaleString(),
    },
  ];

  return (
    <DataTable<IChannelItem>
      columns={columns}
      bodyWeight={300}
      headerWeight={400}
      headerSize={17}
      rows={channels || []}
      loading={channelsLoading}
      error={channelsError}
      emptyLabel={t('empty')}
    />
  );
}
