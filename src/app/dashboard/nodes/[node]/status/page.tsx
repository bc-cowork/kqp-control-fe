'use client';

import type { Column } from 'src/components/v5';

import useSWR from 'swr';

import Box from '@mui/material/Box';

import { endpoints, fetcher } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { ACCENT2 } from 'src/theme/tokens';
import { PageShell, DataTable, StatusBadge, SectionLabel } from 'src/components/v5';

// ----------------------------------------------------------------------

type Props = { params: { node: string } };

type SummaryRow = { key: string; item: string; data: { max: number; cur: number; odd: number; note?: string } };
type TrafficRow = { time: string; channel: string; count: number };

export default function Page({ params }: Props) {
  const { t } = useTranslate('status');
  const { node } = params;
  const url = endpoints.status.list(node);
  const { data, error, isLoading } = useSWR(url, fetcher);

  const serviceSummary = data?.data?.service_status?.summary;
  const traffics = data?.data?.service_status?.traffics;

  const summaryRows: SummaryRow[] = serviceSummary
    ? [
        { key: 'process', item: t('table_top.process'), data: serviceSummary.process },
        { key: 'queue', item: t('table_top.que'), data: serviceSummary.queue },
        { key: 'recv_channel', item: t('table_top.ch_inbound'), data: serviceSummary.recv_channel },
        { key: 'send_channel', item: t('table_top.ch_outbound'), data: serviceSummary.send_channel },
      ]
    : [];

  const inbound: TrafficRow[] =
    traffics?.inbound && Object.keys(traffics.inbound).length > 0 ? traffics.inbound : [];
  const outbound: TrafficRow[] =
    traffics?.outbound && Object.keys(traffics.outbound).length > 0 ? traffics.outbound : [];

  const summaryCols: Column<SummaryRow>[] = [
    { key: 'item', label: t('table_top.item') },
    { key: 'max', label: t('table_top.max'), mono: true, align: 'right', render: (r) => r.data?.max?.toLocaleString() },
    { key: 'cur', label: t('table_top.cur'), mono: true, align: 'right', render: (r) => r.data?.cur?.toLocaleString() },
    {
      key: 'odd',
      label: t('table_top.odd'),
      mono: true,
      align: 'right',
      color: ACCENT2,
      render: (r) => (r.data?.odd > 0 ? r.data.odd.toLocaleString() : ''),
    },
    {
      key: 'status',
      label: t('table_top.status'),
      align: 'right',
      render: (r) => {
        const abnormal = r.data?.odd > 0 || !!r.data?.note;
        // Always surface the English "Abnormal" label in both locales (per design).
        return abnormal ? (
          <StatusBadge on={false} labelOff="Abnormal" color={ACCENT2} />
        ) : (
          <StatusBadge on labelOn={t('badge.normal')} />
        );
      },
    },
  ];

  const trafficCols: Column<TrafficRow>[] = [
    { key: 'time', label: t('table_bottom.time'), mono: true, align: 'center' },
    { key: 'channel', label: t('table_bottom.channel'), mono: true, align: 'center' },
    { key: 'count', label: t('table_bottom.count'), mono: true, align: 'center', render: (r) => r.count?.toLocaleString() },
  ];

  return (
    <PageShell
      node={node}
      scroll={false}
      crumbs={[{ label: t('top.title') }]}
      title={t('top.title')}
    >
      <Box sx={{ flexShrink: 0 }}>
        <DataTable<SummaryRow>
          columns={summaryCols}
          rows={summaryRows}
          loading={isLoading}
          error={!!error}
          emptyLabel={t('table_top.no_data')}
        />
      </Box>

      <Box sx={{ display: 'flex', gap: 1.75, flex: 1, minHeight: 0 }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0, minHeight: 0 }}>
          <SectionLabel>{t('table_top.ch_inbound')}</SectionLabel>
          <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', '& > *': { flex: 1, minHeight: 0 } }}>
            <DataTable<TrafficRow> columns={trafficCols} rows={inbound} dense emptyLabel={t('table_bottom.no_inbound_traffic')} />
          </Box>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0, minHeight: 0 }}>
          <SectionLabel>{t('table_top.ch_outbound')}</SectionLabel>
          <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', '& > *': { flex: 1, minHeight: 0 } }}>
            <DataTable<TrafficRow> columns={trafficCols} rows={outbound} dense emptyLabel={t('table_bottom.no_outbound_traffic')} />
          </Box>
        </Box>
      </Box>
    </PageShell>
  );
}
