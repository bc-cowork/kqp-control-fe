'use client';

import type { Column } from 'src/components/v5';
import type { INodeItem } from 'src/types/dashboard';

import { useEffect } from 'react';

import Box from '@mui/material/Box';

import { useTranslate } from 'src/locales';

import { T, ACCENT2 } from 'src/theme/tokens';
import { DataTable } from 'src/components/v5';

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
      render: (row) => {
        const on = row.online_status;
        const c = on ? T.on : T.offline;
        return (
          <Box
            component="span"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: 14,
              fontWeight: 500,
              px: '7px',
              py: '2px',
              borderRadius: '3px',
              letterSpacing: '0.04em',
              bgcolor: on ? T.onBg : T.offlineBg,
              color: c,
              border: `1px solid ${c}40`,
            }}
          >
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'currentColor' }} />
            {on ? t('top.on') : t('top.off')}
          </Box>
        );
      },
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
