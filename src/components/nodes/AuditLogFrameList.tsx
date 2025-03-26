'use client';

import type { AuditLogFrameItem } from 'src/types/node';

import { useState, useCallback } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  Table,
  TableRow,
  useTheme,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CircularProgress,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { formatDateCustom } from 'src/utils/format-time';

import { useAuditFrameList } from 'src/actions/nodes';

import TablePaginationCustom from '../common/TablePaginationCustom';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  selectedFile: string;
};

export function AuditLogFrameList({ selectedNodeId, selectedFile }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(40);
  const [offset, setOffset] = useState<number>(0);

  const { auditFrameList, auditFrameListError, auditFrameListLoading, auditFrameListEmpty } =
    useAuditFrameList(selectedNodeId, selectedFile, page + 1, rowsPerPage, offset, 'desc');

  const onChangeRowsPerPage = useCallback((value: number) => {
    setPage(0);
    setOffset(0);
    setRowsPerPage(value);
  }, []);

  const onChangePage = useCallback(
    (newPage: number) => {
      setPage(newPage);
      if (newPage === 0) {
        setOffset(0);
      } else {
        setOffset(auditFrameList.max_frame);
      }
    },
    [auditFrameList.max_frame]
  );

  return (
    <>
      {auditFrameListLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Box>
            <Grid container>
              <Grid
                md={2}
                sx={{
                  mr: 2,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: theme.palette.common.white,
                    borderTopRightRadius: '8px',
                    borderTopLeftRadius: '16px',
                    height: '8px',
                    width: '96px',
                  }}
                />
                <Box
                  sx={{
                    pt: 1,
                    pb: 2,
                    px: 1,
                    backgroundColor: theme.palette.common.white,
                    borderBottomLeftRadius: '8px',
                    borderBottomRightRadius: '8px',
                  }}
                >
                  <Typography variant="caption">Filename</Typography>
                  <Typography variant="subtitle1">{selectedFile}</Typography>
                </Box>
              </Grid>
              <Grid
                md={1.3}
                sx={{
                  py: 2,
                  px: 1,
                  backgroundColor: theme.palette.common.white,
                  borderTopLeftRadius: '8px',
                  borderBottomLeftRadius: '8px',
                  borderRight: `solid 1px ${theme.palette.divider}`,
                }}
              >
                <Typography variant="caption">Desc</Typography>
                <Typography variant="subtitle1">Inbound</Typography>
              </Grid>
              <Grid
                md={1.3}
                sx={{
                  py: 2,
                  px: 1,
                  backgroundColor: theme.palette.common.white,
                  borderRight: `solid 1px ${theme.palette.divider}`,
                }}
              >
                <Typography variant="caption">Max Frame</Typography>
                <Typography variant="subtitle1">{auditFrameList?.max_frame}</Typography>
              </Grid>
              <Grid
                md={1.3}
                sx={{
                  py: 2,
                  px: 1,
                  backgroundColor: theme.palette.common.white,
                  borderRight: `solid 1px ${theme.palette.divider}`,
                }}
              >
                <Typography variant="caption">File Size</Typography>
                <Typography variant="subtitle1">
                  {auditFrameList?.file_size?.toLocaleString()}
                </Typography>
              </Grid>
              <Grid
                md={1.3}
                sx={{
                  py: 2,
                  px: 1,
                  backgroundColor: theme.palette.common.white,
                  borderTopRightRadius: '8px',
                  borderBottomRightRadius: '8px',
                }}
              >
                <Typography variant="caption">Date</Typography>
                <Typography variant="subtitle1">
                  {formatDateCustom(auditFrameList?.date?.toString())}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <TablePaginationCustom
            rowsPerPage={rowsPerPage}
            page={page}
            count={auditFrameList.max_frame}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            sx={{ mb: 1 }}
          />
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="right">Seq</TableCell>
                <TableCell align="right">HEAD</TableCell>
                <TableCell align="right">RID</TableCell>
                <TableCell align="right">Size</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {auditFrameListEmpty ? (
                <TableRow>
                  <TableCell colSpan={6}>Audit Logs List Empty</TableCell>
                </TableRow>
              ) : auditFrameListError ? (
                <TableRow>
                  <TableCell colSpan={6}>Error Fetching Audit Logs List</TableCell>
                </TableRow>
              ) : (
                auditFrameList.frame_list.map((auditFrame: AuditLogFrameItem, index: number) => (
                  <TableRow
                    key={index}
                    onClick={() => {
                      router.push(
                        `/dashboard/nodes/${selectedNodeId}/audit-log/${selectedFile}/frame`
                      );
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell align="right">{auditFrame.seq}</TableCell>
                    <TableCell align="right">{auditFrame.head}</TableCell>
                    <TableCell align="right">{auditFrame.rid}</TableCell>
                    <TableCell align="right">{auditFrame.size}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </>
      )}
    </>
  );
}
