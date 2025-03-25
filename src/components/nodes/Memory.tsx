'use client';

import { useState, useCallback } from 'react';

import {
  Box,
  Grid,
  Table,
  TableRow,
  TextField,
  TableHead,
  TableCell,
  TableBody,
  Typography,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useDebounce } from 'src/hooks/use-debounce';

import { useGetIssues } from 'src/actions/nodes';

import { TableEmptyRows } from '../table/table-empty-rows';
import { TableErrorRows } from '../table/table-error-rows';
import { TableLoadingRows } from '../table/table-loading-rows';
import TablePaginationCustom from '../common/TablePaginationCustom';

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

  const onChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setOffset(1);
    setLimit(parseInt(event.target.value, 10));
  }, []);

  const onChangePage = useCallback(
    (event: unknown, newPage: number) => {
      setOffset(limit * newPage + 1);
    },
    [limit]
  );
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Grid container>
          <Grid md={3}>
            <Grid
              container
              sx={{
                mb: 2,
                backgroundColor: (theme) => theme.palette.common.white,

                borderRadius: 2,
                border: (theme) => `solid 1px ${theme.palette.divider}`,
              }}
            >
              <Grid
                md={6}
                sx={{ borderRight: (theme) => `solid 1px ${theme.palette.divider}`, py: 2, px: 1 }}
              >
                <Typography variant="body2">Issues</Typography>
                <Typography variant="subtitle1">{issues?.max_issue_count}</Typography>
              </Grid>
              <Grid md={6} sx={{ py: 2, px: 1 }}>
                <Typography variant="body2">Compet</Typography>
                <Typography variant="subtitle1">{issues?.compet_count}</Typography>
              </Grid>
            </Grid>
            <Box display="flex" alignItems="center">
              <TextField
                size="small"
                placeholder="CODE"
                value={code}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setCode(event.target.value);
                }}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: (theme) => theme.palette.common.white,
                  },
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <TablePaginationCustom
        rowsPerPage={limit}
        page={issues.current_page - 1}
        count={issues.max_issue_count}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
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
            <TableLoadingRows height={49} loadingRows={10} />
          ) : issuesEmpty ? (
            <TableEmptyRows text="No data for memory logs" />
          ) : issuesError ? (
            <TableErrorRows />
          ) : (
            issues.issueList.map(
              (
                issue: any,
                index: number // TODO: Fix type
              ) => (
                <TableRow
                  key={index}
                  onClick={() =>
                    router.push(`/dashboard/nodes/${selectedNodeId}/memory/${issue.code}`)
                  }
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
    </>
  );
}
