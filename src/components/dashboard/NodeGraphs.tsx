'use client';

import type { ChartDataPoint } from 'src/types/dashboard';

import Box from '@mui/material/Box';

import { processChartData } from 'src/utils/process-chart-data';

import { useTranslate } from 'src/locales';
import { T, CHART } from 'src/theme/tokens';
import { useGetGraphData } from 'src/actions/dashboard';

import { BigMetric } from './chart-area';

import type { MetricDef } from './chart-area';

// ----------------------------------------------------------------------

interface Props {
  selectedNodeParam: string;
  refreshKey: number;
  selectedTab: string;
  offline?: boolean;
}

export function NodeGraphs({ selectedNodeParam, refreshKey, selectedTab, offline = false }: Props) {
  const { t } = useTranslate('dashboard');

  const { graphData, graphDataLoading } = useGetGraphData(selectedNodeParam, refreshKey);
  const data: ChartDataPoint[] = graphData?.metrics ? processChartData(graphData.metrics) : [];

  const compact = selectedTab === '1x4';

  const metrics: MetricDef[] = [
    { key: 'cpu', title: t('graph.cpu'), color: CHART.cpu, threshold: 50, variants: [{ metric: 'cpu', fmt: 'percent' }] },
    { key: 'memory', title: t('graph.memory'), color: CHART.memory, variants: [{ metric: 'memory', fmt: 'percent' }] },
    {
      key: 'inbound',
      title: t('graph.inbound'),
      color: CHART.inbound,
      variants: [
        { label: t('graph.count'), metric: 'inbound_count', fmt: 'count' },
        { label: t('graph.byte'), metric: 'inbound_bytes', fmt: 'bytes' },
      ],
    },
    {
      key: 'outbound',
      title: t('graph.outbound'),
      color: CHART.outbound,
      variants: [
        { label: t('graph.count'), metric: 'outbound_count', fmt: 'count' },
        { label: t('graph.byte'), metric: 'outbound_bytes', fmt: 'bytes' },
      ],
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: compact ? '1fr' : '1fr 1fr',
        gridTemplateRows: compact ? '1fr 1fr 1fr 1fr' : '1fr 1fr',
        gap: '1px',
        bgcolor: T.border,
        m: '0 12px',
        borderRadius: '6px',
        overflow: 'hidden',
        flex: 1,
        minHeight: 0,
      }}
    >
      {metrics.map((m) => (
        <BigMetric key={m.key} m={m} data={data} compact={compact} offline={offline} loading={graphDataLoading} animKey={selectedNodeParam} />
      ))}
    </Box>
  );
}
