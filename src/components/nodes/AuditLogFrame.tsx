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
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';

import { formatDateCustom } from 'src/utils/format-time';

import { grey } from 'src/theme/core';
import { varAlpha } from 'src/theme/styles';
import { useGetAuditLogFrame } from 'src/actions/nodes';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  selectedFile: string;
};

export function AuditLogFrame({ selectedNodeId, selectedFile }: Props) {
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
      <Box sx={{ mb: 2 }}>
        <Grid container>
          <Grid md={4}>
            <Box sx={{ p: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ border: '1px solid', borderColor: grey[500], backgroundColor: grey[200] }}
              >
                <Typography>Filename: </Typography>
                <Typography>{selectedFile}</Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ border: '1px solid', borderColor: grey[500], backgroundColor: grey[200] }}
              >
                <Typography>File Size: </Typography>
                <Typography>{auditFrame?.file_size?.toLocaleString()}</Typography>
              </Stack>
            </Box>
            <Box sx={{ p: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ border: '1px solid', borderColor: grey[500], backgroundColor: grey[200] }}
              >
                <Typography>SEQ </Typography>
                <Typography>{auditFrame?.seq}</Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ border: '1px solid', borderColor: grey[500], backgroundColor: grey[200] }}
              >
                <Typography>HEAD </Typography>
                <Typography>{auditFrame?.head}</Typography>
              </Stack>
            </Box>
          </Grid>
          <Grid md={4}>
            <Box sx={{ p: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ border: '1px solid', borderColor: grey[500], backgroundColor: grey[200] }}
              >
                <Typography>Desc </Typography>
                <Typography>Inbound</Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ border: '1px solid', borderColor: grey[500], backgroundColor: grey[200] }}
              >
                <Typography>Date </Typography>
                <Typography>{formatDateCustom(auditFrame?.date?.toString())}</Typography>
              </Stack>
            </Box>
            <Box sx={{ p: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ border: '1px solid', borderColor: grey[500], backgroundColor: grey[200] }}
              >
                <Typography>Time </Typography>
                <Typography>{auditFrame?.time}</Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ border: '1px solid', borderColor: grey[500], backgroundColor: grey[200] }}
              >
                <Typography>RID </Typography>
                <Typography>{auditFrame?.rid}</Typography>
              </Stack>
            </Box>
          </Grid>
          <Grid md={4}>
            <Box sx={{ p: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ border: '1px solid', borderColor: grey[500], backgroundColor: grey[200] }}
              >
                <Typography>Max Frame </Typography>
                <Typography>{auditFrame?.max_frame?.toLocaleString()}</Typography>
              </Stack>
            </Box>
            <Box sx={{ p: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ border: '1px solid', borderColor: grey[500], backgroundColor: grey[200] }}
              >
                <Typography>Size </Typography>
                <Typography>{auditFrame?.size}</Typography>
              </Stack>
            </Box>
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

      <Table
        size="small"
        sx={{
          borderRadius: 2,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.04),
          border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>LEN</TableCell>
            <TableCell>DATA</TableCell>
            <TableCell>Desc.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {auditFrameLoading ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : auditFrameFragsEmpty ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <TableCell colSpan={6}>No data to show</TableCell>
              </TableCell>
            </TableRow>
          ) : auditFrameError ? (
            <TableRow>
              <TableCell colSpan={6}>Error Fetching Audit Frags List</TableCell>
            </TableRow>
          ) : (
            auditFrame.frags.map((auditFrameFrag: AuditLogFrameFragItem, index: number) => (
              <TableRow key={index}>
                <TableCell>{auditFrameFrag.id}</TableCell>
                <TableCell>{auditFrameFrag.len}</TableCell>
                <TableCell>{auditFrameFrag.data}</TableCell>
                <TableCell>{auditFrameFrag.desc}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}
