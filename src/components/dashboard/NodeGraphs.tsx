// components/NodeGraphs.tsx

'use client';

import type { TFunction } from 'i18next';
import type { ChartDataPoint } from 'src/types/dashboard';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2'; // Using Unstable_Grid2 for modern usage
import { useTheme } from '@mui/material/styles';

import { useTabs } from 'src/routes/hooks';

import { processChartData } from 'src/utils/process-chart-data';

import { useTranslate } from 'src/locales';
import { useGetGraphData } from 'src/actions/dashboard';

import { ChartArea } from './chart-area';

// ----------------------------------------------------------------------

interface Props {
  selectedNodeParam: string;
  refreshKey: number;
  selectedTab: string;
}

const CPU_MEMORY_TABS = [{ value: '%', label: '%' }];

export const getBoundTabs = (t: TFunction) => [
  { value: 'count', label: t('graph.count') },
  { value: 'byte', label: t('graph.byte') },
];

export function NodeGraphs({ selectedNodeParam, refreshKey, selectedTab }: Props) {
  const { t } = useTranslate('dashboard');
  const theme = useTheme();

  const cpuTabs = useTabs(CPU_MEMORY_TABS[0].value);
  const memoryTabs = useTabs(CPU_MEMORY_TABS[0].value);
  const inboundTabs = useTabs(getBoundTabs(t)[0].value);
  const outboundTabs = useTabs(getBoundTabs(t)[0].value);

  // Fetch graph data
  const { graphData, graphDataLoading } = useGetGraphData(selectedNodeParam, refreshKey);

  // Process the data for the charts
  const chartData: ChartDataPoint[] = graphData?.metrics ? processChartData(graphData.metrics) : [];

  const is1x4Layout = selectedTab === '1x4';

  const baseGridXs = is1x4Layout ? 12 : 6;

  const chartGridProps = {
    xs: 12,
    sm: baseGridXs,
  };

  const chartHeight = is1x4Layout ? '121px' : '250px';

  return (
    <Box
      sx={{
        pl: 0.5,
        boxSizing: 'border-box',
        minHeight: '500px',
        width: '100%'
      }}
    >
      <Grid container spacing={1} sx={{ height: '100%' }}>

        {/* CPU Chart */}
        <Grid
          {...chartGridProps}
          sx={{
            height: chartHeight,
            mb: 1 // Margin Bottom for spacing
          }}
        >
          <ChartArea
            title={t('graph.cpu')}
            data={chartData}
            metric="cpu"
            threshold={50}
            height="100%"
            tabs={CPU_MEMORY_TABS}
            tabValue={cpuTabs.value}
            onTabChange={cpuTabs.onChange}
            layout={selectedTab}
            loading={graphDataLoading}
          />
        </Grid>

        {/* Memory Chart */}
        <Grid
          {...chartGridProps}
          sx={{
            height: chartHeight,
            mb: 1
          }}
        >
          <ChartArea
            title={t('graph.memory')}
            data={chartData}
            metric="memory"
            height="100%"
            tabs={CPU_MEMORY_TABS}
            tabValue={memoryTabs.value}
            onTabChange={memoryTabs.onChange}
            layout={selectedTab}
            loading={graphDataLoading}
          />
        </Grid>

        {/* Inbound Chart */}
        <Grid
          {...chartGridProps}
          sx={{
            height: chartHeight,
            mb: (is1x4Layout || !is1x4Layout) ? 1 : 0
          }}
        >
          <ChartArea
            title={t('graph.inbound')}
            data={chartData}
            metric={inboundTabs.value === 'count' ? 'inbound_count' : 'inbound_bytes'}
            height="100%"
            tabs={getBoundTabs(t)}
            tabValue={inboundTabs.value}
            onTabChange={inboundTabs.onChange}
            layout={selectedTab}
            loading={graphDataLoading}
          />
        </Grid>

        {/* Outbound Chart */}
        <Grid
          {...chartGridProps}
          sx={{
            height: chartHeight,
            mb: 0
          }}
        >
          <ChartArea
            title={t('graph.outbound')}
            data={chartData}
            metric={outboundTabs.value === 'count' ? 'outbound_count' : 'outbound_bytes'}
            height="100%"
            tabs={getBoundTabs(t)}
            tabValue={outboundTabs.value}
            onTabChange={outboundTabs.onChange}
            layout={selectedTab}
            loading={graphDataLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
}