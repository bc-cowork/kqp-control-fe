'use client';

import { useState, useCallback } from 'react';

import {
  Box,
  Grid,
  Table,
  Paper,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { useTabs, useRouter } from 'src/routes/hooks';

import { useDebounce } from 'src/hooks/use-debounce';

import { fDate, formatDateCustom } from 'src/utils/format-time';
import { formatNumber } from 'src/utils/helper';
import { processMemoryChartData } from 'src/utils/process-chart-data';

import { useTranslate } from 'src/locales';
import { grey, common } from 'src/theme/core';
import { useGetIssues, useGetIssueGraph } from 'src/actions/nodes';

import FadingDivider from '../common/FadingDivider';
import { TableEmptyRows } from '../table/table-empty-rows';
import { TableErrorRows } from '../table/table-error-rows';
import { ChartAreaDark } from '../memory-page/ChartAreaDark';
import { TableLoadingRows } from '../table/table-loading-rows';
import { MemorySearchBar } from '../memory-page/MemorySearchBar';
import TablePaginationCustom from '../common/TablePaginationCustom';

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
  const { issues, issuesPagination, issuesLoading, issuesEmpty, issuesError } = useGetIssues(
    selectedNodeId,
    offset,
    limit,
    debouncedCode
  );

  const { issueGraphData, issueGraphDataLoading } = useGetIssueGraph(selectedNodeId);

  const graphTabs = useTabs('%');

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

  const onChangePage = useCallback(
    (newPage: number) => {
      setOffset(limit * newPage + 1);
    },
    [limit]
  );

  const chartHeight = `380px`;

  const chartData = processMemoryChartData(issueGraphData);

  return (
    <Grid container>
      {/* LEFT SECTION: Always 12 columns up to lg, then 3 columns from lg up.
        The left-side padding (pr) is removed for xs screens when stacked vertically.
      */}
      <Grid
        xs={12}
        lg={3}
        sx={{ pr: { xs: 0, lg: 1.25 } }}
      >
        <Box sx={{ p: 0, borderRadius: 1.5, mb: { xs: 2, lg: 0 } }}>
          <Grid
            container
          >
            {issuesLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid
                container
                lg={12}
                xs={12}
                sm={10}
                md={6}
                sx={{
                  backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'transparent' : 'black',
                  padding: '4px',
                  borderRadius: '12px'
                }}
              >
                {/* STAT BOX 1 */}
                <Grid item xs={6} sm={6} lg={6}
                  sx={{
                    pr: '4px',
                    pb: '4px'
                  }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(180deg, #202838 80%, #373F4E 100%)',
                      borderRadius: '8px',
                      border: '1px solid #4E576A',
                      p: 1.5,
                      height: '100%', // Ensures consistent height
                    }}
                  >
                    <Typography sx={{ fontSize: 15, fontWeight: 500, color: common.white }}>
                      {t('left_side.issues')}
                    </Typography>
                    <FadingDivider />
                    <Typography
                      sx={{
                        fontSize: 28,
                        fontWeight: 400,
                        color: common.white,
                        textAlign: 'right',
                      }}
                    >
                      {issues?.max_issue_count?.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>

                {/* STAT BOX 2 */}
                <Grid item xs={6} sm={6} lg={6}
                  sx={{
                    pb: '4px'
                  }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(180deg, #202838 80%, #373F4E 100%)',
                      borderRadius: '8px',
                      border: '1px solid #4E576A',
                      p: 1.5,
                      height: '100%', // Ensures consistent height
                    }}
                  >
                    <Typography sx={{ fontSize: 15, fontWeight: 500, color: common.white }}>
                      {t('left_side.compet')}
                    </Typography>
                    <FadingDivider />
                    <Typography
                      sx={{
                        fontSize: 28,
                        fontWeight: 400,
                        color: common.white,
                        textAlign: 'right',
                      }}
                    >
                      {issues?.compet_count?.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>

                {/* CHART */}
                <Grid item xs={12} sm={12} lg={12}>
                  <Box
                    sx={{
                      borderRadius: '8px',
                      height: chartHeight,
                      backgroundColor: '#202838',
                      border: '1px solid #4E576A',
                    }}
                  >
                    <ChartAreaDark
                      selectedNodeId={selectedNodeId}
                      title={t('graph.memory')}
                      data={chartData}
                      height="100%"
                      tabs={[{ value: '%', label: '%' }]}
                      tabValue={graphTabs.value}
                      onTabChange={graphTabs.onChange}
                      loading={issueGraphDataLoading}
                    />
                  </Box>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Box>
      </Grid>

      {/* RIGHT SECTION (TABLE): Always 12 columns up to lg, then 9 columns from lg up.
        The right-side padding (pl) is removed for xs screens when stacked vertically.
      */}
      <Grid
        xs={12}
        lg={9}
        sx={{
          pl: { xs: 0, lg: 1.25 }
        }}
      >
        <MemorySearchBar
          value={code}
          onChange={handleSearchChange}
          onReset={handleResetSearch}
        />
        <Box
          sx={{
            pb: 1.5,
            px: 1.5,
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'transparent' : 'white',
          }}
        >
          <Box sx={{ py: 1, overflow: 'auto' }}>
            <TablePaginationCustom
              rowsPerPage={limit}
              currentPage={issuesPagination?.current_page || 1}
              totalPages={issuesPagination?.total_pages || 1}
              hasNextPage={issuesPagination?.has_next_page || false}
              hasPreviousPage={issuesPagination?.has_previous_page || false}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          </Box>
          <TableContainer component={Paper} sx={{ height: 'calc(100vh - 310px)', width: 'auto', overflow: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="right">{t('table.seq')}</TableCell>
                  <TableCell>{t('table.code')}</TableCell>
                  <TableCell>{t('table.k_name')}</TableCell>
                  <TableCell>{t('table.daily_info')}</TableCell>
                  <TableCell align="right">{t('table.compet')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {issuesLoading ? (
                  <TableLoadingRows height={20} loadingRows={10} />
                ) : issuesEmpty ? (
                  <TableEmptyRows text="No data for memory logs" />
                ) : issuesError ? (
                  <TableErrorRows
                    text={typeof issuesError === 'string' ? issuesError : 'Error fetching list'}
                  />
                ) : (
                  issues.issueList.map(
                    (
                      issue: any, // TODO: Fix type
                      index: number
                    ) => (
                      <TableRow
                        key={index}
                        onClick={() =>
                          router.push(`/dashboard/nodes/${selectedNodeId}/memory/${String(issue.code)}`)
                        }
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell align="right">{formatNumber(issue.seq)}</TableCell>
                        <TableCell>{issue.code}</TableCell>
                        <TableCell>{issue.name}</TableCell>
                        <TableCell>
                          {`[${issue.daily_info_dates
                            .map((d: number) => (d ? formatDateCustom(d.toString()) : '-'))
                            .join(' / ')}]`}
                        </TableCell>
                        <TableCell align="right">{fDate(issue.compet, 'YYYY-MM-DD')}</TableCell>
                      </TableRow>
                    )
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
    </Grid>
  );
}