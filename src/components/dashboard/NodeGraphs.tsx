// components/NodeGraphs.tsx

'use client';

import type { INodeItem, ChartDataPoint } from 'src/types/dashboard';

import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { processChartData } from 'src/utils/process-chart-data';

import { useGetGraphData } from 'src/actions/dashboard';

import { ChartArea } from './chart-area';

// ----------------------------------------------------------------------

interface Props {
  selectedNodeParam: string;
  selectedNode: INodeItem;
  selectedTab: string;
}

export function NodeGraphs({ selectedNodeParam, selectedNode, selectedTab }: Props) {
  const theme = useTheme();

  // Fetch graph data
  const { graphData } = useGetGraphData(selectedNodeParam);

  // Process the data for the charts
  const chartData: ChartDataPoint[] = graphData?.service_status
    ? processChartData(graphData.service_status)
    : [];

  // Calculate the vertical spacing adjustment
  const spacingPx = 1.5 * 8; // 12px (spacing={1.5} * 8px)
  const verticalSpacingAdjustment = selectedTab === '1x4' ? spacingPx * 3 : spacingPx; // 36px for '1x4', 12px for '2x2'

  return (
    <Box
      sx={{
        border: 1,
        borderColor: theme.palette.grey[200],
        borderRadius: 1,
        bgcolor: theme.palette.common.white,
        height: 'calc(100vh - 390px)',
        p: 1.5,
        boxSizing: 'border-box',
      }}
    >
      <Grid container spacing={1.5}>
        <Grid item md={selectedTab === '1x4' ? 12 : 6}>
          <ChartArea
            title="CPU"
            data={chartData}
            metric="cpu"
            threshold={80} // Highlight when CPU > 80
            height={
              selectedTab === '1x4'
                ? `calc(((50vh - 244px) - ${verticalSpacingAdjustment}px) / 2)`
                : `calc((50vh - 244px) - ${verticalSpacingAdjustment}px)`
            }
          />
        </Grid>
        <Grid item md={selectedTab === '1x4' ? 12 : 6}>
          <ChartArea
            title="Memory"
            data={chartData}
            metric="memory"
            height={
              selectedTab === '1x4'
                ? `calc(((50vh - 244px) - ${verticalSpacingAdjustment}px) / 2)`
                : `calc((50vh - 244px) - ${verticalSpacingAdjustment}px)`
            }
          />
        </Grid>
        <Grid item md={selectedTab === '1x4' ? 12 : 6}>
          <ChartArea
            title="Inbound"
            data={chartData}
            metric="inbound_bytes"
            height={
              selectedTab === '1x4'
                ? `calc(((50vh - 244px) - ${verticalSpacingAdjustment}px) / 2)`
                : `calc((50vh - 244px) - ${verticalSpacingAdjustment}px)`
            }
          />
        </Grid>
        <Grid item md={selectedTab === '1x4' ? 12 : 6}>
          <ChartArea
            title="Outbound"
            data={chartData}
            metric="outbound_bytes"
            height={
              selectedTab === '1x4'
                ? `calc(((50vh - 244px) - ${verticalSpacingAdjustment}px) / 2)`
                : `calc((50vh - 244px) - ${verticalSpacingAdjustment}px)`
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
}
