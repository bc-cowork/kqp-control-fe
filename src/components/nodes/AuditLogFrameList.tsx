'use client';

import type { AuditLogFrameItem } from 'src/types/node';

import { useState, useCallback } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  Stack,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TablePagination,
  CircularProgress,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { grey } from 'src/theme/core';
import { varAlpha } from 'src/theme/styles';
import { useAuditFrameList } from 'src/actions/nodes';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  selectedFile: string;
};

export function AuditLogFrameList({ selectedNodeId, selectedFile }: Props) {
  const router = useRouter();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(40);
  const [offset, setOffset] = useState<number>(0);

  const { auditFrameList, auditFrameListError, auditFrameListLoading, auditFrameListEmpty } =
    useAuditFrameList(selectedNodeId, selectedFile, page + 1, rowsPerPage, offset, 'desc');

  const onChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setOffset(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  const onChangePage = useCallback(
    (event: unknown, newPage: number) => {
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
          <Box sx={{ mb: 2 }}>
            <Grid container>
              <Grid md={4}>
                <Box sx={{ p: 2 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ border: '1px solid', borderColor: grey[500], backgroundColor: grey[200] }}
                  >
                    <Typography>Filename: </Typography>
                    <Typography>{selectedFile}</Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ border: '1px solid', borderColor: grey[500], backgroundColor: grey[200] }}
                  >
                    <Typography>File Size: </Typography>
                    <Typography>{auditFrameList.file_size}</Typography>
                  </Stack>
                </Box>
              </Grid>
              <Grid md={4}>
                <Box sx={{ p: 2 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ border: '1px solid', borderColor: grey[500], backgroundColor: grey[200] }}
                  >
                    <Typography>Desc </Typography>
                    <Typography>Inbound</Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ border: '1px solid', borderColor: grey[500], backgroundColor: grey[200] }}
                  >
                    <Typography>Date </Typography>
                    <Typography>{auditFrameList.date}</Typography>
                  </Stack>
                </Box>
              </Grid>
              <Grid md={4}>
                <Box sx={{ p: 2 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ border: '1px solid', borderColor: grey[500], backgroundColor: grey[200] }}
                  >
                    <Typography>Max Frame </Typography>
                    <Typography>{auditFrameList.max_frame}</Typography>
                  </Stack>
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
                <TableCell>Seq</TableCell>
                <TableCell>HEAD</TableCell>
                <TableCell>RID</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Actions</TableCell>
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
                  <TableRow key={index}>
                    <TableCell>{auditFrame.seq}</TableCell>
                    <TableCell>{auditFrame.head}</TableCell>
                    <TableCell>{auditFrame.rid}</TableCell>
                    <TableCell>{auditFrame.size}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          router.push(
                            `/dashboard/nodes/${selectedNodeId}/audit-log/${selectedFile}/frame`
                          );
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
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            rowsPerPageOptions={[10, 20, 40, 60, 100]}
            rowsPerPage={rowsPerPage}
            page={page}
            count={auditFrameList.max_frame}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />
        </>
      )}
    </>
  );
}
