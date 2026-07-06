import type { ChartDataPoint } from 'src/types/dashboard';

// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Area,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  CartesianGrid,
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

const CHART_COLORS: Record<string, string> = {
  CPU: CHART.cpu,
  Memory: CHART.memory,
  Inbound: CHART.inbound,
  Outbound: CHART.outbound,
};

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
  const color = CHART_COLORS[title] || CHART.cpu;

  // Only apply threshold highlighting for the CPU chart
  const applyThreshold = title === 'CPU' && threshold !== undefined;

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

  const isEmpty = !loading && (!data || data.length === 0);

  const useLargeFormatter =
    metric === 'inbound_bytes' ||
    metric === 'outbound_bytes' ||
    metric === 'inbound_count' ||
    metric === 'outbound_count';

  return (
    <Box
      sx={{
        border: `1px solid ${T.border}`,
        bgcolor: T.bgCard,
        borderRadius: 1,
        height,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Chart Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 1, mx: 1.25 }}
      >
        <Typography sx={{ fontSize: 15, color: T.textSec }}>{titleString}</Typography>
        {tabs && tabValue && onTabChange && (
          <SegmentedButtonGroupChart
            tabs={tabs}
            value={tabValue}
            onChange={onTabChange}
            metric={metric}
          />
        )}
      </Stack>
      <Typography
        sx={{ fontSize: 20, color: isEmpty ? T.textDim : color, fontWeight: 500, mb: 1, mx: 1.25 }}
      >
        {subTitle}
      </Typography>

      {/* Chart */}
      <ResponsiveContainer width="100%">
        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <CircularProgress size={24} sx={{ color: T.primary }} />
          </Box>
        ) : isEmpty ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography sx={{ fontSize: 15, color: T.textDim }}>— no data</Typography>
          </Box>
        ) : (
          <AreaChart data={data} margin={{ top: 0, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={CHART.grid} />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 13, fill: T.textDim }}
              tickLine={false}
              axisLine={{ stroke: CHART.grid }}
            />
            <YAxis
              tick={{ fontSize: 13, fill: T.textDim }}
              tickLine={false}
              axisLine={{ stroke: CHART.grid }}
              domain={[minValue, maxValue]}
              tickFormatter={useLargeFormatter ? formatLargeNumber : undefined}
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
              stroke={color}
              fill={color}
              fillOpacity={0.2}
              strokeWidth={1.6}
              strokeLinecap="butt"
            />

            {/* Threshold reference line (CPU only) */}
            {applyThreshold && (
              <ReferenceLine
                y={threshold}
                stroke={CHART.threshold}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            )}
          </AreaChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
}
