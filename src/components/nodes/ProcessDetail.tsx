'use client';

import type { IProcessItem } from 'src/types/dashboard';

import { Table, TableRow, TableBody, TableCell, TableHead, CircularProgress } from '@mui/material';

import { varAlpha } from 'src/theme/styles';
import { useGetProcesses } from 'src/actions/dashboard';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
};

export function ProcessDetail({ selectedNodeId }: Props) {
  const { processes, processLoading, processesEmpty, processError } =
    useGetProcesses(selectedNodeId);

  // Processing the list of processes to get needed data
  const processedProcessList =
    processes && Array.isArray(processes)
      ? processes.map((process: { data: any }) => process.data).flat()
      : [];

  return (
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
          <TableCell>PID</TableCell>
          <TableCell>NAME</TableCell>
          <TableCell>PARAM</TableCell>
          <TableCell>CPU</TableCell>
          <TableCell>MEM</TableCell>
          <TableCell>PPID</TableCell>
          <TableCell>COMMAND</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {processLoading ? (
          <CircularProgress />
        ) : processesEmpty ? (
          <TableRow>
            <TableCell colSpan={6}>No Processes Found</TableCell>
          </TableRow>
        ) : processError ? (
          <TableRow>
            <TableCell colSpan={6}>Error Fetching Process List</TableCell>
          </TableRow>
        ) : (
          processedProcessList.map((process: IProcessItem, index: number) => (
            <TableRow key={index}>
              <TableCell>{process.PID}</TableCell>
              <TableCell>{process.NAME}</TableCell>
              <TableCell>{process.PARAM}</TableCell>
              <TableCell>{process.CPU}</TableCell>
              <TableCell>{process.MEM}</TableCell>
              <TableCell>{process.PPID}</TableCell>
              <TableCell>{process.COMMAND}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
