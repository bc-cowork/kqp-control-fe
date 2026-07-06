'use client';

import type { ChartDataPoint } from 'src/types/dashboard';

import Box from '@mui/material/Box';

import { processChartData } from 'src/utils/process-chart-data';

import { useTranslate } from 'src/locales';
import { T, CHART } from 'src/theme/tokens';
import { useGetGraphData } from 'src/actions/dashboard';

import { BigMetric } from '../dashboard/chart-area';

import type { MetricDef } from '../dashboard/chart-area';

// ----------------------------------------------------------------------

interface Props {
  selectedNodeParam: string;
  offline?: boolean;
}

export function NodeGraphsBig({ selectedNodeParam, offline = false }: Props) {
  const { t } = useTranslate('node-dashboard');

  const { graphData, graphDataLoading } = useGetGraphData(selectedNodeParam, 1);
  const data: ChartDataPoint[] = graphData?.metrics ? processChartData(graphData.metrics) : [];

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
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '1px',
        bgcolor: T.border,
        border: `1px solid ${T.border}`,
        borderRadius: '8px',
        overflow: 'hidden',
        height: 1,
        minHeight: 0,
      }}
    >
      {metrics.map((m) => (
        <BigMetric key={m.key} m={m} data={data} offline={offline} loading={graphDataLoading} animKey={selectedNodeParam} />
      ))}
    </Box>
  );
}
