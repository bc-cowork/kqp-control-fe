import type { ChartDataPoint } from 'src/types/dashboard';

// eslint-disable-next-line import/no-extraneous-dependencies
import { Bar, XAxis, YAxis, Tooltip, BarChart, CartesianGrid, ResponsiveContainer } from 'recharts';

import { useTheme } from '@mui/material/styles';
import { Box, Stack, Typography, CircularProgress } from '@mui/material';

// Define the props interface
interface ChartBarProps {
  data?: ChartDataPoint[];
  loading?: boolean;
}

// Dummy data for the bar chart (hourly counts for 0H to 24H)
const dummyData: any[] = [
  { timestamp: '0H', count: 10 },
  { timestamp: '1H', count: 15 },
  { timestamp: '2H', count: 20 },
  { timestamp: '3H', count: 25 },
  { timestamp: '4H', count: 30 },
  { timestamp: '5H', count: 35 },
  { timestamp: '6H', count: 40 },
  { timestamp: '7H', count: 45 },
  { timestamp: '8H', count: 50 },
  { timestamp: '9H', count: 55 },
  { timestamp: '10H', count: 200 },
  { timestamp: '11H', count: 250 },
  { timestamp: '12H', count: 60 },
  { timestamp: '13H', count: 65 },
  { timestamp: '14H', count: 70 },
  { timestamp: '15H', count: 75 },
  { timestamp: '16H', count: 80 },
  { timestamp: '17H', count: 85 },
  { timestamp: '18H', count: 90 },
  { timestamp: '19H', count: 95 },
  { timestamp: '20H', count: 40 },
  { timestamp: '21H', count: 100 },
  { timestamp: '22H', count: 105 },
  { timestamp: '23H', count: 110 },
  { timestamp: '24H', count: 115 },
];

export function ChartBar({ data = dummyData, loading = false }: ChartBarProps) {
  const theme = useTheme();

  // Format large numbers for the y-axis (e.g., 1000 -> 1k, 1000000 -> 1M)
  const formatLargeNumber = (value: number): string => {
    if (value >= 1_000_000) {
      return `${Math.round(value / 1_000_000)}M`;
    }
    if (value >= 1_000) {
      return `${Math.round(value / 1_000)}k`;
    }
    return value.toString();
  };

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Chart Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 1, mx: 1 }}
      >
        <Typography sx={{ fontSize: 15, color: theme.palette.grey[400] }}>Today Count</Typography>
      </Stack>

      {/* Chart */}
      <ResponsiveContainer width="100%">
        {loading ? (
          <CircularProgress />
        ) : (
          <BarChart data={data} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={theme.palette.grey[200]} fill="white" vertical={false} />
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
              tickFormatter={formatLargeNumber}
              label={{
                value: 'nn', // Placeholder label as in screenshot
                angle: -90,
                position: 'insideLeft',
                offset: -10,
                fill: theme.palette.text.secondary,
                fontSize: 12,
              }}
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

            {/* Bar Chart with Custom Shape */}
            <Bar
              dataKey="count"
              fill="#DFEAFF" // Light blue fill
              barSize={20}
              shape={<CustomBar />}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </Box>
  );
}

// Custom shape for the bar to add a dark blue top line
const CustomBar = (props: any) => {
  const { x, y, width, height, fill } = props;

  return (
    <g>
      {/* Main bar with light blue fill */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        rx={2} // Rounded top corners
        ry={2}
      />
      {/* Dark blue line at the top */}
      <line
        x1={x}
        y1={y}
        x2={x + width}
        y2={y}
        stroke="#5E66FF" // Dark blue
        strokeWidth={2}
        rx={2} // Rounded top corners
        ry={2}
      />
    </g>
  );
};
