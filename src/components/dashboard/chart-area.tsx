import type { ChartDataPoint } from 'src/types/dashboard';

// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Area,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

import { useTheme } from '@mui/material/styles';
import { Box, Stack, Typography, CircularProgress } from '@mui/material';

import { SegmentedButtonGroupChart } from './SegmentedButtonGroupChart';

interface ChartAreaProps {
  data: ChartDataPoint[];
  height: string;
  title: string;
  metric: keyof Pick<
    ChartDataPoint,
    'cpu' | 'memory' | 'inbound_bytes' | 'outbound_bytes' | 'inbound_count' | 'outbound_count'
  >;
  tabs: {
    value: string;
    label: string;
  }[];
  tabValue: string;
  onTabChange: (value: string) => void;
  layout: string;
  loading: boolean;
  threshold?: number;
}

export function ChartArea({
  data,
  height,
  title,
  metric,
  tabs,
  tabValue,
  onTabChange,
  layout,
  loading,
  threshold,
}: ChartAreaProps) {
  const theme = useTheme();

  // Define colors for each chart based on tabValue
  const chartColors: Record<
    string,
    Record<string, { stroke: string; fill: string; fillOpacity: number }>
  > = {
    '1x4': {
      CPU: {
        stroke: '#5E66FF', // Blue graph-line
        fill: '#5E66FF', // Blue graph-fill
        fillOpacity: 0.2, // 20% opacity
      },
      Memory: {
        stroke: '#804CE6', // Violet graph-line
        fill: '#804CE6', // Violet graph-fill
        fillOpacity: 0.2, // 20% opacity
      },
      Inbound: {
        stroke: '#41B899', // Green graph-line
        fill: '#41B899', // Green graph-fill
        fillOpacity: 0.2, // 20% opacity
      },
      Outbound: {
        stroke: '#FFC711', // Yellow graph-line
        fill: '#FFC711', // Yellow graph-fill
        fillOpacity: 0.2, // 20% opacity
      },
    },
    '2x2': {
      CPU: {
        stroke: '#5E66FF', // Blue graph-line
        fill: '#5E66FF', // Blue graph-fill
        fillOpacity: 0.2, // 20% opacity
      },
      Memory: {
        stroke: '#FFC711', // Yellow graph-line
        fill: '#FFC711', // Yellow graph-fill
        fillOpacity: 0.2, // 20% opacity
      },
      Inbound: {
        stroke: '#41B899', // Green graph-line
        fill: '#41B899', // Green graph-fill
        fillOpacity: 0.2, // 20% opacity
      },
      Outbound: {
        stroke: '#059BB8', // Aqua graph-line
        fill: '#059BB8', // Aqua graph-fill
        fillOpacity: 0.2, // 20% opacity
      },
    },
  };

  // Get the colors based on the tabValue and title, default to CPU colors if title doesn't match
  const { stroke, fill, fillOpacity } = chartColors[layout]?.[title] ||
    chartColors[layout]?.CPU || {
      stroke: '#5E66FF',
      fill: '#5E66FF',
      fillOpacity: 0.2,
    };

  // Only apply threshold highlighting for the CPU chart
  const applyThreshold = title === 'CPU' && threshold !== undefined;

  const formatLargeNumber = (value: number): string => {
    if (value >= 1_000_000) {
      return `${Math.round(value / 1_000_000)}M`; // e.g., 3,456,789 -> 3M
    }
    if (value >= 1_000) {
      return `${Math.round(value / 1_000)}k`; // e.g., 3,456 -> 3456k
    }
    return value.toString();
  };

  const minValue = data.length > 0 ? Math.min(...data.map((point) => point[metric])) : 0;
  const maxValue = data.length > 0 ? Math.max(...data.map((point) => point[metric])) : 100;

  return (
    <Box
      sx={{
        border: 1,
        borderColor: theme.palette.grey[200],
        borderRadius: 1,
        bgcolor: theme.palette.common.white,
        height,
        display: 'flex',
        flexDirection: 'column',
        mr: 1,
        ...(layout === '1x4' && { pb: 4 }),
      }}
    >
      {/* Chart Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ my: 1, mx: 1 }}
      >
        <Typography sx={{ fontSize: 15, color: theme.palette.grey[400] }}>{title}</Typography>
        <SegmentedButtonGroupChart
          tabs={tabs}
          value={tabValue}
          onChange={onTabChange}
          metric={metric}
        />
      </Stack>

      {/* Chart */}
      <ResponsiveContainer width="100%">
        {loading ? (
          <CircularProgress />
        ) : (
          <AreaChart
            data={data}
            margin={{ top: 0, right: 5, left: -20, bottom: layout === '1x4' ? 10 : 0 }}
          >
            <CartesianGrid stroke={theme.palette.grey[200]} strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              tickLine={false}
              axisLine={{ stroke: theme.palette.grey[200] }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
              tickLine={false}
              axisLine={{ stroke: theme.palette.grey[200] }}
              domain={[minValue, 'auto']}
              tickFormatter={
                metric === 'inbound_bytes' || metric === 'outbound_bytes'
                  ? formatLargeNumber
                  : undefined
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.common.white,
                borderColor: theme.palette.grey[200],
                borderRadius: 4,
                boxShadow: theme.shadows[1],
              }}
              labelStyle={{ color: theme.palette.text.primary }}
              itemStyle={{ color: theme.palette.text.secondary }}
            />

            {/* Main Area Chart */}
            <Area
              type="linear"
              dataKey={metric}
              stroke={stroke}
              fill={fill}
              fillOpacity={fillOpacity}
              strokeLinecap="butt"
            />

            {/* Highlight the entire area above the threshold for CPU with a gradient */}
            {applyThreshold && (
              <ReferenceArea
                y1={threshold} // Start at the threshold (50)
                y2="auto" // Extend to the top of the chart
                fill="url(#thresholdGradient)" // Apply the gradient
              />
            )}

            {/* Draw a straight solid line at the threshold for CPU */}
            {applyThreshold && (
              <ReferenceLine
                y={threshold} // Line at the threshold (50)
                stroke="#FF5B5B" // Red color for the line
                strokeWidth={1}
              />
            )}
          </AreaChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
}
