'use client';

import type { AuditLogFrameFragItem } from 'src/types/node';

import React, { useRef, useState, useEffect, useCallback } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  Table,
  Paper,
  Stack,
  Dialog,
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
} from '@mui/material';

import { formatDateCustom } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useGetAuditLogFrame } from 'src/actions/nodes';
import { grey, error, common, primary, success, warning } from 'src/theme/core';

import { Iconify } from '../iconify';
import AddFilter from '../common/AddFilter';
import FadingDivider from '../common/FadingDivider';
import { TableEmptyRows } from '../table/table-empty-rows';
import { TableErrorRows } from '../table/table-error-rows';
import { TableLoadingRows } from '../table/table-loading-rows';
import TablePaginationCustomShort from '../common/TablePaginationCustomShort';

import type { Filter } from '../common/AddFilter';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  selectedFile: string;
  selectedSeq: string;
};

export function AuditLogFrame({ selectedNodeId, selectedFile, selectedSeq }: Props) {
  const { t } = useTranslate('audit-frame-detail');
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

  const [filters, setFilters] = useState<Filter | null>(null);

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
  };

  const onMaxFrameRefresh = () => {
    setSeq(0);
    setApiSeq(0);
    resetSearch();
    resetCache();
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
    resetCache();
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
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogMessage('');
  };

  // Helper: collapse your filters (array or null) to "which keys are active?"
  const getActiveFlags = (f: Filter | null) => {
    const flags = { seq: false, count: false, side: false, cond: false };

    if (!f) return flags;

    if (Array.isArray(f)) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of f as any[]) {
        if (item?.seq !== undefined && item?.seq !== null) flags.seq = true;
        if (item?.count !== undefined && item?.count !== null) flags.count = true;
        if (item?.side !== undefined && item?.side !== null && item?.side !== '') flags.side = true;
        if (item?.cond !== undefined && item?.cond !== null && item?.cond !== '') flags.cond = true;
      }
    } else if (typeof f === 'object') {
      const item: any = f;
      if (item?.seq !== undefined && item?.seq !== null) flags.seq = true;
      if (item?.count !== undefined && item?.count !== null) flags.count = true;
      if (item?.side !== undefined && item?.side !== null && item?.side !== '') flags.side = true;
      if (item?.cond !== undefined && item?.cond !== null && item?.cond !== '') flags.cond = true;
    }

    return flags;
  };

  // Keep previous flags to diff on each change
  const prevActiveFlagsRef = useRef<{ seq: boolean; count: boolean; side: boolean; cond: boolean }>(
    getActiveFlags(null)
  );

  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const prevFlags = prevActiveFlagsRef.current;
    const currFlags = getActiveFlags(filters);

    // === Detect removals (true -> false) ===
    const removed: string[] = [];
    (['seq', 'count', 'side', 'cond'] as const).forEach((key) => {
      if (prevFlags[key] && !currFlags[key]) {
        removed.push(key);
      }
    });

    if (removed.length) {
      if (removed.includes('cond')) setCond(undefined);
      if (removed.includes('count')) setCount(10000);
      if (removed.includes('side')) setSide('next');
      resetCache();
    }

    // Your existing "all cleared" behavior (when filters become null or nothing active)
    const nothingActive = !currFlags.seq && !currFlags.count && !currFlags.side && !currFlags.cond;
    if (nothingActive) {
      setCount(undefined);
      setSide(undefined);
      setCond(undefined);
      resetCache();
    }

    // Save current flags for next diff
    prevActiveFlagsRef.current = currFlags;
  }, [filters]);

  const onFilterApply = () => {
    if (filters) {
      const filterCount = Array.isArray(filters)
        ? filters.find((filter: { count: any }) => filter.count)?.count
        : null;

      const filterSide = Array.isArray(filters)
        ? filters.find((filter: { side: any }) => filter.side)?.side
        : null;

      const filterCond = Array.isArray(filters)
        ? filters.find((filter: { cond: any }) => filter.cond)?.cond
        : null;

      if (auditFrame?.seq !== undefined && auditFrame?.seq !== apiSeq) {
        setSeq(auditFrame.seq);
        setApiSeq(auditFrame.seq);
      }

      if (!filterCount) {
        setCount(10000);
      }

      if (!filterSide) {
        setSide('next');
      }

      if (!filterCond) {
        setCond(undefined);
      }
    } else {
      setCount(undefined);
      setSide(undefined);
      setCond(undefined);
    }
    resetCache();
  };

  const handleSearch = (filter: any) => {
    onFilterApply();

    if (filter?.seq) {
      setSeq(filter.seq);
      setApiSeq(filter.seq);
    }
    if (filter?.count) {
      setCount(filter.count);
    }
    if (filter?.side) {
      setSide(filter.side);
    }
    if (filter?.cond) {
      setCond(filter.cond);
    }
  };

  return (
    <>
      <Grid container>
        <Grid md={9} sx={{ pr: 1.5 }}>
          <AddFilter
            filters={filters}
            setFilters={setFilters}
            page="Audit Frame"
            onApply={handleSearch}
            count={auditFrame?.max_frame || 0}
            popoverWidth="430px"
          />
          <Box
            sx={{
              borderBottomRightRadius: '12px',
              borderBottomLeftRadius: '12px',
              backgroundColor: common.white,
              p: 1,
            }}
          >
            <TablePaginationCustomShort
              rowsPerPage={count || 40}
              page={5} // doesn't matter in this case
              count={auditFrame?.max_frame || 0}
              onPageChange={onChangePage}
              onPrev={onPrev}
              onNext={onNext}
              onFirst={onFirst}
              onLast={onLast}
              firstDisabled={apiSeq === 1}
              lastDisabled={false}
              prevDisabled={apiSeq === 1}
              nextDisabled={apiSeq === 0 || apiSeq === auditFrame.max_frame}
              sx={{ mb: 1 }}
            />

            <TableContainer component={Paper} sx={{ height: 'calc(100vh - 300px)' }}>
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
                    auditFrame?.frags?.map(
                      (auditFrameFrag: AuditLogFrameFragItem, index: number) => (
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
                      )
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
        <Grid md={3} sx={{ pl: 1.5 }}>
          <Box sx={{ borderRadius: '12px', backgroundColor: grey[900] }}>
            <Box sx={{ p: 1 }}>
              <Box
                sx={{
                  pt: 1,
                  px: 1,
                }}
              >
                <Stack direction="row" alignItems="center">
                  <SvgIcon sx={{ mr: 0.8 }}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M8.60749 3.32031C8.78799 3.31997 8.96091 3.39284 9.08674 3.52226L10.2793 4.74889L16.8323 4.74894C17.6607 4.74894 18.3323 5.42051 18.3323 6.24893V15.1656C18.3323 15.994 17.6607 16.6656 16.8323 16.6656H3.16421C2.33584 16.6656 1.6643 15.9941 1.66421 15.1658L1.66309 4.8307C1.663 4.00331 2.33288 3.33209 3.16027 3.33054L8.60749 3.32031ZM8.3276 4.65417L3.16277 4.66387C3.07084 4.66404 2.99641 4.73862 2.99642 4.83056L2.99754 15.1656C2.99755 15.2577 3.07217 15.3323 3.16421 15.3323H16.8323C16.9243 15.3323 16.9989 15.2577 16.9989 15.1656V6.24893C16.9989 6.15689 16.9243 6.08227 16.8323 6.08227L9.99763 6.08222C9.81756 6.08222 9.64515 6.00938 9.51963 5.88027L8.3276 4.65417ZM9.74902 10.8323C9.74902 10.4641 10.0475 10.1656 10.4157 10.1656H11.8337V8.74894C11.8337 8.38075 12.1321 8.08228 12.5003 8.08228C12.8685 8.08228 13.167 8.38075 13.167 8.74894V10.1656H14.5824C14.9505 10.1656 15.249 10.4641 15.249 10.8323C15.249 11.2005 14.9505 11.4989 14.5824 11.4989H13.167V12.9156C13.167 13.2838 12.8685 13.5823 12.5003 13.5823C12.1321 13.5823 11.8337 13.2838 11.8337 12.9156V11.4989H10.4157C10.0475 11.4989 9.74902 11.2005 9.74902 10.8323Z"
                        fill="#E0E4EB"
                      />
                    </svg>
                  </SvgIcon>
                  <Typography sx={{ color: grey[200], fontSize: 15 }}>Filename</Typography>
                </Stack>
                <Typography sx={{ color: common.white, fontSize: 20, fontWeight: 500 }}>
                  {selectedFile}
                </Typography>
              </Box>
              <FadingDivider sx={{ my: 1.5 }} />

              <Typography sx={{ color: grey[300], fontSize: 15, mb: 1 }}>Audit Log List</Typography>
              <Box
                sx={{
                  py: 1,
                  px: 1,
                  backgroundColor: grey[600],
                  borderRadius: '8px',
                  mb: 1,
                }}
              >
                <Typography sx={{ color: grey[200], fontSize: 15 }}>Desc</Typography>
                <Typography sx={{ color: common.white, fontSize: 17, fontWeight: 500 }}>
                  {auditFrame?.desc}
                </Typography>
              </Box>
              <Box
                sx={{
                  py: 1,
                  px: 1,
                  backgroundColor: grey[600],
                  borderRadius: '8px',
                  mb: 1,
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Typography sx={{ color: grey[200], fontSize: 15 }}>Max Frame Seq</Typography>
                  <SvgIcon
                    sx={{
                      height: 24,
                      width: 24,
                      cursor: 'pointer',
                      p: 0.5,
                      borderRadius: '4px',
                      backgroundColor: grey[500],
                      '&:hover': { backgroundColor: grey[400] },
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
                        fill={grey[300]}
                      />
                    </svg>
                  </SvgIcon>
                </Box>
                <Typography sx={{ color: common.white, fontSize: 17, fontWeight: 500 }}>
                  {auditFrame?.max_frame}
                </Typography>
              </Box>
              <Box
                sx={{
                  py: 1,
                  px: 1,
                  backgroundColor: grey[600],
                  borderRadius: '8px',
                  mb: 1,
                }}
              >
                <Typography sx={{ color: grey[200], fontSize: 15 }}>File Size</Typography>
                <Typography sx={{ color: common.white, fontSize: 17, fontWeight: 500 }}>
                  {auditFrame?.file_size?.toLocaleString()}
                </Typography>
              </Box>
              <Box
                sx={{
                  py: 1,
                  px: 1,
                  backgroundColor: grey[600],
                  borderRadius: '8px',
                  mb: 1,
                }}
              >
                <Typography sx={{ color: grey[200], fontSize: 15 }}>Date</Typography>
                <Typography sx={{ color: common.white, fontSize: 17, fontWeight: 500 }}>
                  {formatDateCustom(auditFrame?.date?.toString())}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                borderRadius: '12px',
                background: 'linear-gradient(180deg, #202838 80%, #373F4E 100%)',
                p: 1,
                height: `calc(100vh - 610px)`,
              }}
            >
              <Typography sx={{ color: grey[300], fontSize: 15, mb: 1, mt: 0.5 }}>
                Audit Log Frame Detail
              </Typography>

              <Box
                sx={{
                  py: 1,
                  px: 1,
                  backgroundColor: primary.main,
                  borderRadius: '8px',
                  mb: 1,
                }}
              >
                <Typography sx={{ color: grey[200], fontSize: 15 }}>Seq</Typography>
                <Typography sx={{ color: common.white, fontSize: 17, fontWeight: 500 }}>
                  {auditFrame?.seq}
                </Typography>
              </Box>

              <Box
                sx={{
                  py: 1,
                  px: 1,
                  backgroundColor: grey[600],
                  borderRadius: '8px',
                  mb: 1,
                }}
              >
                <Typography sx={{ color: grey[200], fontSize: 15 }}>Time</Typography>
                <Typography
                  sx={{ color: common.white, fontSize: 17, fontWeight: 500 }}
                  display="inline"
                >
                  {auditFrame?.time} &nbsp; {auditFrame?.time_ms}
                </Typography>
                <Typography
                  variant="caption"
                  display="inline"
                  sx={{ fontSize: 12, ml: 0.3, color: common.white }}
                >{`ms `}</Typography>
                <Typography
                  sx={{ color: common.white, fontSize: 17, fontWeight: 500 }}
                  display="inline"
                >{` ${auditFrame?.time_us}`}</Typography>
                <Typography
                  variant="caption"
                  display="inline"
                  sx={{ fontSize: 12, ml: 0.3, color: common.white }}
                >
                  us
                </Typography>
              </Box>

              <Grid container>
                <Grid md={12}>
                  <Box
                    sx={{
                      py: 1,
                      px: 1,
                      backgroundColor: grey[600],
                      borderRadius: '8px',
                      mb: 1,
                    }}
                  >
                    <Typography sx={{ color: grey[200], fontSize: 15 }}>Size</Typography>
                    <Typography sx={{ color: common.white, fontSize: 17, fontWeight: 500 }}>
                      {auditFrame?.size}
                    </Typography>
                  </Box>
                </Grid>
                <Grid md={6}>
                  <Box
                    sx={{
                      py: 1,
                      px: 1,
                      backgroundColor: grey[600],
                      borderRadius: '8px',
                      mb: 1,
                    }}
                  >
                    <Typography sx={{ color: grey[200], fontSize: 15 }}>Head</Typography>
                    <Typography sx={{ color: common.white, fontSize: 17, fontWeight: 500 }}>
                      {auditFrame?.head}
                    </Typography>
                  </Box>
                </Grid>
                <Grid md={6} sx={{ pl: 1 }}>
                  <Box
                    sx={{
                      py: 1,
                      px: 1,
                      backgroundColor: grey[600],
                      borderRadius: '8px',
                      mb: 1,
                    }}
                  >
                    <Typography sx={{ color: grey[200], fontSize: 15 }}>RID</Typography>
                    <Typography sx={{ color: common.white, fontSize: 17, fontWeight: 500 }}>
                      {auditFrame?.rid}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
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
