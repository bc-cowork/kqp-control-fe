'use client';

import type { AuditLogFrameFragItem } from 'src/types/node';

import React, { useState, useCallback } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  Table,
  Paper,
  Button,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { useGetAuditLogFrame } from 'src/actions/nodes';
import { grey, common, primary, success, warning } from 'src/theme/core';

import { Iconify } from '../iconify';
import { TableEmptyRows } from '../table/table-empty-rows';
import { TableErrorRows } from '../table/table-error-rows';
import ArrowSelector from '../audit-log-page/ArrowSelector';
import { TableLoadingRows } from '../table/table-loading-rows';
import TablePaginationCustom from '../common/TablePaginationCustom';
import { CustomTextField } from '../audit-log-page/CustomTextField';
import { AuditLogFrameTop } from '../audit-log-page/AuditLogFrameTop';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  selectedFile: string;
  selectedSeq: string;
};

export function AuditLogFrame({ selectedNodeId, selectedFile, selectedSeq }: Props) {
  const [seq, setSeq] = useState<number>(Number(selectedSeq));
  const [count, setCount] = useState<number | undefined>(undefined);
  const [side, setSide] = useState<'prev' | 'next' | undefined>(undefined);
  const [cond, setCond] = useState<string | undefined>(undefined);
  const [condText, setCondText] = useState<string | undefined>(undefined);
  const [countNum, setCountNum] = useState<number | undefined>(count);
  const [sideText, setSideText] = useState<'prev' | 'next' | undefined>(side);

  const [page, setPage] = useState<number>(0);

  const { auditFrame, auditFrameError, auditFrameLoading, auditFrameFragsEmpty } =
    useGetAuditLogFrame(selectedNodeId, selectedFile, seq, side, count, cond);

  const onMaxFrameRefresh = useCallback((): void => {
    setSeq(1);
    setSide(undefined);
    setCond(undefined);
    setCount(undefined);
  }, []);

  const onChangeRowsPerPage = useCallback((value: number) => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const onNext = () => {
    setSeq(seq + 1);
  };

  const onPrev = () => {
    setSeq(seq - 1);
  };

  const onFirst = () => {
    setSeq(1);
  };

  const onLast = () => {
    setSeq(0);
  };

  const onApply = () => {
    setCond(condText);
    setCount(countNum);
    setSide(sideText);
  };

  return (
    <>
      {auditFrameLoading ? (
        <CircularProgress />
      ) : (
        <AuditLogFrameTop
          selectedFile={selectedFile}
          auditFrame={auditFrame}
          onMaxFrameRefresh={onMaxFrameRefresh}
        />
      )}

      <TablePaginationCustom
        rowsPerPage={count || 40}
        page={5} // doesn't matter in this case
        count={auditFrame.max_frame}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        last
        first
        onPrev={onPrev}
        onNext={onNext}
        onFirst={onFirst}
        onLast={onLast}
        firstDisabled={seq === 1}
        lastDisabled={seq === 0}
        prevDisabled={seq === 1}
        nextDisabled={seq === 0 || seq === auditFrame.max_frame}
        noWord
        sx={{ mb: 1 }}
      />

      <TableContainer component={Paper} sx={{ height: 'calc(100vh - 330px)' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="right">ID</TableCell>
              <TableCell align="right">LEN</TableCell>
              <TableCell align="right">DATA</TableCell>
              <TableCell>Desc.</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ overflow: 'auto' }}>
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
      </TableContainer>

      <Grid
        container
        direction="row"
        sx={{ mt: 2, p: 0.5, backgroundColor: common.white, borderRadius: '12px' }}
      >
        <Grid md={2} direction="row" display="flex" alignItems="center">
          <Typography sx={{ ml: 1.5, fontSize: 15, color: grey[400] }}>Seq</Typography>
          <Typography sx={{ ml: 2, fontSize: 17, color: grey[600], fontWeight: 500 }}>
            {seq}
          </Typography>
        </Grid>

        <Grid md={5.5}>
          <Box display="flex" alignItems="center" sx={{ pr: 1 }}>
            <CustomTextField value={condText} setValue={setCondText} label="Cond" />

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
              placement="top"
              slotProps={{
                tooltip: {
                  sx: {
                    color: common.white,
                    backgroundColor: grey[500],
                  },
                },
              }}
            >
              <Iconify icon="eva:info-outline" color={grey[400]} />
            </Tooltip>
          </Box>
        </Grid>

        <Grid md={2} sx={{ pr: 1 }}>
          <CustomTextField value={countNum} setValue={setCountNum} label="Count" type="number" />
        </Grid>

        <Grid md={1.5} sx={{ pr: 1 }}>
          <ArrowSelector value={sideText} setValue={setSideText} label="Scan" />
        </Grid>

        <Grid md={1}>
          <Button variant="contained" onClick={onApply} sx={{ width: '100%', height: '100%' }}>
            Apply
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
