'use client';

import type { AuditLogFrameFragItem } from 'src/types/node';

import { useState } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import {
  Box,
  Stack,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  CircularProgress,
} from '@mui/material';

import { grey } from 'src/theme/core';
import { varAlpha } from 'src/theme/styles';
import { useGetAuditLogFrame } from 'src/actions/nodes';

// ----------------------------------------------------------------------

const AUDIT_LOG_TYPES = [
  { value: 'inbound', label: 'Inbound' },
  { value: 'outbound', label: 'Outbound' },
  { value: 'other', label: 'Other' },
  { value: 'all', label: 'All' },
];

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  selectedFile: string;
};

export function AuditLogFrame({ selectedNodeId, selectedFile }: Props) {
  const [type, setType] = useState<string>(AUDIT_LOG_TYPES[0].value);
  const [seq, setSeq] = useState<number>(1);

  const { auditFrame, auditFrameError, auditFrameLoading } = useGetAuditLogFrame(
    selectedNodeId,
    selectedFile,
    1
  );

  const handleTypeChange = (event: { target: { value: string } }) => {
    setType(event.target.value);
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
                <Typography>44,05,931,233</Typography>
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
                <Typography>tbd</Typography>
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
                <Typography>{auditFrame?.time}</Typography>
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
          ) : auditFrameError ? (
            <TableRow>
              <TableCell colSpan={6}>Error Fetching Audit Logs List</TableCell>
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
