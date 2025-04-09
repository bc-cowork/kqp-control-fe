// components/ChartArea.tsx

import type { ChartDataPoint } from 'src/types/dashboard';

import {
  Area,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
} from 'recharts';

import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

interface ChartAreaProps {
  data: ChartDataPoint[];
  height: string;
  title: string;
  metric: keyof Pick<ChartDataPoint, 'cpu' | 'memory' | 'inbound_bytes' | 'outbound_bytes'>;
  threshold?: number; // Optional threshold for highlighting (e.g., 80 for CPU)
}

export function ChartArea({ data, height, title, metric, threshold }: ChartAreaProps) {
  const theme = useTheme();

  // For the CPU chart, find the range where the value exceeds the threshold
  const thresholdExceedPoints = threshold
    ? data.map((point, index) => ({ ...point, index })).filter((point) => point[metric] > threshold)
    : [];

  // Find continuous ranges where the metric exceeds the threshold
  const thresholdRanges: { x1: number; x2: number }[] = [];
  let startIndex: number | null = null;

  thresholdExceedPoints.forEach((point, i) => {
    if (startIndex === null) {
      startIndex = point.index;
    }
    // If this is the last point or the next point is not consecutive
    if (
      i === thresholdExceedPoints.length - 1 ||
      thresholdExceedPoints[i + 1].index !== point.index + 1
    ) {
      thresholdRanges.push({ x1: startIndex, x2: point.index });
      startIndex = null;
    }
  });

  return (
    <Box
      sx={{
        border: 1,
        borderColor: theme.palette.grey[200],
        borderRadius: 1,
        bgcolor: theme.palette.common.white,
        p: 1,
        height,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Chart Title */}
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
        {title}
      </Typography>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
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
            domain={[0, 'auto']} // Ensure the Y-axis starts at 0
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

          {/* Highlight areas where the metric exceeds the threshold */}
          {threshold &&
            thresholdRanges.map((range, index) => (
              <ReferenceArea
                key={index}
                x1={data[range.x1].timestamp}
                x2={data[range.x2].timestamp}
                y1={threshold}
                y2="auto"
                fill={theme.palette.error.main}
                fillOpacity={0.3}
              />
            ))}

          {/* Main Area Chart */}
          <Area
            type="monotone"
            dataKey={metric}
            stroke={theme.palette.primary.main}
            fill={theme.palette.primary.light}
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
