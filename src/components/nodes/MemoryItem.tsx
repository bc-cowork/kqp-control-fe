'use client';

import {
  Box,
  Grid,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CircularProgress,
} from '@mui/material';

import { grey } from 'src/theme/core';
import { useGetIssueItemInfo, useGetIssueItemQuotes } from 'src/actions/nodes';

import { TableErrorRows } from '../table/table-error-rows';
import { TableLoadingRows } from '../table/table-loading-rows';
import { MemoryItemInfo } from '../memory-page/MemoryItemInfo';
import { MemoryStockItem } from '../memory-page/MemoryStockItem';
import { MemoryStockHead } from '../memory-page/MemoryStockHead';

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
  const sumDataAsk = issueQuotesAsk.sum;

  const rowKeysBid = Object.keys(issueQuotesBid)
    .filter((key) => key !== 'sum')
    .sort((a, b) => Number(a) - Number(b));
  const sumDataBid = issueQuotesBid.sum;

  return (
    <>
      {issueInfoLoading ? (
        <Box>
          <CircularProgress />
        </Box>
      ) : issueInfoError ? (
        <Box>
          <Typography color="error">Error fetching issue item information</Typography>
        </Box>
      ) : (
        <Grid
          container
          sx={{
            display: 'flex',
            alignItems: 'stretch',
          }}
        >
          <Grid md={4} sx={{ pr: 2.5 }}>
            <MemoryItemInfo issueInfo={issueInfo} />
          </Grid>
          <Grid md={1}>
            <MemoryStockHead />
          </Grid>
          <Grid md={7}>
            <Grid container>
              <Grid md={4}>
                <MemoryStockItem
                  name="UNI"
                  lastPrice={issueInfo.last_price.uni}
                  lastVolume={issueInfo.last_vol.uni}
                  volumeAccum={issueInfo.vol_accum.uni}
                  amountAccum={issueInfo.amt_accum.uni}
                  high={issueInfo.high.uni}
                  low={issueInfo.low.uni}
                  open={issueInfo.open.uni}
                />
              </Grid>
              <Grid md={4} sx={{ pl: 1 }}>
                <MemoryStockItem
                  name="KRX"
                  lastPrice={issueInfo.last_price.krx}
                  lastVolume={issueInfo.last_vol.krx}
                  volumeAccum={issueInfo.vol_accum.krx}
                  amountAccum={issueInfo.amt_accum.krx}
                  high={issueInfo.high.krx}
                  low={issueInfo.low.krx}
                  open={issueInfo.open.krx}
                />
              </Grid>
              <Grid md={4} sx={{ pl: 1 }}>
                <MemoryStockItem
                  name="NXT"
                  lastPrice={issueInfo.last_price.nxt}
                  lastVolume={issueInfo.last_vol.nxt}
                  volumeAccum={issueInfo.vol_accum.nxt}
                  amountAccum={issueInfo.amt_accum.nxt}
                  high={issueInfo.high.nxt}
                  low={issueInfo.low.nxt}
                  open={issueInfo.open.nxt}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
      <Grid container sx={{ mt: 2 }}>
        <Grid md={12}>
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
                          {issueQuotesAsk[key].price.toLocaleString()}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {issueQuotesAsk[key].uni.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {issueQuotesAsk[key].krx.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {issueQuotesAsk[key].nxt.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <Divider sx={{ border: `4px solid ${grey[100]}` }} />
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
                          {issueQuotesAsk[key].price.toLocaleString()}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {issueQuotesAsk[key].uni.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {issueQuotesAsk[key].krx.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        {issueQuotesAsk[key].nxt.toLocaleString()}
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
        </Grid>
      </Grid>
    </>
  );
}
