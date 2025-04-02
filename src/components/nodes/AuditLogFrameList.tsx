'use client';

import type { AuditLogFrameItem } from 'src/types/node';

import { useState, useCallback } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  Table,
  SvgIcon,
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

import { grey } from 'src/theme/core';
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
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const { auditFrameList, auditFrameListError, auditFrameListLoading, auditFrameListEmpty } =
    useAuditFrameList(
      selectedNodeId,
      selectedFile,
      page + 1,
      rowsPerPage,
      offset,
      'desc',
      refreshKey
    );

  const resetCache = () => {
    setRefreshKey((prev) => prev + 1);
  };

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

  const onMaxFrameRefresh = () => {
    resetCache();
    setOffset(0);
    setPage(0);
  };

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
                    borderTopRightRadius: '8px',
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
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Typography variant="caption">Max Frame</Typography>
                  <SvgIcon
                    sx={{
                      height: 24,
                      width: 24,
                      cursor: 'pointer',
                      p: 0.5,
                      borderRadius: '4px',
                      '&:hover': { backgroundColor: grey[50] },
                      '&:active': { backgroundColor: '#D1D6D0', border: '1px solid #667085' },
                    }}
                    onClick={onMaxFrameRefresh}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.79811 7.00104C1.79811 4.13197 4.13783 1.80104 7.03031 1.80104C8.99489 1.80104 10.7061 2.87693 11.6008 4.46777H9.53301C9.23846 4.46777 8.99967 4.70656 8.99967 5.00111C8.99967 5.29566 9.23846 5.53444 9.53301 5.53444H12.8663C13.1609 5.53444 13.3997 5.29566 13.3997 5.00111V1.66777C13.3997 1.37322 13.1609 1.13444 12.8663 1.13444C12.5718 1.13444 12.333 1.37322 12.333 1.66777V3.61761C11.2127 1.88315 9.25609 0.734375 7.03031 0.734375C3.55436 0.734375 0.731445 3.53724 0.731445 7.00104C0.731445 10.4648 3.55436 13.2677 7.03031 13.2677C10.186 13.2677 12.8023 10.9584 13.2588 7.94082C13.3028 7.64958 13.1025 7.37777 12.8112 7.33371C12.52 7.28965 12.2482 7.49003 12.2041 7.78127C11.826 10.2807 9.65511 12.201 7.03031 12.201C4.13783 12.201 1.79811 9.87009 1.79811 7.00104Z"
                        fill="#667085"
                      />
                    </svg>
                  </SvgIcon>
                </Box>
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
            first
            last
            sx={{ mb: 1, mt: 2 }}
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
                        `/dashboard/nodes/${selectedNodeId}/audit-log/${selectedFile}/${auditFrame.seq}`
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
