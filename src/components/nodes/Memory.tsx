'use client';

import { useState, useCallback } from 'react';

import {
  Box,
  Grid,
  Table,
  Tooltip,
  TableRow,
  useTheme,
  TextField,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  CircularProgress,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useDebounce } from 'src/hooks/use-debounce';

import { grey, common } from 'src/theme/core';
import { useGetIssues } from 'src/actions/nodes';

import { Iconify } from '../iconify';
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
  const theme = useTheme();
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
    <>
      <Box sx={{ mb: 2 }}>
        <Grid container>
          <Grid md={3}>
            <Grid
              container
              sx={{
                mb: 2,
                backgroundColor: theme.palette.common.white,
                borderRadius: 2,
                border: `solid 1px ${grey[100]}`,
                minHeight: '50px',
              }}
            >
              {issuesLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <Grid
                    md={6}
                    sx={{
                      borderRight: `solid 1px ${theme.palette.divider}`,
                      py: 2,
                      px: 1,
                    }}
                  >
                    <Typography variant="caption">Issues</Typography>
                    <Typography variant="subtitle1" sx={{ color: grey[600], fontSize: 17 }}>
                      {issues?.max_issue_count}
                    </Typography>
                  </Grid>
                  <Grid md={6} sx={{ py: 2, px: 1 }}>
                    <Typography variant="caption">Compet</Typography>
                    <Typography variant="subtitle1" sx={{ color: grey[600], fontSize: 17 }}>
                      {issues?.compet_count}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
            <Box>
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
                    backgroundColor: theme.palette.common.white,
                  },
                }}
              />
            </Box>
          </Grid>
          <Grid md={1} alignContent="flex-end" sx={{ pl: 0.5 }}>
            <Tooltip
              title={
                <>
                  Please enter the 12-digit ISIN code you wish to search for. <br />
                  ex: KR7005930003
                </>
              }
              arrow
              placement="right"
              slotProps={{
                tooltip: {
                  sx: {
                    color: common.white,
                    backgroundColor: grey[500],
                  },
                },
              }}
            >
              <Iconify
                icon="eva:info-outline"
                color={theme.palette.grey[400]}
                width={24}
                height={24}
              />
            </Tooltip>
          </Grid>
          <Grid md={8} alignContent="flex-end">
            <TablePaginationCustom
              rowsPerPage={limit}
              page={issues.current_page - 1}
              count={issues.max_issue_count}
              onPageChange={onChangePage}
              onRowsPerPageChange={onChangeRowsPerPage}
            />
          </Grid>
        </Grid>
      </Box>
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
    </>
  );
}
