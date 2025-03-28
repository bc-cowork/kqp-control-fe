'use client';

import type { AuditLogFrameFragItem } from 'src/types/node';

import { useState, useCallback } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  Stack,
  Table,
  Button,
  Tooltip,
  SvgIcon,
  TableRow,
  useTheme,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
} from '@mui/material';

import { formatDateCustom } from 'src/utils/format-time';

import { useGetAuditLogFrame } from 'src/actions/nodes';
import { primary, success, warning } from 'src/theme/core';

import { Iconify } from '../iconify';
import { TableEmptyRows } from '../table/table-empty-rows';
import { TableErrorRows } from '../table/table-error-rows';
import { TableLoadingRows } from '../table/table-loading-rows';
import TablePaginationCustom from '../common/TablePaginationCustom';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  selectedFile: string;
  selectedSeq: string;
};

export function AuditLogFrame({ selectedNodeId, selectedFile, selectedSeq }: Props) {
  const theme = useTheme();
  const [seq, setSeq] = useState<number>(Number(selectedSeq));
  const [count, setCount] = useState<number | undefined>(undefined);
  const [side, setSide] = useState<'prev' | 'next' | undefined>(undefined);
  const [cond, setCond] = useState<string | undefined>(undefined);
  const [condText, setCondText] = useState<string | undefined>(undefined);
  const [countNum, setCountNum] = useState<number | undefined>(count);

  const [page, setPage] = useState<number>(0);

  const { auditFrame, auditFrameError, auditFrameLoading, auditFrameFragsEmpty } =
    useGetAuditLogFrame(selectedNodeId, selectedFile, seq, side, count, cond);

  const onMaxFrameRefresh = useCallback((): void => {
    setSeq(0);
    setSide(undefined);
    setCond(undefined);
    setCount(undefined);
    setPage(0);
  }, []);

  const onChangeRowsPerPage = useCallback((value: number) => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return (
    <>
      <Box>
        <Grid container sx={{ mb: 2 }}>
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
            md={0.9}
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
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption">Max Frame</Typography>
              <SvgIcon
                sx={{ height: 13, width: 13, cursor: 'pointer', mr: 1 }}
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
            <Typography variant="subtitle1">{auditFrame?.max_frame}</Typography>
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
            <Typography variant="subtitle1">{auditFrame?.file_size?.toLocaleString()}</Typography>
          </Grid>
          <Grid
            mr={2}
            md={1.1}
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
              {formatDateCustom(auditFrame?.date?.toString())}
            </Typography>
          </Grid>
          <Grid
            md={1}
            sx={{
              py: 2,
              px: 1,
              backgroundColor: theme.palette.common.white,
              borderTopLeftRadius: '8px',
              borderBottomLeftRadius: '8px',
              borderRight: `solid 1px ${theme.palette.divider}`,
            }}
          >
            <Typography variant="caption">Seq</Typography>
            <Typography variant="subtitle1">{auditFrame?.seq}</Typography>
          </Grid>
          <Grid
            md={1.4}
            sx={{
              py: 2,
              px: 1,
              backgroundColor: theme.palette.common.white,
              borderRight: `solid 1px ${theme.palette.divider}`,
            }}
          >
            <Typography variant="caption">Time</Typography>
            <Typography variant="subtitle1">{auditFrame?.time}</Typography>
          </Grid>
          <Grid
            md={0.7}
            sx={{
              py: 2,
              px: 1,
              backgroundColor: theme.palette.common.white,
              borderRight: `solid 1px ${theme.palette.divider}`,
            }}
          >
            <Typography variant="caption">Size</Typography>
            <Typography variant="subtitle1">{auditFrame?.size}</Typography>
          </Grid>
          <Grid
            md={1}
            sx={{
              py: 2,
              px: 1,
              backgroundColor: theme.palette.common.white,
              borderRight: `solid 1px ${theme.palette.divider}`,
            }}
          >
            <Typography variant="caption">Head</Typography>
            <Typography variant="subtitle1">{auditFrame?.head}</Typography>
          </Grid>
          <Grid
            md={0.7}
            sx={{
              py: 2,
              px: 1,
              backgroundColor: theme.palette.common.white,
              borderTopRightRadius: '8px',
              borderBottomRightRadius: '8px',
            }}
          >
            <Typography variant="caption">RID</Typography>
            <Typography variant="subtitle1">{auditFrame?.rid}</Typography>
          </Grid>
        </Grid>
      </Box>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Box gap={1} display="flex" alignItems="center">
          <TextField
            label="Cond"
            size="small"
            placeholder="Enter cond here"
            value={condText}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCondText(event.target.value);
            }}
            sx={{ width: 340 }}
          />

          <Tooltip
            title={
              <>
                Examples: <br />
                {`- sd[1]:asStr()=='B6'`} <br />
                {`- sd[1]:asStr()=='B6' and sd[3]:asStr()=='K'`}
                <br />
                {`- sd[1]:asStr()=='B6' and sd[3]:asStr()=='K' and
                sd[7]:asStr()=='KR7035900000'"`}
              </>
            }
            arrow
            placement="right"
          >
            <Iconify icon="eva:info-outline" />
          </Tooltip>
        </Box>

        <Box gap={1} display="flex" alignItems="center">
          <TextField
            label="Count"
            size="small"
            placeholder="Enter count here"
            value={countNum}
            type="number"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setCountNum(Number(event.target.value));
            }}
            sx={{ width: 140 }}
          />
          <Button variant="contained" onClick={() => setCount(countNum)}>
            Apply
          </Button>
        </Box>

        <TablePaginationCustom
          rowsPerPage={count || 40}
          page={page}
          count={auditFrame.max_frame}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </Stack>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="right">ID</TableCell>
            <TableCell align="right">LEN</TableCell>
            <TableCell align="right">DATA</TableCell>
            <TableCell>Desc.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {auditFrameLoading ? (
            <TableLoadingRows height={20} loadingRows={10} />
          ) : auditFrameFragsEmpty ? (
            <TableEmptyRows />
          ) : auditFrameError ? (
            <TableErrorRows />
          ) : (
            auditFrame.frags.map((auditFrameFrag: AuditLogFrameFragItem, index: number) => (
              <TableRow key={index}>
                <TableCell align="right">
                  <Box
                    component="span"
                    sx={{
                      backgroundColor: '#EBFBE9',
                      color: success.dark,
                      border: `1px solid #DDF4DA`,
                      borderRadius: '4px',
                      px: 0.5,
                    }}
                  >
                    {auditFrameFrag.id}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box
                    component="span"
                    sx={{
                      backgroundColor: '#EFF6FF',
                      color: primary.dark,
                      border: `1px solid #DFEAFF`,
                      borderRadius: '4px',
                      px: 0.5,
                    }}
                  >
                    {auditFrameFrag.len}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box
                    component="span"
                    sx={{
                      backgroundColor: '#FFF9EC',
                      color: warning.dark,
                      border: `1px solid #FFEFBD`,
                      borderRadius: '4px',
                      px: 0.5,
                    }}
                  >
                    {auditFrameFrag.data}
                  </Box>
                </TableCell>
                <TableCell>{auditFrameFrag.desc}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}
