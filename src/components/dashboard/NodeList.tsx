'use client';

import type { Column } from 'src/components/v5';
import type { INodeItem } from 'src/types/dashboard';

import { useEffect } from 'react';

import { useTranslate } from 'src/locales';

import { T, ACCENT2 } from 'src/theme/tokens';
import { DataTable, StatusBadge } from 'src/components/v5';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  selectedNode: INodeItem | undefined;
  setSelectedNodeId: (id: string) => void;
  setSelectedNode: (node: INodeItem | undefined) => void;
  nodes: INodeItem[];
  nodesLoading: boolean;
  nodesEmpty: boolean;
  nodesError: any;
};

export function NodeList({
  selectedNodeId,
  selectedNode,
  setSelectedNodeId,
  setSelectedNode,
  nodes,
  nodesLoading,
  nodesEmpty,
  nodesError,
}: Props) {
  const { t } = useTranslate('dashboard');

  useEffect(() => {
    if (!nodesLoading && !nodesEmpty && !nodesError && !selectedNode && !selectedNodeId) {
      setSelectedNodeId(nodes[0].id);
      setSelectedNode(nodes[0]);
    }
  }, [
    nodes,
    nodesLoading,
    nodesEmpty,
    nodesError,
    selectedNode,
    selectedNodeId,
    setSelectedNodeId,
    setSelectedNode,
  ]);

  const selectedIndex = selectedNode
    ? nodes?.findIndex((node) => node.id === selectedNode.id)
    : -1;

  const columns: Column<INodeItem>[] = [
    {
      key: 'online_status',
      label: t('node.state'),
      width: 96,
      render: (row) => (
        <StatusBadge on={row.online_status} labelOn={t('top.on')} labelOff={t('top.off')} />
      ),
    },
    {
      key: 'id',
      label: t('node.id'),
      mono: true,
      render: (row, index) => (
        <span style={{ color: index === selectedIndex ? ACCENT2 : T.textSec }}>{row.id}</span>
      ),
    },
    { key: 'name', label: t('node.name'), color: T.textPrim },
    { key: 'desc', label: t('node.description'), dim: true, grow: true },
    {
      key: 'emittable',
      label: t('node.emittable'),
      render: (row) =>
        row.emittable ? (
          <span style={{ color: ACCENT2 }}>{t('info.true')}</span>
        ) : (
          <span style={{ color: T.textDim }}>— —</span>
        ),
    },
    {
      key: 'emit_count',
      label: t('node.emit_count'),
      mono: true,
      align: 'right',
      color: T.textSec,
      render: (row) => row.emit_count.toLocaleString(),
    },
  ];

  return (
    <DataTable<INodeItem>
      columns={columns}
      rows={nodes || []}
      loading={nodesLoading}
      error={!!nodesError}
      emptyLabel={t('node.empty')}
      selectedIndex={selectedIndex >= 0 ? selectedIndex : null}
      onRowClick={(row) => {
        setSelectedNode(row);
        setSelectedNodeId(row.id);
      }}
    />
  );
}
