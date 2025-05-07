// components/NodeGraphs.tsx

'use client';

import type { ChartDataPoint } from 'src/types/dashboard';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useTabs } from 'src/routes/hooks';

import { processChartData } from 'src/utils/process-chart-data';

import { useTranslate } from 'src/locales';
import { useGetGraphData } from 'src/actions/dashboard';

import { ChartArea } from './chart-area';
import { getBoundTabs } from '../dashboard/NodeGraphs';

// ----------------------------------------------------------------------

interface Props {
  selectedNodeParam: string;
}

export function NodeGraphsBig({ selectedNodeParam }: Props) {
  const { t } = useTranslate('node-dashboard');
  const theme = useTheme();

  const inboundTabs = useTabs(getBoundTabs(t)[0].value);
  const outboundTabs = useTabs(getBoundTabs(t)[0].value);

  // Fetch graph data
  const { graphData, graphDataLoading } = useGetGraphData(selectedNodeParam, 1);

  // Process the data for the charts
  const chartData: ChartDataPoint[] = graphData?.metrics ? processChartData(graphData.metrics) : [];

  return (
    <Box
      sx={{
        bgcolor: theme.palette.common.white,
        height: 'calc(100vh - 187px)',
        p: 1.5,
        pr: '4px',
        borderRadius: '12px',
        boxSizing: 'border-box',
      }}
    >
      <Grid container sx={{ height: '100%' }}>
        <Grid item md={6} sx={{ height: `50%`, pb: 1 }}>
          <ChartArea
            title="CPU"
            titleString={t('graph.cpu')}
            subTitle="10% 4.26GHz"
            data={chartData}
            metric="cpu"
            threshold={50}
            height="100%"
            loading={graphDataLoading}
          />
        </Grid>
        <Grid item md={6} sx={{ height: `50%`, pb: 1 }}>
          <ChartArea
            title="Memory"
            titleString={t('graph.memory')}
            subTitle="10% 4.26GHz"
            data={chartData}
            metric="memory"
            height="100%"
            loading={graphDataLoading}
          />
        </Grid>
        <Grid item md={6} sx={{ height: `50%` }}>
          <ChartArea
            title="Inbound"
            titleString={t('graph.inbound')}
            subTitle="10% 4.26GHz"
            data={chartData}
            metric={inboundTabs.value === 'count' ? 'inbound_count' : 'inbound_bytes'}
            height="100%"
            tabs={getBoundTabs(t)}
            tabValue={inboundTabs.value}
            onTabChange={inboundTabs.onChange}
            loading={graphDataLoading}
          />
        </Grid>
        <Grid item md={6} sx={{ height: `50%` }}>
          <ChartArea
            title="Outbound"
            titleString={t('graph.outbound')}
            subTitle="10% 4.26GHz"
            data={chartData}
            metric={outboundTabs.value === 'count' ? 'outbound_count' : 'outbound_bytes'}
            height="100%"
            tabs={getBoundTabs(t)}
            tabValue={outboundTabs.value}
            onTabChange={outboundTabs.onChange}
            loading={graphDataLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
