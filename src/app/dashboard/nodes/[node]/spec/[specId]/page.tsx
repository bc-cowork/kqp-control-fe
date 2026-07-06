'use client';

import type { Column } from 'src/components/v5';

import useSWR from 'swr';
import React from 'react';
import { useRouter } from 'next/navigation';

import Box from '@mui/material/Box';

import { paths } from 'src/routes/paths';

import { formatBytes } from 'src/utils/helper';
import { fetcher, endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { T, FONT_MONO } from 'src/theme/tokens';

import { SpecChip, DataTable, PageShell, SectionLabel } from 'src/components/v5';

// ----------------------------------------------------------------------

type Props = {
  params: {
    node: string;
    specId: string;
  };
};

type IdentifyRow = { id?: number; name: string; ref_count: number; url: string };

type FragRow = { order: number; offset: number; length: number; type: string; desc: string };

type SpecDetail = {
  name?: string;
  path?: string;
  timestamp?: string;
  ref_identifies?: number;
  frags?: number;
  size?: number;
  desc?: string;
  related_identifies?: IdentifyRow[];
  spec_definition?: FragRow[];
};

export default function Page({ params }: Props) {
  const { node, specId } = params;
  const router = useRouter();
  const { t } = useTranslate('spec-detail');

  const url = endpoints.spec.detail(node, decodeURIComponent(specId));
  const { data, error, isLoading } = useSWR(url, fetcher);

  const detail: SpecDetail = data?.data?.detail || {};
  const specName = detail?.name;
  const identifiers: IdentifyRow[] = detail.related_identifies || [];
  const frags: FragRow[] = Array.isArray(detail.spec_definition) ? detail.spec_definition : [];

  // Summary row — single-row light table.
  const summaryColumns: Column<SpecDetail>[] = [
    {
      key: 'name',
      label: t('table.spec_name'),
      render: (r) => <span style={{ color: T.primary, fontWeight: 400 }}>{r.name}</span>,
    },
    { key: 'path', label: t('table.path'), mono: true, dim: true },
    { key: 'timestamp', label: t('table.timestamp'), mono: true, dim: true },
    { key: 'ref_identifies', label: t('table.ref_identifies'), mono: true, align: 'right', color: T.textSec },
    {
      key: 'frags',
      label: t('table.frags'),
      mono: true,
      align: 'right',
      color: T.textSec,
      render: (r) => r.frags?.toLocaleString() ?? '—',
    },
    {
      key: 'size',
      label: t('table.size'),
      mono: true,
      align: 'right',
      color: T.textSec,
      render: (r) => (r.size != null ? formatBytes(r.size) : '—'),
    },
    { key: 'desc', label: t('table.explanation'), dim: true, grow: true },
  ];
  const summaryRows: SpecDetail[] = specName ? [detail] : [];

  // Left — Related Identifiers.
  const identifierColumns: Column<IdentifyRow>[] = [
    { key: 'no', label: t('left.no'), mono: true, align: 'right', width: 60, color: T.textSec, render: (_r, i) => i + 1 },
    {
      key: 'name',
      label: t('left.identifier'),
      render: (r) => (
        <Box
          component="span"
          onClick={() =>
            router.push(
              paths.dashboard.nodes.identifyDetail(node, r.url.split('/').filter(Boolean).pop() || '')
            )
          }
          sx={{ color: T.primary, fontWeight: 400, fontFamily: FONT_MONO, cursor: 'pointer' }}
        >
          {r.name}
        </Box>
      ),
    },
    { key: 'ref_count', label: t('left.ref_count'), mono: true, align: 'right', grow: true, color: T.textSec },
  ];

  // Right — Spec Definition (tri-colour SpecChips).
  const fragColumns: Column<FragRow>[] = [
    { key: 'order', label: t('right.order'), mono: true, width: 64, color: T.textSec },
    {
      key: 'offset',
      label: t('right.offset'),
      width: 96,
      render: (r) => <SpecChip tone="green">{r.offset}</SpecChip>,
    },
    {
      key: 'length',
      label: t('right.len'),
      width: 84,
      render: (r) => <SpecChip tone="blue">{r.length}</SpecChip>,
    },
    {
      key: 'type',
      label: t('right.type'),
      width: 88,
      render: (r) => <SpecChip tone="amber">{r.type}</SpecChip>,
    },
    { key: 'desc', label: t('right.desc'), dim: true, grow: true },
  ];

  return (
    <PageShell
      node={node}
      crumbs={[
        { label: t('top.spec_list'), onClick: () => router.push(paths.dashboard.nodes.specList(node)) },
        { label: specName || '-' },
      ]}
      title={`${t('top.title_prefix')} : ${specName || ''}`}
    >
      <DataTable<SpecDetail>
        headerVariant="light"
        columns={summaryColumns}
        rows={summaryRows}
        loading={isLoading}
        error={!!error}
        emptyLabel={t('empty_detail')}
      />

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
        <Box sx={{ flex: 5, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <SectionLabel>{t('section_identifiers')}</SectionLabel>
          <DataTable<IdentifyRow>
            columns={identifierColumns}
            rows={identifiers}
            loading={isLoading}
            error={!!error}
            emptyLabel={t('empty_identifiers')}
          />
        </Box>

        <Box sx={{ flex: 7, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <SectionLabel>{t('section_definition')}</SectionLabel>
          <DataTable<FragRow>
            columns={fragColumns}
            rows={frags}
            loading={isLoading}
            error={!!error}
            emptyLabel={t('empty_definition')}
          />
        </Box>
      </Box>
    </PageShell>
  );
}
