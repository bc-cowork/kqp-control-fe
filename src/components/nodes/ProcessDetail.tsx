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

import { useTranslate } from 'src/locales';
import { useGetProcesses } from 'src/actions/dashboard';
import { paths } from 'src/routes/paths';
import { useRouter } from 'next/navigation';

// ----------------------------------------------------------------------

type Props = {
  selectedNodeId: string;
  page?: string;
};

export function ProcessDetail({ selectedNodeId, page = 'process' }: Props) {
  const { t } = useTranslate('process');
  const router = useRouter();
  const { processes, processLoading, processesEmpty, processError } = useGetProcesses(
    selectedNodeId
  ) as {
    processes: IProcessItem[];
    processLoading: boolean;
    processesEmpty: boolean;
    processError: boolean;
  };

  const isDashboardPage = page === 'dashboard';

  return (
    <TableContainer
      component={Paper}
      sx={{ ...(isDashboardPage && { height: 'calc(100vh - 380px)' }) }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="right">{t('table_header.pid')}</TableCell>
            <TableCell>{t('table_header.name')}</TableCell>
            <TableCell>{t('table_header.param')}</TableCell>
            <TableCell align="right">{t('table_header.cpu')}</TableCell>
            <TableCell align="right">{t('table_header.mem')}</TableCell>
            <TableCell align="right">{t('table_header.ppid')}</TableCell>
            <TableCell>{t('table_header.command')}</TableCell>
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
              <TableRow
                key={index}
                sx={{ cursor: 'pointer' }}
                onClick={() => router.push(
                  `${paths.dashboard.nodes.processDetail(selectedNodeId, String(process.APPCODE))}`
                )}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    router.push(
                      `${paths.dashboard.nodes.processDetail(selectedNodeId, String(process.APPCODE))}`
                    );
                  }
                }}
              >
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
