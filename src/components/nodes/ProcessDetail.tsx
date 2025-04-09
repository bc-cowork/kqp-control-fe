'use client';

import type { IProcessItem } from 'src/types/dashboard';

import {
  Table,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  CircularProgress,
} from '@mui/material';

import { useGetProcesses } from 'src/actions/dashboard';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
};

export function ProcessDetail({ selectedNodeId }: Props) {
  const { processes, processLoading, processesEmpty, processError } =
    useGetProcesses(selectedNodeId);

  return (
    <TableContainer component={Paper} sx={{ height: 'calc(100vh - 380px)' }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="right">PID</TableCell>
            <TableCell>NAME</TableCell>
            <TableCell>PARAM</TableCell>
            <TableCell align="right">CPU</TableCell>
            <TableCell align="right">MEM</TableCell>
            <TableCell align="right">PPID</TableCell>
            <TableCell>COMMAND</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {processLoading ? (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <CircularProgress />
              </TableCell>
            </TableRow>
          ) : processesEmpty ? (
            <TableRow>
              <TableCell colSpan={6}>No Processes Found</TableCell>
            </TableRow>
          ) : processError ? (
            <TableRow>
              <TableCell colSpan={6}>Error Fetching Process List</TableCell>
            </TableRow>
          ) : (
            processes.map((process: IProcessItem, index: number) => (
              <TableRow key={index}>
                <TableCell align="right">{process.PID}</TableCell>
                <TableCell>{process.NAME}</TableCell>
                <TableCell>{process.PARAM}</TableCell>
                <TableCell align="right">{process.CPU}</TableCell>
                <TableCell align="right">{Number(process?.MEM)?.toLocaleString()}</TableCell>
                <TableCell align="right">{process.PPID}</TableCell>
                <TableCell>{process.COMMAND}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
