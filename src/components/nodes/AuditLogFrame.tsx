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
  TableRow,
  useTheme,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
} from '@mui/material';

import { formatDateCustom, secondsToTimeString } from 'src/utils/format-time';

import { useGetAuditLogFrame } from 'src/actions/nodes';

import { Iconify } from '../iconify';
import { TableEmptyRows } from '../table/table-empty-rows';
import { TableErrorRows } from '../table/table-error-rows';
import { TableLoadingRows } from '../table/table-loading-rows';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  selectedFile: string;
};

export function AuditLogFrame({ selectedNodeId, selectedFile }: Props) {
  const theme = useTheme();
  const [seq, setSeq] = useState<number>(0);
  const [count, setCount] = useState<number>(40);
  const [side, setSide] = useState<'prev' | 'next' | undefined>(undefined);
  const [cond, setCond] = useState<string | undefined>(undefined);
  const [condText, setCondText] = useState<string | undefined>(undefined);
  const [seqNum, setSeqNum] = useState<number>(seq);
  const [countNum, setCountNum] = useState<number>(count);

  const { auditFrame, auditFrameError, auditFrameLoading, auditFrameFragsEmpty } =
    useGetAuditLogFrame(selectedNodeId, selectedFile, seq, side, count, cond);

  const handleUpdateSeq = useCallback(() => {
    setSeq(seqNum);
    handleFirst();
  }, [seqNum]);

  const handleUpdateCount = useCallback(() => {
    setCount(countNum);
    handleFirst();
  }, [countNum]);

  const handleUpdateCond = useCallback(() => {
    setCond(condText);
    handleFirst();
  }, [condText]);

  const handleNext = () => {
    setSide('next');
    setCount(40);
    setSeq(seq + count);
  };

  const handlePrev = () => {
    setSide('prev');
    setCount(40);
    setSeq(seq - count);
  };

  const handleFirst = () => {
    setSide('next');
    setCount(40);
    setSeq(0);
  };

  const handleLast = () => {
    setSide('prev');
    setCount(40);
    setSeq(auditFrame.max_frame);
  };

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
            md={1}
            sx={{
              py: 2,
              px: 1,
              backgroundColor: theme.palette.common.white,
              borderRight: `solid 1px ${theme.palette.divider}`,
            }}
          >
            <Typography variant="caption">Max Frame</Typography>
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
            md={1.6}
            sx={{
              py: 2,
              px: 1,
              backgroundColor: theme.palette.common.white,
              borderRight: `solid 1px ${theme.palette.divider}`,
            }}
          >
            <Typography variant="caption">Time</Typography>
            <Typography variant="subtitle1">
              {secondsToTimeString(auditFrame?.time || 0)}
            </Typography>
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
          <Button variant="contained" onClick={handleUpdateCond}>
            Apply
          </Button>
        </Box>

        <Box gap={1} display="flex" alignItems="center">
          <TextField
            label="SEQ"
            size="small"
            placeholder="Enter seq here"
            value={seqNum}
            type="number"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setSeqNum(Number(event.target.value));
            }}
            sx={{ width: 140 }}
          />
          <Button variant="contained" onClick={handleUpdateSeq}>
            Apply
          </Button>
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
          <Button variant="contained" onClick={handleUpdateCount}>
            Apply
          </Button>
        </Box>
      </Stack>

      <Box gap={1} display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={handleFirst} disabled={seq === 0}>
            First
          </Button>
          <Button
            variant="outlined"
            onClick={handleLast}
            disabled={seq === auditFrame.max_frame - count}
          >
            Last
          </Button>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button variant="outlined" onClick={handlePrev} disabled={seq === 0}>
            Prev
          </Button>
          <Typography>{seq === 0 ? 1 : seq / count + 1}</Typography>
          <Button variant="outlined" onClick={handleNext}>
            Next
          </Button>
        </Stack>
      </Box>

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
                <TableCell align="right">{auditFrameFrag.id}</TableCell>
                <TableCell align="right">{auditFrameFrag.len}</TableCell>
                <TableCell align="right">{auditFrameFrag.data}</TableCell>
                <TableCell>{auditFrameFrag.desc}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}
