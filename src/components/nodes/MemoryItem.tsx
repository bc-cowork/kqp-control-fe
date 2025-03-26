'use client';

import {
  Box,
  Grid,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CircularProgress,
} from '@mui/material';

import { useGetIssueItemInfo, useGetIssueItemQuotes } from 'src/actions/nodes';

import { TableErrorRows } from '../table/table-error-rows';
import { TableLoadingRows } from '../table/table-loading-rows';

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
      <Grid container>
        <Grid md={4} sx={{ pr: 2.5 }}>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.common.white,
              borderRadius: '8px',
              px: 1,
              py: 2,
            }}
          >
            {issueInfoLoading ? (
              <CircularProgress />
            ) : (
              <Grid container>
                <Grid md={3}>
                  <Typography
                    variant="body2"
                    sx={{ color: (theme) => theme.palette.grey[400], mb: 1 }}
                  >
                    Seq
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: (theme) => theme.palette.grey[400], mb: 1 }}
                  >
                    Code
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: (theme) => theme.palette.grey[400], mb: 1 }}
                  >
                    Name
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: (theme) => theme.palette.grey[400], mb: 1 }}
                  >
                    G1.SSN-ID
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: (theme) => theme.palette.grey[400], mb: 1 }}
                  >
                    Compet
                  </Typography>
                </Grid>
                <Grid md={9}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {issueInfo?.seq}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {issueInfo?.code}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {issueInfo?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {issueInfo?.g1_ssn_id}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {issueInfo?.compet}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Box>
        </Grid>
        <Grid md={1}>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette.primary.darker,
              borderRadius: '8px',
              px: 1,
              py: 2,
            }}
          >
            <Box
              sx={{
                // backgroundColor: (theme) => theme.palette.primary.light,
                mb: 1,
                pb: 1.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{ mb: 0.5, color: (theme) => theme.palette.grey[300] }}
              >
                Last. Price
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 0.5, color: (theme) => theme.palette.grey[300] }}
              >
                Last. Vol
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 0.5, color: (theme) => theme.palette.grey[300] }}
              >
                Vol. Accum
              </Typography>
              <Typography variant="body2" sx={{ color: (theme) => theme.palette.grey[300] }}>
                Amt. Accum
              </Typography>
            </Box>
            <Box
              sx={{
                // backgroundColor: (theme) => theme.palette.primary.light,
                pt: 1.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{ mb: 0.5, color: (theme) => theme.palette.grey[300] }}
              >
                Open
              </Typography>
              <Typography
                variant="body2"
                sx={{ mb: 0.5, color: (theme) => theme.palette.grey[300] }}
              >
                High
              </Typography>
              <Typography variant="body2" sx={{ color: (theme) => theme.palette.grey[300] }}>
                Low
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid md={7}>
          <Grid container>
            <Grid md={4}>
              <Box>
                <Box
                  sx={{
                    backgroundColor: (theme) => theme.palette.common.white,
                    mb: 1,
                    pb: 1.5,
                    pt: 2,
                    pr: 1,
                    textAlign: 'right',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    Last. Price
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    Last. Vol
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    Vol. Accum
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    Amt. Accum
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: (theme) => theme.palette.common.white,
                    pt: 1.5,
                    pb: 2,
                    pr: 1,
                    textAlign: 'right',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    Open
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    High
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    Low
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid md={4}>
              <Box>
                <Box
                  sx={{
                    backgroundColor: (theme) => theme.palette.common.white,
                    mb: 1,
                    pb: 1.5,
                    pt: 2,
                    pr: 1,
                    textAlign: 'right',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    Last. Price
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    Last. Vol
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    Vol. Accum
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    Amt. Accum
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: (theme) => theme.palette.common.white,
                    pt: 1.5,
                    pb: 2,
                    pr: 1,
                    textAlign: 'right',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    Open
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    High
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    Low
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid md={4}>
              <Box>
                <Box
                  sx={{
                    backgroundColor: (theme) => theme.palette.common.white,
                    mb: 1,
                    pb: 1.5,
                    pt: 2,
                    pr: 1,
                    textAlign: 'right',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    Last. Price
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    Last. Vol
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    Vol. Accum
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    Amt. Accum
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: (theme) => theme.palette.common.white,
                    pt: 1.5,
                    pb: 2,
                    pr: 1,
                    textAlign: 'right',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    Open
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mb: 0.5, color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    High
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: (theme) => theme.palette.grey[600], fontWeight: 500 }}
                  >
                    Low
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
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
                        {sumDataAsk.uni}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        component="span"
                        sx={{ fontWeight: 500, color: (theme) => theme.palette.primary.main }}
                      >
                        {sumDataAsk.krx}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        component="span"
                        sx={{ fontWeight: 500, color: (theme) => theme.palette.primary.main }}
                      >
                        {sumDataAsk.nxt}
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
                          {issueQuotesAsk[key].price}
                        </Box>
                      </TableCell>
                      <TableCell align="right">{issueQuotesAsk[key].uni}</TableCell>
                      <TableCell align="right">{issueQuotesAsk[key].krx}</TableCell>
                      <TableCell align="right">{issueQuotesAsk[key].nxt}</TableCell>
                    </TableRow>
                  ))}
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
                          {issueQuotesAsk[key].price}
                        </Box>
                      </TableCell>
                      <TableCell align="right">{issueQuotesAsk[key].uni}</TableCell>
                      <TableCell align="right">{issueQuotesAsk[key].krx}</TableCell>
                      <TableCell align="right">{issueQuotesAsk[key].nxt}</TableCell>
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
                        {sumDataBid.uni}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        component="span"
                        sx={{ fontWeight: 500, color: (theme) => theme.palette.error.main }}
                      >
                        {sumDataBid.krx}
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box
                        component="span"
                        sx={{ fontWeight: 500, color: (theme) => theme.palette.error.main }}
                      >
                        {sumDataBid.nxt}
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
