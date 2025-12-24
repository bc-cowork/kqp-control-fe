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
  titleString: string;
  subTitle: string;
  metric: keyof Pick<
    ChartDataPoint,
    'cpu' | 'memory' | 'inbound_bytes' | 'outbound_bytes' | 'inbound_count' | 'outbound_count'
  >;
  loading: boolean;
  threshold?: number;
  tabs?: {
    value: string;
    label: string;
  }[];
  tabValue?: string;
  onTabChange?: (value: string) => void;
}

export function ChartArea({
  data,
  height,
  title,
  titleString,
  subTitle,
  metric,
  loading,
  threshold,
  tabs,
  tabValue,
  onTabChange,
}: ChartAreaProps) {
  const theme = useTheme();

  // Define colors for each chart based on tabValue
  const chartColors = {
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
  };

  // Get the colors based on the tabValue and title, default to CPU colors if title doesn't match
  const { stroke, fill, fillOpacity } = chartColors?.[title as keyof typeof chartColors] ||
    chartColors?.CPU || {
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

  const minValue = 0;
  const maxValue = 100;

  const fillColor = theme.palette.mode === 'dark' ? theme.palette.grey[800] : 'white'
  const strokeColor = theme.palette.mode === 'dark' ? theme.palette.grey[500] : theme.palette.grey[100]
  const fillXis = theme.palette.mode === 'dark' ? theme.palette.grey[400] : '#AFB7C8'



  return (
    <Box
      sx={{
        border: 1,
        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[500] : theme.palette.grey[50],
        bgcolor: theme.palette.mode === 'dark' ? '#141C2A' : '#F9FAFB',
        borderRadius: 1,
        height,
        display: 'flex',
        flexDirection: 'column',
        mr: 1,
      }}
    >
      {/* Chart Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 1, mx: 1 }}
      >
        <Typography sx={{ fontSize: 15, color: theme.palette.grey[300] }}>{titleString}</Typography>
        {tabs && tabValue && onTabChange && (
          <SegmentedButtonGroupChart
            tabs={tabs}
            value={tabValue}
            onChange={onTabChange}
            metric={metric}
          />
        )}
      </Stack>
      <Typography sx={{ fontSize: 20, color: stroke, fontWeight: 500, mb: 1, mx: 1 }}>
        {subTitle}
      </Typography>

      {/* Chart */}
      <ResponsiveContainer width="100%">
        {loading ? (
          <CircularProgress />
        ) : (
          <AreaChart data={data} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={strokeColor} fill={fillColor} />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 12, fill: fillXis }}
              tickLine={false}
              axisLine={{ stroke: strokeColor }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: fillXis }}
              tickLine={false}
              axisLine={{ stroke: strokeColor }}
              domain={[minValue, maxValue]}
              tickFormatter={
                metric === 'inbound_bytes' || metric === 'outbound_bytes'
                  ? formatLargeNumber
                  : undefined
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme.palette.grey[900],
                borderColor: theme.palette.grey[600],
                borderRadius: 4,
                boxShadow: theme.shadows[1],
              }}
              labelStyle={{ color: theme.palette.text.primary }}
              itemStyle={{ color: theme.palette.grey[400] }}
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
