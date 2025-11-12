'use client';

import {
  Box,
  Grid,
  Table,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  CircularProgress,
  Typography,
  styled,
  SvgIcon,
  ToggleButton,
} from '@mui/material';

import { grey } from 'src/theme/core';
import { useTranslate } from 'src/locales';
import { useGetIssueItemInfo, useGetIssueItemQuotes } from 'src/actions/nodes';

import { TableErrorRows } from '../table/table-error-rows';
import { TableLoadingRows } from '../table/table-loading-rows';
import { MemoryItemInfo } from '../memory-page/MemoryItemInfo';
import { MemoryIssueInfoTable } from '../memory-page/MemoryIssueInfoTable';
import { DashboardContent } from 'src/layouts/dashboard';
import { Breadcrumb } from '../common/Breadcrumb';
import { useCallback } from 'react';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  code: string;
};

export function MemoryItem({ selectedNodeId, code }: Props) {
  const { t } = useTranslate('memory');
  const { issueInfo, issueInfoLoading, issueInfoError, issueInfoValidating, onRefresh } = useGetIssueItemInfo(selectedNodeId, code);

  const { issueQuotesAsk, issueQuotesBid, issueQuotesLoading, issueQuotesValidating, issueQuotesError, onRefresh: onRefreshQuote } =
    useGetIssueItemQuotes(selectedNodeId, code);

  const rowKeysAsk = Object.keys(issueQuotesAsk)
    .filter((key) => key !== 'sum')
    .sort((a, b) => Number(b) - Number(a));
  const sumDataAsk = issueQuotesAsk?.sum || 0;

  const rowKeysBid = Object.keys(issueQuotesBid)
    .filter((key) => key !== 'sum')
    .sort((a, b) => Number(a) - Number(b));
  const sumDataBid = issueQuotesBid.sum;

  const handleRefresh = useCallback(() => {
    onRefresh();
    onRefreshQuote();
  }, [])

  return (
    <DashboardContent maxWidth="xl">
      <Breadcrumb
        node={selectedNodeId}
        pages={[
          { pageName: t('top.memory'), link: `/dashboard/nodes/${selectedNodeId}/memory` },
          { pageName: issueInfo.name },
        ]}
      />
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }}>
        <Typography sx={{ fontSize: 28, fontWeight: 500, color: grey[50], mt: 2 }}>
          {issueInfo.name || '-'}
        </Typography>
        {
          (!issueInfoLoading || !issueInfoValidating) && (
            <RrefreshButton onRefresh={handleRefresh} />
          )
        }
      </Box>
      <Box
        sx={{
          mt: '28px',
          width: 1,
        }}
      >
        <Grid container>
          <Grid md={5} sx={{ pr: '10px' }}>
            {(issueInfoLoading || issueInfoValidating) ? (
              <Box sx={{ p: 0.5, backgroundColor: grey[900], borderRadius: 1 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ p: 0.5, backgroundColor: grey[900], borderRadius: 1 }}>
                <MemoryItemInfo issueInfo={issueInfo} />
                <MemoryIssueInfoTable issueInfo={issueInfo} />
              </Box>
            )}
          </Grid>
          <Grid md={7} sx={{ pl: '10px' }}>
            <TableContainer component={Paper}
              sx={{ height: { md: 'calc(100vh - 200px)' } }}>
              <Table
                size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">{t('item.table.no')}</TableCell>
                    <TableCell align="right">{t('item.table.price')}</TableCell>
                    <TableCell align="right">{t('item.table.uni')}</TableCell>
                    <TableCell align="right">{t('item.table.krx')}</TableCell>
                    <TableCell align="right">{t('item.table.nxt')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(issueQuotesLoading || issueQuotesValidating) ? (
                    <TableLoadingRows height={20} loadingRows={10} />
                  ) : issueQuotesError ? (
                    <TableErrorRows />
                  ) : (
                    <>
                      <TableRow sx={{ backgroundColor: '#EFF6FF !important' }}>
                        <TableCell />
                        <TableCell />
                        <TableCell align="right">
                          <Box
                            component="span"
                            sx={{ fontWeight: 500, color: (theme) => theme.palette.primary.main }}
                          >
                            {sumDataAsk.uni.toLocaleString()}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            component="span"
                            sx={{ fontWeight: 500, color: (theme) => theme.palette.primary.main }}
                          >
                            {sumDataAsk.krx.toLocaleString()}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            component="span"
                            sx={{ fontWeight: 500, color: (theme) => theme.palette.primary.main }}
                          >
                            {sumDataAsk.nxt.toLocaleString()}
                          </Box>
                        </TableCell>
                      </TableRow>
                      {rowKeysAsk.map((key: string) => (
                        <TableRow
                          hover
                          key={key}>
                          <TableCell align="right">{key}</TableCell>
                          <TableCell align="right">
                            <Box
                              component="span"
                              sx={{
                                color: '#7AA2FF',
                                backgroundColor: '#212447',
                              }}
                            >
                              {(issueQuotesAsk as Record<string, { price: number }>)[
                                key
                              ]?.price.toLocaleString()}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            {(issueQuotesAsk as Record<string, { uni: number }>)[
                              key
                            ]?.uni.toLocaleString()}
                          </TableCell>
                          <TableCell align="right">
                            {(issueQuotesAsk as Record<string, { krx: number }>)[
                              key
                            ]?.krx.toLocaleString()}
                          </TableCell>
                          <TableCell align="right">
                            {(issueQuotesAsk as Record<string, { nxt: number }>)[
                              key
                            ]?.nxt.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell sx={{ height: '4px', backgroundColor: grey[900] }} colSpan={12} />
                      </TableRow>
                      {rowKeysBid.map((key: string) => (
                        <TableRow
                          hover
                          key={key}>
                          <TableCell align="right">{key}</TableCell>
                          <TableCell align="right">
                            <Box
                              component="span"
                              sx={{
                                color: '#FF8882',
                                backgroundColor: '#331B1E',
                              }}
                            >
                              {(issueQuotesBid as Record<string, { price: number }>)[
                                key
                              ]?.price.toLocaleString()}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            {(issueQuotesBid as Record<string, { uni: number }>)[
                              key
                            ]?.uni.toLocaleString()}
                          </TableCell>
                          <TableCell align="right">
                            {(issueQuotesBid as Record<string, { krx: number }>)[
                              key
                            ]?.krx.toLocaleString()}
                          </TableCell>
                          <TableCell align="right">
                            {(issueQuotesBid as Record<string, { nxt: number }>)[
                              key
                            ]?.nxt.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ backgroundColor: '#FFF2F4 !important' }}>
                        <TableCell />
                        <TableCell />
                        <TableCell align="right">
                          <Box
                            component="span"
                            sx={{ fontWeight: 500, color: (theme) => theme.palette.error.main }}
                          >
                            {sumDataBid.uni.toLocaleString()}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            component="span"
                            sx={{ fontWeight: 500, color: (theme) => theme.palette.error.main }}
                          >
                            {sumDataBid.krx.toLocaleString()}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            component="span"
                            sx={{ fontWeight: 500, color: (theme) => theme.palette.error.main }}
                          >
                            {sumDataBid.nxt.toLocaleString()}
                          </Box>
                        </TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </DashboardContent>
  );
}

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  fontSize: 15,
  fontWeight: 400,
  color: theme.palette.primary.contrastText,
  border: '2px solid black',
  height: 32,
  width: 32,
  padding: '3px 12px',
  '&.Mui-selected': {
    backgroundColor: '#373F4E',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    '&:hover': {
      backgroundColor: theme.palette.grey[400],
      color: 'black',
    },
  },
  '&:not(.Mui-selected)': {
    backgroundColor: '#373F4E',
    '&:hover': {
      backgroundColor: '#4E576A',
    },
  },
}));


const RrefreshButton = ({ onRefresh }: { onRefresh: () => void }) => {
  return (
    <StyledToggleButton
      value="refresh"
      aria-label="refresh option"
      onClick={() => onRefresh?.()}
      sx={{ px: '5px' }}
    >
      <SvgIcon
        sx={{
          height: 24,
          width: 24,
          p: 0.5,
        }}
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
            fill="white"
          />
        </svg>
      </SvgIcon>
    </StyledToggleButton>
  )
}