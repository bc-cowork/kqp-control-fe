'use client';

import { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Grid,
  Table,
  Paper,
  styled,
  Divider,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useDebounce } from 'src/hooks/use-debounce';

import { grey, common } from 'src/theme/core';
import { useGetIssues } from 'src/actions/nodes';

import AddFilter from '../common/AddFilter';
import { TableEmptyRows } from '../table/table-empty-rows';
import { TableErrorRows } from '../table/table-error-rows';
import { TableLoadingRows } from '../table/table-loading-rows';
import TablePaginationCustom from '../common/TablePaginationCustom';

import type { Filter } from '../common/AddFilter';

// ----------------------------------------------------------------------

const FadingDivider = styled(Divider)(({ theme }) => ({
  height: '1px',
  background: `linear-gradient(to right, transparent, ${theme.palette.grey[400]}, transparent)`,
  border: 'none',
  margin: '16px 0',
  '&:before, &:after': {
    display: 'none',
  },
}));

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
};

export function Memory({ selectedNodeId }: Props) {
  const router = useRouter();
  const [code, setCode] = useState<string>('');
  const debouncedCode = useDebounce(code);
  const [offset, setOffset] = useState<number>(1);
  const [limit, setLimit] = useState<number>(40);
  const { issues, issuesLoading, issuesEmpty, issuesError } = useGetIssues(
    selectedNodeId,
    offset,
    limit,
    debouncedCode
  );

  const [filters, setFilters] = useState<Filter | null>(null);

  useEffect(() => {
    if (filters) {
      const filterCode = Array.isArray(filters)
        ? filters.find((filter: { code: any }) => filter.code)?.code
        : null;
      if (!filterCode) {
        setCode('');
      }
    } else {
      setCode('');
    }
  }, [filters]);

  const handleSearch = (filter: any) => {
    if (filter?.code) {
      setCode(filter.code);
    }
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

  return (
    <Grid container>
      <Grid md={3} sx={{ pr: 1.25 }}>
        <Box sx={{ p: 1.5, backgroundColor: '#202838', borderRadius: 1.5 }}>
          <Grid
            container
            sx={{
              mb: 2,
              minHeight: '50px',
            }}
          >
            {issuesLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Grid md={6} sx={{ pr: 0.5 }}>
                  <Box
                    sx={{
                      backgroundColor: grey[600],
                      borderRadius: '8px',
                      border: `1px solid ${grey[500]}`,
                      p: 1.5,
                    }}
                  >
                    <Typography sx={{ fontSize: 15, fontWeight: 500, color: common.white }}>
                      Issues
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
                      {issues?.max_issue_count}
                    </Typography>
                  </Box>
                </Grid>
                <Grid md={6} sx={{ pl: 0.5 }}>
                  <Box
                    sx={{
                      backgroundColor: grey[600],
                      borderRadius: '8px',
                      border: `1px solid ${grey[500]}`,
                      p: 1.5,
                    }}
                  >
                    <Typography sx={{ fontSize: 15, fontWeight: 500, color: common.white }}>
                      Compet
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
                      {issues?.compet_count}
                    </Typography>
                  </Box>
                </Grid>
                <Grid md={12}>
                  <Box
                    sx={{
                      borderRadius: '8px',
                      border: `1px solid ${grey[500]}`,
                      p: 1.5,
                      mt: 1,
                    }}
                  >
                    graph 1
                  </Box>
                </Grid>
                <Grid md={12}>
                  <Box
                    sx={{
                      borderRadius: '8px',
                      border: `1px solid ${grey[500]}`,
                      p: 1.5,
                      mt: 1,
                    }}
                  >
                    graph 2
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </Grid>
      <Grid md={9} sx={{ pl: 1.25 }}>
        <AddFilter
          filters={filters}
          setFilters={setFilters}
          page="Memory"
          onApply={handleSearch}
          count={issues.max_issue_count}
        />
        <Box
          sx={{
            pb: 1.5,
            px: 1.5,
            backgroundColor: common.white,
            borderBottomLeftRadius: 1.5,
            borderBottomRightRadius: 1.5,
          }}
        >
          <Box sx={{ py: 1 }}>
            <TablePaginationCustom
              rowsPerPage={limit}
              page={(issues?.current_page || 1) - 1}
              count={issues.max_issue_count}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          </Box>
          <TableContainer component={Paper} sx={{ height: 'calc(100vh - 310px)' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="right">SEQ</TableCell>
                  <TableCell>CODE</TableCell>
                  <TableCell>K. Name</TableCell>
                  <TableCell>Daily Info</TableCell>
                  <TableCell align="right">Compet</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {issuesLoading ? (
                  <TableLoadingRows height={20} loadingRows={10} />
                ) : issuesEmpty ? (
                  <TableEmptyRows text="No data for memory logs" />
                ) : issuesError ? (
                  <TableErrorRows />
                ) : (
                  issues.issueList.map(
                    (
                      issue: any, // TODO: Fix type
                      index: number
                    ) => (
                      <TableRow
                        key={index}
                        onClick={() =>
                          router.push(`/dashboard/nodes/${selectedNodeId}/memory/${issue.code}`)
                        }
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell align="right">{issue.seq}</TableCell>
                        <TableCell>{issue.code}</TableCell>
                        <TableCell>{issue.name}</TableCell>
                        <TableCell>{`[${issue.daily_info_dates.join(' / ')}]`}</TableCell>
                        <TableCell align="right">{issue.compet}</TableCell>
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
