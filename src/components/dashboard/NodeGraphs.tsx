// components/NodeGraphs.tsx

'use client';

import type { ChartDataPoint } from 'src/types/dashboard';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useTabs } from 'src/routes/hooks';

import { processChartData } from 'src/utils/process-chart-data';

import { useGetGraphData } from 'src/actions/dashboard';

import { ChartArea } from './chart-area';

// ----------------------------------------------------------------------

interface Props {
  selectedNodeParam: string;
  refreshKey: number;
  selectedTab: string;
}

const CPU_MEMORY_TABS = [{ value: '%', label: '%' }];

const BOUND_TABS = [
  { value: 'count', label: 'count' },
  { value: 'byte', label: 'byte' },
];

export function NodeGraphs({ selectedNodeParam, refreshKey, selectedTab }: Props) {
  const theme = useTheme();

  const cpuTabs = useTabs(CPU_MEMORY_TABS[0].value);
  const memoryTabs = useTabs(CPU_MEMORY_TABS[0].value);
  const inboundTabs = useTabs(BOUND_TABS[0].value);
  const outboundTabs = useTabs(BOUND_TABS[0].value);

  // Fetch graph data
  const { graphData, graphDataLoading } = useGetGraphData(selectedNodeParam, refreshKey);

  // Process the data for the charts
  const chartData: ChartDataPoint[] = graphData?.metrics ? processChartData(graphData.metrics) : [];

  return (
    <Box
      sx={{
        // border: 1,
        // borderColor: theme.palette.grey[200],
        // borderRadius: 1,
        bgcolor: theme.palette.common.white,
        height: 'calc(100vh - 390px)',
        px: 0.5,
        boxSizing: 'border-box',
      }}
    >
      <Grid container spacing={0.5} sx={{ height: '100%' }}>
        <Grid
          item
          md={selectedTab === '1x4' ? 12 : 6}
          sx={{ height: selectedTab === '1x4' ? `25%` : `50%` }}
        >
          <ChartArea
            title="CPU"
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
        <Grid
          item
          md={selectedTab === '1x4' ? 12 : 6}
          sx={{ height: selectedTab === '1x4' ? `25%` : `50%` }}
        >
          <ChartArea
            title="Memory"
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
        <Grid
          item
          md={selectedTab === '1x4' ? 12 : 6}
          sx={{ height: selectedTab === '1x4' ? `25%` : `50%` }}
        >
          <ChartArea
            title="Inbound"
            data={chartData}
            metric={inboundTabs.value === 'count' ? 'inbound_count' : 'inbound_bytes'}
            height="100%"
            tabs={BOUND_TABS}
            tabValue={inboundTabs.value}
            onTabChange={inboundTabs.onChange}
            layout={selectedTab}
            loading={graphDataLoading}
          />
        </Grid>
        <Grid
          item
          md={selectedTab === '1x4' ? 12 : 6}
          sx={{ height: selectedTab === '1x4' ? `25%` : `50%` }}
        >
          <ChartArea
            title="Outbound"
            data={chartData}
            metric={outboundTabs.value === 'count' ? 'outbound_count' : 'outbound_bytes'}
            height="100%"
            tabs={BOUND_TABS}
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
