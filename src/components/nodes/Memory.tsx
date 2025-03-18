'use client';

import router from 'next/router';
import { useState, useCallback } from 'react';

import { grey } from '@mui/material/colors';
import {
  Box,
  Grid,
  Stack,
  Table,
  Button,
  TableRow,
  TextField,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  TablePagination,
  CircularProgress,
} from '@mui/material';

import { varAlpha } from 'src/theme/styles';
import { useGetIssues } from 'src/actions/nodes';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
};

export function Memory({ selectedNodeId }: Props) {
  const [codeText, setCodeText] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [offset, setOffset] = useState<number>(1);
  const [limit, setLimit] = useState<number>(40);
  const { issues, issuesLoading, issuesEmpty, issuesError } = useGetIssues(
    selectedNodeId,
    offset,
    limit
  );

  const handleUpdateCode = useCallback(() => {
    setCode(codeText);
    handleFirst();
  }, [codeText]);

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
      console.log('onChangePage', newPage);
      setOffset(limit * newPage + 1);
    },
    [limit]
  );
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Grid container>
          <Grid md={6}>
            <Box sx={{ p: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ border: '1px solid', borderColor: grey[500], backgroundColor: grey[200] }}
              >
                <Typography>Issues: </Typography>
                <Typography>{issues?.max_issue_count}</Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ border: '1px solid', borderColor: grey[500], backgroundColor: grey[200] }}
              >
                <Typography>Compet: </Typography>
                <Typography>tbd</Typography>
              </Stack>
            </Box>
          </Grid>
          <Grid md={6}>
            <Box gap={1} display="flex" alignItems="center">
              <TextField
                label="SEQ"
                size="small"
                placeholder="Enter seq here"
                value={codeText}
                type="number"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setCodeText(event.target.value);
                }}
                sx={{ width: 140 }}
              />
              <Button variant="contained" onClick={handleUpdateCode}>
                Apply
              </Button>
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
            <TableRow>
              <TableCell colSpan={6}>
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : issuesEmpty ? (
            <TableRow>
              <TableCell colSpan={6}>Error Fetching Audit Logs List</TableCell>
            </TableRow>
          ) : issuesError ? (
            <TableRow>
              <TableCell colSpan={6}>Error Fetching Audit Logs List</TableCell>
            </TableRow>
          ) : (
            issues.issueList.map(
              (
                issue: any,
                index: number // TODO: Fix type
              ) => (
                <TableRow key={index}>
                  <TableCell>{issue.seq}</TableCell>
                  <TableCell>{issue.code}</TableCell>
                  <TableCell>{issue.kname}</TableCell>
                  <TableCell>{`[${issue.daily_info_dates.join('/ ')}]`}</TableCell>
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
