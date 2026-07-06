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

import { Box, Stack, Typography, CircularProgress } from '@mui/material';

import { T, CHART } from 'src/theme/tokens';

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
  // Map each metric bucket to a v5 chart series colour.
  const colorKey: 'cpu' | 'memory' | 'inbound' | 'outbound' = (() => {
    if (metric === 'cpu') return 'cpu';
    if (metric === 'memory') return 'memory';
    if (metric.startsWith('inbound')) return 'inbound';
    if (metric.startsWith('outbound')) return 'outbound';
    return 'cpu';
  })();

  const seriesColor = CHART[colorKey];
  const fillOpacity = 0.2;

  // Only apply threshold highlighting for the CPU chart
  const applyThreshold = colorKey === 'cpu' && threshold !== undefined;

  const formatLargeNumber = (value: number): string => {
    if (value >= 1_000_000) {
      return `${Math.round(value / 1_000_000)}M`;
    }
    if (value >= 1_000) {
      return `${Math.round(value / 1_000)}k`;
    }
    return value.toString();
  };

  const isPercentMetric = metric === 'cpu' || metric === 'memory';
  const minValue = 0;
  const maxValue = isPercentMetric ? 100 : 'auto';

  return (
    <Box
      sx={{
        border: `1px solid ${T.border}`,
        borderRadius: 1,
        backgroundColor: T.bgCard,
        height,
        display: 'flex',
        flexDirection: 'column',
        mr: 0.5,
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
        <Typography sx={{ fontSize: 15, color: T.textSec }}>{title}</Typography>
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
            <CartesianGrid stroke={CHART.grid} fill={T.bgCard} />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 12, fill: T.textDim }}
              tickLine={false}
              axisLine={{ stroke: CHART.grid }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: T.textDim }}
              tickLine={false}
              axisLine={{ stroke: CHART.grid }}
              domain={[minValue, maxValue]}
              tickFormatter={
                metric === 'inbound_bytes' ||
                metric === 'outbound_bytes' ||
                metric === 'inbound_count' ||
                metric === 'outbound_count'
                  ? formatLargeNumber
                  : undefined
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: T.bgPanel,
                borderColor: T.border,
                borderRadius: 4,
              }}
              labelStyle={{ color: T.textSec }}
              itemStyle={{ color: T.textPrim }}
              formatter={(value: number) => value.toLocaleString()}
            />

            {/* Main Area Chart */}
            <Area
              type="linear"
              dataKey={metric}
              stroke={seriesColor}
              fill={seriesColor}
              fillOpacity={fillOpacity}
              strokeLinecap="butt"
            />

            {/* Highlight the entire area above the threshold for CPU */}
            {applyThreshold && (
              <ReferenceArea y1={threshold} y2="auto" fill={`${CHART.threshold}22`} />
            )}

            {/* Solid reference line at the threshold for CPU */}
            {applyThreshold && (
              <ReferenceLine
                y={threshold}
                stroke={CHART.threshold}
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            )}
          </AreaChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
}
