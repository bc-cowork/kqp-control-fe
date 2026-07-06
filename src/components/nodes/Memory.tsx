'use client';

import type { Column } from 'src/components/v5';

import { useState, useCallback } from 'react';
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

import { Box, Stack, Typography, CircularProgress } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useDebounce } from 'src/hooks/use-debounce';

import { formatNumber } from 'src/utils/helper';
import { formatDateCustom } from 'src/utils/format-time';
import { processMemoryChartData } from 'src/utils/process-chart-data';

import { useTranslate } from 'src/locales';
import { T, ACCENT2, FONT_MONO } from 'src/theme/tokens';
import { useGetMemoryMetrics } from 'src/actions/dashboard';
import { useGetIssues, useGetIssueGraph } from 'src/actions/nodes';

import { Pager, DataTable, SummaryCard } from 'src/components/v5';

import { MemorySearchBar } from '../memory-page/MemorySearchBar';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
};

export function Memory({ selectedNodeId }: Props) {
  const { t } = useTranslate('memory');
  const router = useRouter();

  const [code, setCode] = useState<string>('');
  const debouncedCode = useDebounce(code);
  const [offset, setOffset] = useState<number>(1);
  const [limit, setLimit] = useState<number>(40);

  const { issues, issuesPagination, issuesLoading, issuesError } = useGetIssues(
    selectedNodeId,
    offset,
    limit,
    debouncedCode
  );

  const { issueGraphData, issueGraphDataLoading } = useGetIssueGraph(selectedNodeId);
  const { memoryMetricsData } = useGetMemoryMetrics(selectedNodeId);

  const chartData = processMemoryChartData(issueGraphData) || [];

  // Update the search term and jump back to the first page so results aren't
  // shown against a stale page offset. `debouncedCode` feeds the search API.
  const handleSearchChange = (value: string) => {
    setCode(value);
    setOffset(1);
  };

  const handleResetSearch = () => {
    setCode('');
    setOffset(1);
  };

  const onChangeRowsPerPage = useCallback((newRowsPerPage: number) => {
    setOffset(1);
    setLimit(newRowsPerPage);
  }, []);

  // Pager is 1-based; offset is a 1-based record offset (limit * pageIndex + 1).
  const onChangePage = useCallback(
    (newPage: number) => {
      setOffset(limit * (newPage - 1) + 1);
    },
    [limit]
  );

  const columns: Column<any>[] = [
    {
      key: 'seq',
      label: t('table.seq'),
      mono: true,
      align: 'right',
      width: 60,
      color: T.textSec,
      render: (r) => formatNumber(r.seq),
    },
    { key: 'code', label: t('table.code'), mono: true, color: T.textSec },
    { key: 'name', label: t('table.k_name') },
    {
      key: 'daily_info',
      label: t('table.daily_info'),
      mono: true,
      dim: true,
      grow: true,
      render: (r) =>
        `[${(r.daily_info_dates || [])
          .map((d: number) => (d ? formatDateCustom(d.toString()) : '-'))
          .join(' / ')}]`,
    },
    {
      key: 'compet',
      label: t('table.compet'),
      mono: true,
      align: 'right',
      dim: true,
      render: (r) => (r.compet ? formatDateCustom(r.compet.toString()) : '-'),
    },
  ];

  return (
    <Stack spacing={1.5} sx={{ flex: 1, minHeight: 0 }}>
      {/* Top row: two summary cards + memory usage chart */}
      <Stack direction="row" spacing={1.5} sx={{ height: 210, flexShrink: 0 }}>
        <SummaryCard label={t('left_side.issues')} value={issues?.max_issue_count?.toLocaleString()} />
        <SummaryCard label={t('left_side.compet')} value={issues?.compet_count?.toLocaleString()} />

        <Box
          sx={{
            flex: 1.4,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: T.bgCard,
            border: `1px solid ${T.border}`,
            borderRadius: '6px',
            p: '12px 14px',
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 0.5 }}
          >
            <Typography sx={{ fontSize: 15, color: T.textSec }}>{t('graph.memory')}</Typography>
            <Typography sx={{ fontSize: 14, color: ACCENT2, fontFamily: FONT_MONO }}>
              {memoryMetricsData?.mem_used_size?.toLocaleString()} /{' '}
              {memoryMetricsData?.mem_total_size?.toLocaleString()}GB ({memoryMetricsData?.mem_usage}
              %)
            </Typography>
          </Stack>

          <Box sx={{ flex: 1, minHeight: 0 }}>
            {issueGraphDataLoading ? (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress size={24} />
              </Box>
            ) : chartData.length === 0 ? (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography sx={{ fontSize: 14, color: T.textDim }}>{t('common.no_data')}</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid stroke={T.border} strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="timestamp"
                    tick={{ fontSize: 11, fill: T.textDim }}
                    tickLine={false}
                    axisLine={{ stroke: T.border }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: T.textDim }}
                    tickLine={false}
                    axisLine={{ stroke: T.border }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: T.bgPanel,
                      border: `1px solid ${T.border}`,
                      borderRadius: 6,
                      color: T.textPrim,
                    }}
                    labelStyle={{ color: T.textSec }}
                    itemStyle={{ color: T.textPrim }}
                  />
                  <Area
                    type="monotone"
                    dataKey="memory"
                    stroke={T.primary}
                    fill={T.primary}
                    fillOpacity={0.2}
                    strokeWidth={1.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Box>
        </Box>
      </Stack>

      {/* Search bar */}
      <MemorySearchBar value={code} onChange={handleSearchChange} onReset={handleResetSearch} />

      {/* Pagination */}
      <Pager
        page={issuesPagination?.current_page || 1}
        totalPages={issuesPagination?.total_pages || 1}
        perPage={limit}
        onPageChange={onChangePage}
        onPerPageChange={onChangeRowsPerPage}
      />

      {/* Issues table */}
      <DataTable<any>
        columns={columns}
        rows={issues?.issueList || []}
        loading={issuesLoading}
        error={!!issuesError}
        emptyLabel={t('table.empty')}
        onRowClick={(row) =>
          router.push(`/dashboard/nodes/${selectedNodeId}/memory/${String(row.code)}`)
        }
      />
    </Stack>
  );
}
