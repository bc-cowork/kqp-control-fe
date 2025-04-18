// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Area,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

import { useTheme } from '@mui/material/styles';
import { Box, Stack, Typography, CircularProgress } from '@mui/material';

import { SegmentedButtonGroupChart } from './SegmentedButtonGroupChart';

interface ChartAreaProps {
  data: { timestamp: string; memory: number }[];
  height: string;
  tabs: {
    value: string;
    label: string;
  }[];
  tabValue: string;
  onTabChange: (value: string) => void;
  loading: boolean;
}

export function ChartAreaDark({
  data,
  height,
  tabs,
  tabValue,
  onTabChange,
  loading,
}: ChartAreaProps) {
  const theme = useTheme();

  const { stroke, fill, fillOpacity } = {
    stroke: '#FFC711',
    fill: '#FFC711',
    fillOpacity: 0.2,
  };

  const minValue = data?.length > 0 ? Math.min(...data.map((point) => point.memory)) : 0;

  return (
    <Box
      sx={{
        height: height || '200px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 1,
      }}
    >
      {/* Chart Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mt: 1, px: 1 }}
      >
        <Typography sx={{ fontSize: 15, color: theme.palette.grey[100] }}>Memory</Typography>
        <SegmentedButtonGroupChart
          tabs={tabs}
          value={tabValue}
          onChange={onTabChange}
          metric="memory"
        />
      </Stack>

      <Typography sx={{ fontSize: 20, color: '#C77F14', px: 1 }}>17.6 / 63.4GB (27%)</Typography>

      {/* Chart */}
      <Box sx={{ flex: 1, minHeight: '100px', width: '100%' }}>
        {/* Ensure chart has space */}
        <ResponsiveContainer width="100%" height="100%">
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <CircularProgress />
            </Box>
          ) : data.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <Typography sx={{ color: theme.palette.grey[100] }}>No data available</Typography>
            </Box>
          ) : (
            <AreaChart data={data} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid stroke={theme.palette.grey[500]} fill={theme.palette.grey[600]} />
              <XAxis
                dataKey="timestamp"
                tick={{ fontSize: 12, fill: theme.palette.grey[100] }}
                tickLine={false}
                axisLine={{ stroke: theme.palette.grey[600] }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: theme.palette.grey[100] }}
                tickLine={false}
                axisLine={{ stroke: theme.palette.grey[600] }}
                domain={[minValue, 'auto']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#373F4E',
                  borderColor: theme.palette.grey[600],
                  borderRadius: 4,
                  boxShadow: theme.shadows[1],
                  color: theme.palette.grey[100],
                }}
                labelStyle={{ color: theme.palette.grey[100] }}
                itemStyle={{ color: theme.palette.grey[100] }}
              />
              <Area
                type="linear"
                dataKey="memory"
                stroke={stroke}
                fill={fill}
                fillOpacity={fillOpacity}
                strokeLinecap="butt"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
