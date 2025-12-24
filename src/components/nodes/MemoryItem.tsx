'use client';

import { useCallback } from 'react';
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
} from '@mui/material';

import { grey } from 'src/theme/core';
import { useTranslate } from 'src/locales';
import { useGetIssueItemInfo, useGetIssueItemQuotes } from 'src/actions/nodes';
import { DashboardContent } from 'src/layouts/dashboard';

import { TableErrorRows } from '../table/table-error-rows';
import { TableLoadingRows } from '../table/table-loading-rows';
import { MemoryItemInfo } from '../memory-page/MemoryItemInfo';
import { MemoryIssueInfoTable } from '../memory-page/MemoryIssueInfoTable';
import { Breadcrumb } from '../common/Breadcrumb';
import { RrefreshButton } from '../common/RefreshButton';

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
  }, [onRefresh, onRefreshQuote])

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
        <Typography sx={{ fontSize: 28, fontWeight: 600, color: (theme) => theme.palette.mode === 'dark' ? grey[50] : '#373F4E', mt: 2 }}>
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
        <Grid
          gap={2}
          container>
          <Grid xs={12} md={10} lg={4} sx={{ pr: '10px', height: '220%' }}>
            {(issueInfoLoading || issueInfoValidating) ? (
              <Box sx={{ p: 0.5, borderRadius: 1 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{
                borderRadius: 1
              }}>
                <MemoryItemInfo issueInfo={issueInfo} />
                <MemoryIssueInfoTable issueInfo={issueInfo} />
              </Box>
            )}
          </Grid>
          <Grid xs={12} lg={7.8} sx={{ pl: { lg: '10px' } }}>
            <TableContainer component={Paper}
              sx={{ height: { md: 'auto' } }}>
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
                      <TableRow sx={{ backgroundColor: '#212447 !important' }}>
                        <TableCell />
                        <TableCell />
                        <TableCell align="right">
                          <Box
                            component="span"
                            sx={{ fontWeight: 500, color: '#7AA2FF' }}
                          >
                            {sumDataAsk.uni.toLocaleString()}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            component="span"
                            sx={{ fontWeight: 500, color: '#7AA2FF' }}
                          >
                            {sumDataAsk.krx.toLocaleString()}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            component="span"
                            sx={{ fontWeight: 500, color: '#7AA2FF' }}
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
                                border: '1px solid #1D2654',
                                padding: '2px 4px',
                                borderRadius: '2px',
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
                                border: '1px solid #4A2C31',
                                padding: '2px 4px',
                                borderRadius: '2px',
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
                      <TableRow sx={{ backgroundColor: '#331B1E !important' }}>
                        <TableCell />
                        <TableCell />
                        <TableCell align="right">
                          <Box
                            component="span"
                            sx={{ fontWeight: 500, color: '#FF8882' }}
                          >
                            {sumDataBid.uni.toLocaleString()}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            component="span"
                            sx={{ fontWeight: 500, color: '#FF8882' }}
                          >
                            {sumDataBid.krx.toLocaleString()}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Box
                            component="span"
                            sx={{ fontWeight: 500, color: '#FF8882' }}
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
