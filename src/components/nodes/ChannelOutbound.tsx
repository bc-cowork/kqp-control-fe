'use client';

import type { Column } from 'src/components/v5';
import type { IChannelItem } from 'src/types/node';

import { useGetChannelList } from 'src/actions/nodes';

import { useTranslate } from 'src/locales';
import { T } from 'src/theme/tokens';
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
    { key: 'id', label: t('table.id'), mono: true, width: 70, color: T.textSec },
    { key: 'name', label: t('table.name'), color: T.textSec },
    { key: 'topic', label: t('table.topic'), color: T.textSec },
    { key: 'type', label: t('table.type'), dim: true },
    { key: 'utype', label: t('table.u_type'), dim: true },
    { key: 'port', label: t('table.port'), mono: true, align: 'right', color: T.textSec },
    { key: 'mip', label: t('table.ip'), mono: true, color: T.textSec },
    { key: 'nic', label: t('table.nic'), mono: true, dim: true },
    {
      key: 'count',
      label: t('table.count'),
      mono: true,
      align: 'right',
      color: T.textSec,
      render: (r) => r.count?.toLocaleString(),
    },
  ];

  return (
    <DataTable<IChannelItem>
      columns={columns}
      rows={channels || []}
      loading={channelsLoading}
      error={channelsError}
      emptyLabel={t('empty')}
    />
  );
}
