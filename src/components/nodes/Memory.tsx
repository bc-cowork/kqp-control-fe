'use client';

import router from 'next/router';
import { useState, useCallback } from 'react';

import {
  Box,
  Grid,
  Table,
  Button,
  TableRow,
  TextField,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  TablePagination,
} from '@mui/material';

import { useDebounce } from 'src/hooks/use-debounce';

import { varAlpha } from 'src/theme/styles';
import { useGetIssues } from 'src/actions/nodes';

import { TableEmptyRows } from '../table/table-empty-rows';
import { TableErrorRows } from '../table/table-error-rows';
import { TableLoadingRows } from '../table/table-loading-rows';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
};

export function Memory({ selectedNodeId }: Props) {
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

  const handleFirst = () => {
    setOffset(1);
    setLimit(40);
  };

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
      <Box sx={{ mb: 3 }}>
        <Grid container>
          <Grid md={3}>
            <Grid
              container
              sx={{
                mb: 3,
                backgroundColor: (theme) => theme.palette.common.white,

                borderRadius: 2,
                border: (theme) => `solid 1px ${theme.palette.divider}`,
              }}
            >
              <Grid
                md={6}
                sx={{ borderRight: (theme) => `solid 1px ${theme.palette.divider}`, py: 3, px: 1 }}
              >
                <Typography variant="body2">Issues</Typography>
                <Typography variant="subtitle1">{issues?.max_issue_count}</Typography>
              </Grid>
              <Grid md={6} sx={{ py: 3, px: 1 }}>
                <Typography variant="body2">Compet</Typography>
                <Typography variant="subtitle1">TBD</Typography>
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
      <Table
        size="small"
        sx={{
          borderRadius: 2,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
          border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>SEQ</TableCell>
            <TableCell>CODE</TableCell>
            <TableCell>K. Name</TableCell>
            <TableCell>Daily Info</TableCell>
            <TableCell>Compet</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {issuesLoading ? (
            <TableLoadingRows height={49} loadingRows={limit} />
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
                <TableRow key={index}>
                  <TableCell>{issue.seq}</TableCell>
                  <TableCell>{issue.code}</TableCell>
                  <TableCell>{issue.name}</TableCell>
                  <TableCell>{`[${issue.daily_info_dates.join(' / ')}]`}</TableCell>
                  <TableCell>{issue.compet}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        router.push(`#`);
                      }}
                      sx={{
                        backgroundColor: '#F4F6F8',
                        '&:hover': { backgroundColor: '#637381', color: '#F4F6F8' },
                      }}
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )
          )}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        rowsPerPageOptions={[10, 20, 40, 60, 100]}
        rowsPerPage={limit}
        page={issues.current_page - 1}
        count={issues.max_issue_count}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </>
  );
}
