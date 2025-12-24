'use client';

import type { AuditLogFrameItem } from 'src/types/node';

import { useState, useCallback } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  Table,
  Paper,
  Stack,
  SvgIcon,
  TableRow,
  useTheme,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { formatDateCustom } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { grey, common } from 'src/theme/core';
import { useAuditFrameList } from 'src/actions/nodes';

import AddFilter from '../common/AddFilter';
import FadingDivider from '../common/FadingDivider';
import TablePaginationCustom from '../common/TablePaginationCustom';
import { CustomTextFieldDark } from '../audit-log-page/CustomTextFieldDark';

import type { Filter } from '../common/AddFilter';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  selectedFile: string;
};

export function AuditLogFrameList({ selectedNodeId, selectedFile }: Props) {
  const { t } = useTranslate('audit-frame-list');
  const theme = useTheme();
  const router = useRouter();
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(40);
  const [offset, setOffset] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [frameSeq, setFrameSeq] = useState<number | null>(null);

  const [filters, setFilters] = useState<Filter | null>(null);

  const {
    auditFrameList,
    auditFrameListPagination,
    auditFrameListError,
    auditFrameListLoading,
    auditFrameListEmpty,
  } = useAuditFrameList(
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
        setOffset(auditFrameList?.max_frame || 0);
      }
    },
    [auditFrameList?.max_frame]
  );

  const onMaxFrameRefresh = () => {
    resetCache();
    setOffset(0);
    setPage(0);
  };

  const handleSearch = (filter: any) => {
    console.log('Applying filter:', filter);
  };

  function handleMoveToFrame(event: React.KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Enter') {
      if (frameSeq) {
        router.push(`/dashboard/nodes/${selectedNodeId}/audit-log/${selectedFile}/${frameSeq}`);
      }
    }
  }

  return (
    <>
      {auditFrameListLoading ? (
        <CircularProgress />
      ) : (
        <Grid container
        >
          <Grid md={12} lg={8.5} sx={{
            pr: 1.5,
          }}
            order={{
              xs: 1,
              lg: 0
            }}
          >
            <AddFilter
              filters={filters}
              setFilters={setFilters}
              page="Audit Frame List"
              onApply={handleSearch}
              count={auditFrameList?.max_frame || 0}
            />
            <Box
              sx={{
                borderBottomRightRadius: '12px',
                borderBottomLeftRadius: '12px',
                backgroundColor: 'transparent',
                p: 1,
              }}
            >
              <TablePaginationCustom
                rowsPerPage={rowsPerPage}
                currentPage={auditFrameListPagination?.current_page || 1}
                totalPages={auditFrameListPagination?.total_pages || 1}
                hasNextPage={auditFrameListPagination?.has_next_page || false}
                hasPreviousPage={auditFrameListPagination?.has_previous_page || false}
                onPageChange={onChangePage}
                onRowsPerPageChange={onChangeRowsPerPage}
                sx={{ mb: 1, mt: 2, overflowX: 'auto' }}
              />
              <TableContainer component={Paper} sx={{ height: '660px' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">{t('table_header.frame_seq')}</TableCell>
                      <TableCell align="right">{t('table_header.head')}</TableCell>
                      <TableCell align="right">{t('table_header.rid')}</TableCell>
                      <TableCell align="right">{t('table_header.size')}</TableCell>
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
                      auditFrameList?.frame_list.map(
                        (auditFrame: AuditLogFrameItem, index: number) => (
                          <TableRow
                            key={index}
                            onClick={() => {
                              router.push(
                                `/dashboard/nodes/${selectedNodeId}/audit-log/${selectedFile}/${auditFrame.seq}:${auditFrame.head}`
                              );
                            }}
                            sx={{ cursor: 'pointer' }}
                          >
                            <TableCell align="right">{auditFrame.seq}</TableCell>
                            <TableCell align="right">{auditFrame.head}</TableCell>
                            <TableCell align="right">{auditFrame.rid}</TableCell>
                            <TableCell align="right">{auditFrame.size}</TableCell>
                          </TableRow>
                        )
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>
          <Grid md={12} lg={3.5} sx={{ pl: 1.5, mb: '24px' }}>
            <Box sx={{ borderRadius: '12px', backgroundColor: grey[900], p: 1 }}>
              <Grid container rowSpacing='8px' columnSpacing='24px'>
                <Grid xs={12} md={6} lg={12} xl={12}>
                  <Box sx={{ pt: 1, px: 1 }}>
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
                      <Typography sx={{ color: theme.palette.grey[200], fontSize: 15 }}>
                        {t('right_side_audit_log_list.filename')}
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{ color: theme.palette.common.white, fontSize: 20, fontWeight: 500 }}
                    >
                      {selectedFile}
                    </Typography>
                  </Box>

                  <FadingDivider sx={{ my: 1.5 }} />

                  <Typography sx={{ color: theme.palette.grey[300], mb: 1, px: 1 }}>
                    {t('right_side_audit_log_list.audit_log_list')}
                  </Typography>

                  <Box sx={{ py: 1, px: 1, backgroundColor: theme.palette.grey[600], borderRadius: '8px', mb: 1 }}>
                    <Typography sx={{ color: theme.palette.grey[200], fontSize: 15 }}>
                      {t('right_side_audit_log_list.desc')}
                    </Typography>
                    <Typography sx={{ color: theme.palette.common.white, fontSize: 17, fontWeight: 500 }}>
                      {auditFrameList?.desc}
                    </Typography>
                  </Box>

                  <Box sx={{ py: 1, px: 1, backgroundColor: theme.palette.grey[600], borderRadius: '8px', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography sx={{ color: theme.palette.grey[200], fontSize: 15 }}>
                        {t('right_side_audit_log_list.max_frame_seq')}
                      </Typography>
                      <SvgIcon
                        sx={{
                          height: 24, width: 24, cursor: 'pointer', p: 0.5, borderRadius: '4px',
                          backgroundColor: theme.palette.grey[500],
                          '&:hover': { backgroundColor: grey[400] },
                          '&:active': { backgroundColor: '#D1D6D0', border: '1px solid #667085' },
                        }}
                        onClick={onMaxFrameRefresh}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M1.79811 7.00104C1.79811 4.13197 4.13783 1.80104 7.03031 1.80104C8.99489 1.80104 10.7061 2.87693 11.6008 4.46777H9.53301C9.23846 4.46777 8.99967 4.70656 8.99967 5.00111C8.99967 5.29566 9.23846 5.53444 9.53301 5.53444H12.8663C13.1609 5.53444 13.3997 5.29566 13.3997 5.00111V1.66777C13.3997 1.37322 13.1609 1.13444 12.8663 1.13444C12.5718 1.13444 12.333 1.37322 12.333 1.66777V3.61761C11.2127 1.88315 9.25609 0.734375 7.03031 0.734375C3.55436 0.734375 0.731445 3.53724 0.731445 7.00104C0.731445 10.4648 3.55436 13.2677 7.03031 13.2677C10.186 13.2677 12.8023 10.9584 13.2588 7.94082C13.3028 7.64958 13.1025 7.37777 12.8112 7.33371C12.52 7.28965 12.2482 7.49003 12.2041 7.78127C11.826 10.2807 9.65511 12.201 7.03031 12.201C4.13783 12.201 1.79811 9.87009 1.79811 7.00104Z" fill={grey[300]} />
                        </svg>
                      </SvgIcon>
                    </Box>
                    <Typography sx={{ color: theme.palette.common.white, fontSize: 17, fontWeight: 500 }}>
                      {auditFrameList?.max_frame}
                    </Typography>
                  </Box>

                  <Box sx={{ py: 1, px: 1, backgroundColor: theme.palette.grey[600], borderRadius: '8px', mb: 1 }}>
                    <Typography sx={{ color: theme.palette.grey[200], fontSize: 15 }}>
                      {t('right_side_audit_log_list.file_size')}
                    </Typography>
                    <Typography sx={{ color: theme.palette.common.white, fontSize: 17, fontWeight: 500 }}>
                      {auditFrameList?.file_size?.toLocaleString()}
                    </Typography>
                  </Box>

                  <Box sx={{ py: 1, px: 1, backgroundColor: theme.palette.grey[600], borderRadius: '8px', mb: 1 }}>
                    <Typography sx={{ color: theme.palette.grey[200], fontSize: 15 }}>
                      {t('right_side_audit_log_list.date')}
                    </Typography>
                    <Typography sx={{ color: theme.palette.common.white, fontSize: 17, fontWeight: 500 }}>
                      {formatDateCustom(auditFrameList?.date?.toString())}
                    </Typography>
                  </Box>
                </Grid>


                <Grid
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                  }}
                  xs={12} sm={12} md={6} lg={12} xl={12}>
                  <Box
                    sx={{
                      borderRadius: '12px',
                      background: 'linear-gradient(180deg, #202838 80%, #373F4E 100%)',
                      p: 1,
                      minHeight: {
                        xs: '340px',
                        lg: '348px'
                      }
                    }}
                  >
                    <Typography sx={{ color: theme.palette.grey[300], fontSize: 15 }}>
                      Audit Log Frame Detail
                    </Typography>
                    <CustomTextFieldDark
                      label="Frame Seq"
                      value={frameSeq}
                      setValue={setFrameSeq}
                      type="number"
                      // eslint-disable-next-line react/jsx-no-bind
                      onKeyDownHandler={handleMoveToFrame}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid >
      )
      }
    </>
  );
}
