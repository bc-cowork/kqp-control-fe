'use client';

import type { AuditLogFrameFragItem } from 'src/types/node';

import React, { useState, useEffect, useCallback } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  Table,
  Paper,
  Stack,
  Button,
  Dialog,
  Tooltip,
  SvgIcon,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { useGetAuditLogFrame } from 'src/actions/nodes';
import { grey, error, common, primary, success, warning } from 'src/theme/core';

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
  const [apiSeq, setApiSeq] = useState<number>(Number(selectedSeq));
  const [count, setCount] = useState<number | undefined>(undefined);
  const [side, setSide] = useState<'prev' | 'next' | undefined>(undefined);
  const [cond, setCond] = useState<string | undefined>(undefined);
  const [condText, setCondText] = useState<string | undefined>(undefined);
  const [countNum, setCountNum] = useState<number | undefined>(10000);
  const [sideText, setSideText] = useState<'prev' | 'next' | undefined>('next');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [dialogMessage, setDialogMessage] = useState<string>('');

  const { auditFrame, auditFrameError, auditFrameLoading, auditFrameFragsEmpty } =
    useGetAuditLogFrame(selectedNodeId, selectedFile, apiSeq, side, count, cond, refreshKey);

  useEffect(() => {
    if (auditFrame?.seq !== undefined && auditFrame.seq !== seq) {
      setSeq(auditFrame.seq);
    }
  }, [auditFrame, seq]);

  const resetCache = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const resetSearch = () => {
    setSide(undefined);
    setCond(undefined);
    setCount(undefined);
    resetCache();
  };

  const onMaxFrameRefresh = () => {
    setSeq(0);
    setApiSeq(0);
    resetSearch();
  };

  const onChangeRowsPerPage = useCallback((value: number) => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const onNext = () => {
    resetSearch();
    const newSeq = seq + 1;
    setSeq(newSeq);
    setApiSeq(newSeq);
    resetCache();
  };

  const onPrev = () => {
    resetSearch();
    const newSeq = seq - 1;
    setSeq(newSeq);
    setApiSeq(newSeq);
  };

  const onFirst = () => {
    resetSearch();
    setSeq(1);
    setApiSeq(1);
  };

  const onLast = () => {
    resetSearch();
    setSeq(0);
    setApiSeq(0);
  };

  const onApply = () => {
    // Validation logic
    let errorMessage = '';

    if (countNum === undefined || countNum <= 0) {
      errorMessage = 'Count is required and must be a positive number.';
    } else if (!sideText) {
      errorMessage = 'Scan direction (prev/next) is required.';
    }

    if (errorMessage) {
      setDialogMessage(errorMessage);
      setDialogOpen(true);
      return;
    }

    setCond(condText);
    setCount(countNum);
    setSide(sideText);
    setApiSeq(seq);
    resetCache();
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogMessage('');
  };

  function onKeyDownHandler(event: any) {
    if (event.key === 'Enter') {
      event.preventDefault();
      onApply();
    }
  }

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
        firstDisabled={apiSeq === 1}
        lastDisabled={false}
        prevDisabled={apiSeq === 1}
        nextDisabled={apiSeq === 0 || apiSeq === auditFrame.max_frame}
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
            <CustomTextField
              value={condText}
              setValue={setCondText}
              label="Cond"
              onKeyDown={(e) => onKeyDownHandler(e)}
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
              placement="top"
              slotProps={{
                tooltip: {
                  sx: {
                    color: common.white,
                    backgroundColor: grey[500],
                    boxShadow: '0px 4px 20px 0px rgba(10, 14, 21, 0.20)',
                  },
                },
              }}
            >
              <Iconify icon="eva:info-outline" color={grey[400]} />
            </Tooltip>
          </Box>
        </Grid>

        <Grid md={2} sx={{ pr: 1 }}>
          <CustomTextField
            value={countNum}
            setValue={setCountNum}
            label="Count"
            type="number"
            onKeyDown={(e) => onKeyDownHandler(e)}
          />
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

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        sx={{
          '& .MuiPaper-root': {
            background: '#FFF2F4',
            py: 3,
            px: 1.5,
            border: `1px solid #FFD8D8`,
            borderRadius: '8px',
          },
        }}
      >
        <DialogTitle sx={{ p: 0 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >
            <Stack direction="row" alignItems="center">
              <SvgIcon height="20" width="20" sx={{ mr: 0.5 }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.30865 2.07922C9.61592 1.53088 10.3841 1.53088 10.6913 2.07922L18.6419 16.2675C18.9491 16.8159 18.565 17.5013 17.9505 17.5013H2.04949C1.43496 17.5013 1.05088 16.8159 1.35814 16.2675L9.30865 2.07922Z"
                    fill="#FF3D4A"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.66699 6.66797C9.39085 6.66797 9.16699 6.89183 9.16699 7.16797V12.0013C9.16699 12.2774 9.39085 12.5013 9.66699 12.5013H10.3337C10.6098 12.5013 10.8337 12.2774 10.8337 12.0013V7.16797C10.8337 6.89183 10.6098 6.66797 10.3337 6.66797H9.66699ZM9.66699 13.3346C9.39085 13.3346 9.16699 13.5585 9.16699 13.8346V14.5013C9.16699 14.7774 9.39085 15.0013 9.66699 15.0013H10.3337C10.6098 15.0013 10.8337 14.7774 10.8337 14.5013V13.8346C10.8337 13.5585 10.6098 13.3346 10.3337 13.3346H9.66699Z"
                    fill="white"
                  />
                </svg>
              </SvgIcon>
              <Typography sx={{ color: error.dark, fontSize: 15, fontWeight: 500 }}>
                Validation Error
              </Typography>
            </Stack>

            <IconButton onClick={handleDialogClose}>
              <Iconify color="#FFBABA" icon="mingcute:close-line" />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Typography sx={{ color: error.dark, fontSize: 19, mt: 1 }}>{dialogMessage}</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}
