'use client';

import type { IProcessItem } from 'src/types/dashboard';

import { Table, TableRow, TableBody, TableCell, TableHead, CircularProgress } from '@mui/material';

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
    <Table size="small">
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
