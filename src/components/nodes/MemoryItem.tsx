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
} from '@mui/material';

import { grey } from 'src/theme/core';
import { useGetIssueItemInfo, useGetIssueItemQuotes } from 'src/actions/nodes';

import { TableErrorRows } from '../table/table-error-rows';
import { TableLoadingRows } from '../table/table-loading-rows';
import { MemoryItemInfo } from '../memory-page/MemoryItemInfo';
import { MemoryIssueInfoTable } from '../memory-page/MemoryIssueInfoTable';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  code: string;
};

export function MemoryItem({ selectedNodeId, code }: Props) {
  const { issueInfo, issueInfoLoading, issueInfoError } = useGetIssueItemInfo(selectedNodeId, code);

  const { issueQuotesAsk, issueQuotesBid, issueQuotesLoading, issueQuotesError } =
    useGetIssueItemQuotes(selectedNodeId, code);

  const rowKeysAsk = Object.keys(issueQuotesAsk)
    .filter((key) => key !== 'sum')
    .sort((a, b) => Number(b) - Number(a));
  const sumDataAsk = issueQuotesAsk?.sum || 0;

  const rowKeysBid = Object.keys(issueQuotesBid)
    .filter((key) => key !== 'sum')
    .sort((a, b) => Number(a) - Number(b));
  const sumDataBid = issueQuotesBid.sum;

  return (
    <Grid container>
      <Grid md={5} sx={{ pr: '10px' }}>
        <Box sx={{ p: 0.5, backgroundColor: grey[900], borderRadius: 1 }}>
          <MemoryItemInfo issueInfo={issueInfo} />
          <MemoryIssueInfoTable issueInfo={issueInfo} />
        </Box>
      </Grid>
      <Grid md={7} sx={{ pl: '10px' }}>
        <TableContainer component={Paper} sx={{ height: { md: 'calc(100vh - 200px)' } }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="right">No.</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">UNI</TableCell>
                <TableCell align="right">KRX</TableCell>
                <TableCell align="right">NXT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issueQuotesLoading ? (
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
                    <TableRow key={key}>
                      <TableCell align="right">{key}</TableCell>
                      <TableCell align="right">
                        <Box
                          component="span"
                          sx={{
                            color: (theme) => theme.palette.primary.main,
                            backgroundColor: '#EFF6FF',
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
                    <TableCell sx={{ height: '4px', backgroundColor: grey[100] }} colSpan={12} />
                  </TableRow>
                  {rowKeysBid.map((key: string) => (
                    <TableRow key={key}>
                      <TableCell align="right">{key}</TableCell>
                      <TableCell align="right">
                        <Box
                          component="span"
                          sx={{
                            color: (theme) => theme.palette.error.main,
                            backgroundColor: '#FFF2F4',
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
  );
}
